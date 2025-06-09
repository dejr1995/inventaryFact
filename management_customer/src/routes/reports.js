import { Router } from 'express'
import pool from "../services/db.js";

const router = Router()

// src/routes/reports.js
router.get('/top-clients', async (req, res) => {
    try {
      const [results] = await pool.query(`
        SELECT 
          BIN_TO_UUID(c.id) AS id,
          CONCAT(c.nombres, ' ', c.apellidos) AS cliente,
          COUNT(v.id) AS total_compras,
          SUM(v.total) AS gasto_total
        FROM clientes c
        LEFT JOIN ventas v ON c.id = v.cliente_id
        GROUP BY c.id
        ORDER BY gasto_total DESC
        LIMIT 10
      `);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  export default router