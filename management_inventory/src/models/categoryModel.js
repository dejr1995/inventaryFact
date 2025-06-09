import Joi from 'joi';
import pool from '../services/db.js';

const schema = Joi.object({
  name: Joi.string().required().max(100),
});

export class categoryModel {
  static async create({ name }) {
    const { error } = schema.validate({ name });
    if (error) throw new Error(error.details[0].message);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Verificar nombre único
      const [existing] = await conn.query(
        'SELECT id FROM categorias WHERE nombre = ? FOR UPDATE',
        [name]
      );
      if (existing.length > 0) throw new Error('La categoría ya existe');

      const id = crypto.randomUUID();

      await conn.query(
        `INSERT INTO categorias 
        (id, nombre) 
        VALUES (UUID_TO_BIN(?), ?)`,
        [id, name]
      );

      await conn.commit();
      return { id, name };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async listAll() {
    const conn = await pool.getConnection();
    try {
      const [categories] = await conn.query(
        `SELECT 
          BIN_TO_UUID(id) AS id, 
          nombre 
        FROM categorias`
      );
      return categories;
    } finally {
      conn.release();
    }
  }

  static async findById(categoryId) {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        `SELECT 
          BIN_TO_UUID(id) AS id, 
          nombre 
        FROM categorias 
        WHERE id = UUID_TO_BIN(?)`,
        [categoryId]
      );
      if (rows.length === 0) throw new Error('Categoría no encontrada');
      return rows[0];
    } finally {
      conn.release();
    }
  }

  static async deleteCategory(id) {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(
        'DELETE FROM categorias WHERE id = UUID_TO_BIN(?)',
        [id]
      );
      if (result.affectedRows === 0) throw new Error('Categoría no encontrada');
      return { message: 'Categoría eliminada correctamente' };
    } finally {
      conn.release();
    }
  }

  static async updateCategory(id, fields) {
    const { error } = schema.validate(fields);
    if (error) throw new Error(error.details[0].message);

    const conn = await pool.getConnection();
    try {
      await conn.query(
        `UPDATE categorias SET
          nombre = ?,
        WHERE id = UUID_TO_BIN(?)`,
        [fields.name, id]
      );

      const [updated] = await conn.query(
        `SELECT 
          BIN_TO_UUID(id) AS id, 
          nombre
        FROM categorias 
        WHERE id = UUID_TO_BIN(?)`,
        [id]
      );
      
      if (updated.length === 0) throw new Error('Categoría no encontrada');
      return updated[0];
    } finally {
      conn.release();
    }
  }
}
