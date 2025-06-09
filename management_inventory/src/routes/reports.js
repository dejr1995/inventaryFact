import { Router } from 'express';
import pool from "../services/db.js";

const router = Router();

// src/routes/reports.js
router.get('/low-stock', async (req, res) => {
    try {
      const [results] = await pool.query(`
        SELECT 
          BIN_TO_UUID(id) AS id,
          nombre,
          stock,
          stock_minimo
        FROM productos
        WHERE stock < stock_minimo
      `);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/movements', async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
      const [results] = await pool.query(`
        (SELECT 
          'entrada' AS tipo,
          BIN_TO_UUID(e.id) AS id,
          p.nombre AS producto,
          pr.nombre AS proveedor,
          e.stock_entrada AS cantidad,
          e.fecha_entrada AS fecha
        FROM entradas e
        JOIN productos p ON e.producto_id = p.id
        JOIN proveedores pr ON e.proveedor_id = pr.id
        WHERE e.fecha_entrada BETWEEN ? AND ?)
        
        UNION ALL
        
        (SELECT 
          'venta' AS tipo,
          BIN_TO_UUID(dv.id) AS id,
          p.nombre AS producto,
          c.nombres AS cliente,
          dv.cantidad,
          v.fecha AS fecha
        FROM detalle_venta dv
        JOIN productos p ON dv.producto_id = p.id
        JOIN ventas v ON dv.venta_id = v.id
        JOIN clientes c ON v.cliente_id = c.id
        WHERE v.fecha BETWEEN ? AND ?)
        ORDER BY fecha DESC
      `, [startDate, endDate, startDate, endDate]);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/ventas-por-categoria', async (req, res) => {
    try {
      const [results] = await pool.query(`
        SELECT 
          c.nombre AS categoria,
          SUM(dv.cantidad) AS total_vendido,
          SUM(dv.cantidad * p.precio) AS ingresos
        FROM detalle_venta dv
        JOIN productos p ON dv.producto_id = p.id
        JOIN categorias c ON p.categoria_id = c.id
        GROUP BY c.nombre
        ORDER BY ingresos DESC
      `);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

  export default router;