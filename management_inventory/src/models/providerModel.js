import crypto from 'crypto';
import Joi from 'joi';
import pool from '../services/db.js';

const schema = Joi.object({
  name: Joi.string().required().max(100),
  email: Joi.string().email().required().max(200),
  phone: Joi.string().required().max(20),
  address: Joi.string().required().max(200)
});

export class providerModel {
  static async create({ name, email, phone, address }) {
    const { error } = schema.validate({ name, email, phone, address });
    if (error) throw new Error(error.details[0].message);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Verificar nombre único
      const [existing] = await conn.query(
        'SELECT id FROM proveedores WHERE nombre = ? FOR UPDATE',
        [name]
      );
      if (existing.length > 0) throw new Error('El proveedor ya existe');

      const id = crypto.randomUUID();
      
      await conn.query(
        `INSERT INTO proveedores 
        (id, nombre, email, telefono, direccion) 
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)`,
        [id, name, email, phone, address]
      );

      await conn.commit();
      return { id, name, email, phone, address };
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
      const [providers] = await conn.query(
        `SELECT 
          BIN_TO_UUID(id) AS id,
          nombre, 
          email, 
          telefono, 
          direccion,
          created_at,
          updated_at
        FROM proveedores`
      );
      return providers;
    } finally {
      conn.release();
    }
  }

  static async findById(providerId) {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        `SELECT 
          BIN_TO_UUID(id) AS id,
          nombre, 
          email, 
          telefono, 
          direccion,
          created_at,
          updated_at
        FROM proveedores 
        WHERE id = UUID_TO_BIN(?)`,
        [providerId]
      );
      if (rows.length === 0) throw new Error('Proveedor no encontrado');
      return rows[0];
    } finally {
      conn.release();
    }
  }

  static async deleteProvider(id) {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(
        'DELETE FROM proveedores WHERE id = UUID_TO_BIN(?)',
        [id]
      );
      if (result.affectedRows === 0) throw new Error('Proveedor no encontrado');
      return { message: 'Proveedor eliminado correctamente' };
    } finally {
      conn.release();
    }
  }

  static async updateProvider(id, fields) {
    const { error } = schema.validate(fields);
    if (error) throw new Error(error.details[0].message);

    const conn = await pool.getConnection();
    try {
      await conn.query(
        `UPDATE proveedores SET
          nombre = ?,
          email = ?,
          telefono = ?,
          direccion = ?
        WHERE id = UUID_TO_BIN(?)`,
        [fields.name, fields.email, fields.phone, fields.address, id]
      );

      const [updated] = await conn.query(
        `SELECT 
          BIN_TO_UUID(id) AS id,
          nombre, 
          email, 
          telefono, 
          direccion,
          created_at,
          updated_at
        FROM proveedores 
        WHERE id = UUID_TO_BIN(?)`,
        [id]
      );
      
      if (updated.length === 0) throw new Error('Proveedor no encontrado');
      return updated[0];
    } finally {
      conn.release();
    }
  }
}