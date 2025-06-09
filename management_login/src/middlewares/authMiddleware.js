import jwt from 'jsonwebtoken';
import pool from '../services/db.js';

export const authenticate = (requiredRoles = []) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Acceso no autorizado' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      
      const conn = await pool.getConnection();
      const [user] = await conn.query(
        `SELECT 
          BIN_TO_UUID(u.id) AS id,
          u.nombre,
          u.email,
          BIN_TO_UUID(u.rol_id) AS rol_id,
          r.nombre AS rol_nombre,
          BIN_TO_UUID(u.empresa_id) AS empresa_id,
          e.razon_social,
          e.numero_ruc,
          e.domicilio_fiscal,
          e.datos_contacto
        FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        LEFT JOIN empresa e ON u.empresa_id = e.id
        WHERE u.id = UUID_TO_BIN(?)`,
        [decoded.user_id]
      );

      conn.release();

      if (!user.length || (requiredRoles.length && !requiredRoles.includes(user[0].rol_nombre))) {
        return res.status(403).json({ error: 'Acceso prohibido' });
      }

      req.user = user[0];
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token inválido' });
    }
  };
};