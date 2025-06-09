// Reporte de ventas detallado
import { Router } from 'express';
import pool from '../services/db.js';

const router = Router();

router.get('/sales', async (req, res) => {
    const { startDate, endDate } = req.query;
    
    try {
      const [results] = await pool.query(`
        SELECT 
          v.fecha,
          CONCAT(s.serie, '-', LPAD(v.numero, 6, '0')) AS comprobante,
          CONCAT(c.nombres, ' ', c.apellidos) AS cliente,
          SUM(dv.cantidad) AS items,
          SUM(dv.cantidad * dv.precio_unitario) AS total
        FROM ventas v
        JOIN detalle_venta dv ON v.id = dv.venta_id
        JOIN clientes c ON v.cliente_id = c.id
        JOIN series_facturacion s ON v.serie_id = s.id
        WHERE v.fecha BETWEEN ? AND ?
        GROUP BY v.id
        ORDER BY v.fecha DESC
      `, [startDate, endDate]);
  
      res.json(results.map(item => ({
        ...item,
        total: Number(item.total)
      })));
      
    } catch (error) {
      res.status(500).json({ 
        error: error.message 
      });
    }
  });
  
  // Productos más vendidos
  router.get('/top-products', async (req, res) => {
    try {
      const [results] = await pool.query(`
        SELECT 
          p.nombre AS producto,
          SUM(dv.cantidad) AS unidades_vendidas,
          SUM(dv.cantidad * dv.precio_unitario) AS ingresos
        FROM detalle_venta dv
        JOIN productos p ON dv.producto_id = p.id
        GROUP BY p.id
        ORDER BY ingresos DESC
        LIMIT 10
      `);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Ventas por categoría
router.get('/sales-by-category', async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const [results] = await pool.query(`
      SELECT 
        cat.nombre AS categoria,
        SUM(dv.cantidad) AS total_items,
        SUM(dv.cantidad * dv.precio_unitario) AS total_ventas
      FROM ventas v
      JOIN detalle_venta dv ON v.id = dv.venta_id
      JOIN productos p ON dv.producto_id = p.id
      JOIN categorias cat ON p.categoria_id = cat.id
      WHERE v.fecha BETWEEN ? AND ?
      GROUP BY cat.id
      ORDER BY total_ventas DESC
    `, [startDate, endDate]);

    res.json(results.map(r => ({
      ...r,
      total_ventas: Number(r.total_ventas),
      total_items: Number(r.total_items)
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


  export default router;