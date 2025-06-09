import crypto from 'node:crypto';
import Joi from 'joi';
import pool from '../services/db.js';

const schema = Joi.object({
  productId: Joi.string().required(),
  providerId: Joi.string().required(),
  quantity: Joi.number().integer().positive().required(),
  precio_compra: Joi.number().positive().precision(2).required()
});

export class entranceModel {
  static async registerInventoryEntry({ productId, providerId, quantity, precio_compra }) {
    const { error } = schema.validate({ productId, providerId, quantity, precio_compra });
    if (error) throw new Error(error.details[0].message);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Verificar proveedor
      const [proveedor] = await conn.query(
        'SELECT id FROM proveedores WHERE id = UUID_TO_BIN(?)',
        [providerId]
      );
      if (proveedor.length === 0) throw new Error('Proveedor no encontrado');

      // Verificar producto y bloquear registro
      const [producto] = await conn.query(
        'SELECT stock FROM productos WHERE id = UUID_TO_BIN(?) FOR UPDATE',
        [productId]
      );
      if (producto.length === 0) throw new Error('Producto no encontrado');

      // Calcular nuevo stock
      const nuevoStock = producto[0].stock + quantity;

      // Actualizar stock del producto
      await conn.query(
        'UPDATE productos SET stock = ? WHERE id = UUID_TO_BIN(?)',
        [nuevoStock, productId]
      );

      // Registrar entrada
      const entryId = crypto.randomUUID();
      await conn.query(
        `INSERT INTO entradas 
        (id, producto_id, proveedor_id, stock_entrada, precio_compra) 
        VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?)`,
        [entryId, productId, providerId, quantity, precio_compra]
      );

      await conn.commit();
      return { 
        entryId, 
        nuevoStock,
        producto: productId,
        proveedor: providerId
      };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async listAllInventoryEntries() {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(`
        SELECT 
          BIN_TO_UUID(e.id) AS id,
          BIN_TO_UUID(e.producto_id) AS producto_id,
          BIN_TO_UUID(e.proveedor_id) AS proveedor_id,
          p.nombre AS producto_nombre, 
          pr.nombre AS proveedor_nombre, 
          stock_entrada, 
          precio_compra,
          e.fecha_entrada
        FROM entradas e
        JOIN productos p ON e.producto_id = p.id
        JOIN proveedores pr ON e.proveedor_id = pr.id`
      );
      return rows;
    } finally {
      conn.release();
    }
  }

  static async deleteInventoryEntry(entryId) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
  
      // 1. Obtener datos de la entrada (con bloqueo FOR UPDATE)
      const [entry] = await conn.query(
        `SELECT 
          producto_id,
          stock_entrada 
        FROM entradas 
        WHERE id = UUID_TO_BIN(?) 
        FOR UPDATE`,  // Bloquea el registro
        [entryId]
      );
  
      if (entry.length === 0) {
        throw new Error('Entrada no encontrada');
      }
  
      const producto_id = entry[0].producto_id;  // Binario
      const stock_entrada = Number(entry[0].stock_entrada);
  
      // 2. Eliminar la entrada
      await conn.query(
        'DELETE FROM entradas WHERE id = UUID_TO_BIN(?)',
        [entryId]
      );
  
      // 3. Actualizar stock (operación atómica)
      await conn.query(
        `UPDATE productos 
        SET stock = GREATEST(stock - ?, 0)
        WHERE id = ?`,
        [stock_entrada, producto_id]
      );
  
      // 4. Verificar el stock actualizado
      const [producto] = await conn.query(
        'SELECT BIN_TO_UUID(id) AS productId, stock FROM productos WHERE id = ?',
        [producto_id]
      );
  
      await conn.commit();
  
      return {
        message: 'Stock actualizado correctamente',
        productId: producto[0].productId,
        nuevoStock: producto[0].stock
      };
  
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}