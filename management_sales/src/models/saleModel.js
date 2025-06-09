import crypto from 'node:crypto';
import Joi from 'joi';
import pool from '../services/db.js';

const schema = Joi.object({
  clientId: Joi.string().required(),
  serieId: Joi.string().required(),
  metodo_pago: Joi.string().valid('Efectivo', 'Transferencia', 'Otro').required(),
  codigo_operacion: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required()
    })
  ).min(1).required()
});

export class saleModel {
  static async createSale({ clientId, serieId, metodo_pago, codigo_operacion, items }) {
    const { error } = schema.validate({ clientId, serieId, metodo_pago, codigo_operacion, items });
    if (error) throw new Error(error.details[0].message);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Verificar existencia de cliente y serie (ahora, se busca por el campo "serie")
      const [client] = await conn.query(
        'SELECT 1 FROM clientes WHERE id = UUID_TO_BIN(?)',
        [clientId]
      );
      if (client.length === 0) throw new Error('Cliente no existe');

      const [serie] = await conn.query(
        'SELECT * FROM series_facturacion WHERE serie = ? AND activa = TRUE FOR UPDATE',
        [serieId]
      );
      if (serie.length === 0) throw new Error('Serie inválida o inactiva');

      // 2. Generar número de comprobante
      const nextNumber = serie[0].ultimo_numero + 1;
      
      // 3. Validar y reservar stock
      let total = 0;
      for (const item of items) {
        const [product] = await conn.query(
          `SELECT precio, stock FROM productos 
          WHERE id = UUID_TO_BIN(?) FOR UPDATE`,
          [item.productId]
        );
        if (product.length === 0) throw new Error(`Producto ${item.productId} no existe`);
        if (product[0].stock < item.quantity) throw new Error(`Stock insuficiente para producto ${item.productId}`);
        
        total += product[0].precio * item.quantity;
      }

      // 4. Crear venta
      const saleId = crypto.randomUUID();
      await conn.query(
        `INSERT INTO ventas 
         (id, cliente_id, serie_id, numero, total, metodo_pago, codigo_operacion)
         VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, ?, ?)`,
        [saleId, clientId, serie[0].id, nextNumber, total, metodo_pago, codigo_operacion]
      );      

      // 5. Crear detalles y actualizar stock
      for (const item of items) {
        const [product] = await conn.query(
          'SELECT precio FROM productos WHERE id = UUID_TO_BIN(?)',
          [item.productId]
        );
        
        await conn.query(
          `INSERT INTO detalle_venta 
          (id, venta_id, producto_id, cantidad, precio_unitario)
          VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?)`,
          [crypto.randomUUID(), saleId, item.productId, item.quantity, product[0].precio]
        );

        await conn.query(
          `UPDATE productos SET stock = stock - ?
          WHERE id = UUID_TO_BIN(?)`,
          [item.quantity, item.productId]
        );
      }

      // 6. Actualizar último número de serie (ahora, se actualiza por el campo "serie")
      await conn.query(
        `UPDATE series_facturacion 
        SET ultimo_numero = ?
        WHERE serie = ?`,
        [nextNumber, serieId]
      );

      await conn.commit();
      
      return {
        saleId,
        comprobante: `${serie[0].serie}-${nextNumber.toString().padStart(6, '0')}`,
        total
      };

    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async getSale(saleId) {
    const conn = await pool.getConnection();
    try {
      // Obtener la venta junto con la serie (para el comprobante, etc.)
      const [sale] = await conn.query(
        `SELECT 
           BIN_TO_UUID(v.id) AS saleId,
           BIN_TO_UUID(v.cliente_id) AS clientId,
           BIN_TO_UUID(v.serie_id) AS serieId,
           s.serie,
           total,
           metodo_pago,
           codigo_operacion,
           v.numero,
           CONCAT(s.serie, '-', LPAD(v.numero, 6, '0')) AS comprobante,
           v.total,
           v.fecha,
           v.estado
         FROM ventas v
         JOIN series_facturacion s ON v.serie_id = s.id
         WHERE v.id = UUID_TO_BIN(?)`,
        [saleId]
      );
      
      if (sale.length === 0) throw new Error('Venta no encontrada');
  
      // Obtener los detalles de la venta
      const [details] = await conn.query(
        `SELECT
         BIN_TO_UUID(d.producto_id) AS productId,
         d.cantidad AS quantity,
         d.precio_unitario AS unitPrice,
         p.nombre AS productoNombre
       FROM detalle_venta d
       JOIN productos p ON d.producto_id = p.id
       WHERE d.venta_id = UUID_TO_BIN(?)`,
        [saleId]
      );
      
      // Obtener los datos del cliente usando el clientId obtenido de la venta
      const [clientData] = await conn.query(
        `SELECT 
           BIN_TO_UUID(id) AS id,
           nombres,
           apellidos,
           dni,
           email,
           direccion
         FROM clientes
         WHERE id = UUID_TO_BIN(?)`,
        [sale[0].clientId]
      );
      
      // Agregar la información del cliente y los detalles a la respuesta de la venta
      const saleData = sale[0];
      saleData.client = clientData.length > 0 ? clientData[0] : null;
      saleData.items = details;
      
      return saleData;
    } finally {
      conn.release();
    }
  }

  static async updateSaleStatus(saleId, newState) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      
      // Validar que newState sea uno permitido
      if (!["Pendiente", "Pagado", "Anulado"].includes(newState)) {
        throw new Error("Estado no válido. Los estados permitidos son: Pendiente, Pagado, Anulado.");
      }
      
      // Si se cambia a Anulado, revertir los cambios de stock
      if (newState === "Anulado") {
        const [details] = await conn.query(
          `SELECT producto_id, cantidad 
           FROM detalle_venta 
           WHERE venta_id = UUID_TO_BIN(?)`,
          [saleId]
        );
        
        for (const item of details) {
          await conn.query(
            `UPDATE productos SET stock = stock + ?
             WHERE id = ?`,
            [item.cantidad, item.producto_id]
          );
        }
      }
      
      const [result] = await conn.query(
        `UPDATE ventas SET estado = ? WHERE id = UUID_TO_BIN(?)`,
        [newState, saleId]
      );
      
      if (result.affectedRows === 0) {
        throw new Error("Venta no encontrada");
      }
      
      await conn.commit();
      return { saleId, estado: newState };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
  
  static async cancelSale(saleId) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      
      // Revertir stock
      const [details] = await conn.query(
        `SELECT producto_id, cantidad 
        FROM detalle_venta 
        WHERE venta_id = UUID_TO_BIN(?)`,
        [saleId]
      );
      
      for (const item of details) {
        await conn.query(
          `UPDATE productos SET stock = stock + ?
          WHERE id = ?`,
          [item.cantidad, item.producto_id]
        );
      }
      
      // Marcar venta como Anulado
      await conn.query(
        `UPDATE ventas SET estado = 'Anulado'
        WHERE id = UUID_TO_BIN(?)`,
        [saleId]
      );
      
      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async listSales() {
    const conn = await pool.getConnection();
    try {
      const [sales] = await conn.query(`
        SELECT 
          BIN_TO_UUID(v.id) AS saleId,
          CONCAT(s.serie, '-', LPAD(v.numero, 6, '0')) AS comprobante,
          v.total,
          v.fecha,
          v.estado,
          BIN_TO_UUID(v.cliente_id) AS clientId
        FROM ventas v
        JOIN series_facturacion s ON v.serie_id = s.id
        ORDER BY v.fecha DESC
      `);
      return sales;
    } finally {
      conn.release();
    }
  }

  static async adjustTotal(saleId, amountToSubtract) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Verificar que la venta exista
        const [sale] = await conn.query(
            'SELECT total, estado FROM ventas WHERE id = UUID_TO_BIN(?)',
            [saleId]
        );
        if (sale.length === 0) throw new Error('Venta no encontrada');

        // Obtener el total actual de la venta
        const currentTotal = parseFloat(sale[0].total);

        // Verificar que amountToSubtract sea un número válido
        const amount = parseFloat(amountToSubtract);
        if (isNaN(amount) || amount < 0) throw new Error('El importe a restar debe ser un número válido y positivo');

        // Calcular el nuevo total
        const newTotal = currentTotal - amount;
        if (newTotal < 0) throw new Error('No se puede reducir el total por debajo de 0');

        // Actualizar el total de la venta
        await conn.query(
            'UPDATE ventas SET total = ? WHERE id = UUID_TO_BIN(?)',
            [newTotal, saleId]
        );

        // Si el total es 0, actualizar el estado a "Pagado"
        if (newTotal === 0 && sale[0].estado !== "Pagado") {
            await conn.query(
                'UPDATE ventas SET estado = "Pagado" WHERE id = UUID_TO_BIN(?)',
                [saleId]
            );
        }

        await conn.commit();

        return { saleId, newTotal, estado: newTotal === 0 ? "Pagado" : sale[0].estado };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

  
}