import pool from '../services/db.js';

export class roleModel {
  static async getAllRoles() {
    const conn = await pool.getConnection();
    try {
      const [roles] = await conn.query(
        `SELECT 
          BIN_TO_UUID(id) AS id,
          nombre,
          descripcion
        FROM roles`
      );
      return roles;
    } finally {
      conn.release();
    }
  }
}