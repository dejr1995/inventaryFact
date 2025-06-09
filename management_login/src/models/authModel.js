import crypto from 'node:crypto';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import pool from '../services/db.js';

const userSchema = Joi.object({
  nombre: Joi.string().required().max(100),
  email: Joi.string().email().required().max(200),
  password: Joi.string().min(6).required(),
  rol_id: Joi.string().required(),
  empresa_id: Joi.alternatives().try(
    Joi.string().uuid(), 
    Joi.allow(null)
  ).optional()
});

export class authModel {
  static async createUser({ nombre, email, password, rol_id, empresa_id = null }) {
    const { error } = userSchema.validate({ nombre, email, password, rol_id, empresa_id });
    if (error) throw new Error(error.details[0].message);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [existing] = await conn.query(
        'SELECT id FROM usuarios WHERE email = ? FOR UPDATE',
        [email]
      );
      if (existing.length > 0) throw new Error('El email ya está registrado');

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = crypto.randomUUID();

      await conn.query(
        `INSERT INTO usuarios 
        (id, nombre, email, password, rol_id, empresa_id) 
        VALUES (UUID_TO_BIN(?), ?, ?, ?, UUID_TO_BIN(?), UUID_TO_BIN(?))`,
        [userId, nombre, email, hashedPassword, rol_id, empresa_id]
      );

      await conn.commit();
      return this.getUserById(userId);
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async getUserById(userId) {
    const conn = await pool.getConnection();
    try {
      const [users] = await conn.query(
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
        [userId]
      );
      return users[0];
    } finally {
      conn.release();
    }
  }
  
  static async findByEmail(email) {
    const conn = await pool.getConnection();
    try {
      const [users] = await conn.query(
        `SELECT 
          BIN_TO_UUID(u.id) AS id,
          u.password,
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
        WHERE u.email = ?`,
        [email]
      );
      return users[0];
    } finally {
      conn.release();
    }
  }

  static async updateUser(userId, updateData) {
    const updateSchema = Joi.object({
      nombre: Joi.string().max(100),
      password: Joi.string().min(6),
    }).min(1); // Al menos un campo requerido
  
    const { error } = updateSchema.validate(updateData);
    if (error) throw new Error(error.details[0].message);
  
    if (updateData.email) {
      throw new Error("No se puede actualizar el correo electrónico.");
    }
  
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
  
      // Hashear nueva contraseña si existe
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }
  
      // Construir consulta dinámica
      const fields = [];
      const values = [];
  
      Object.entries(updateData).forEach(([key, value]) => {
        fields.push(`${key} = ?`);
        values.push(value);
      });
  
      values.push(userId);
  
      await conn.query(
        `UPDATE usuarios 
        SET ${fields.join(", ")} 
        WHERE id = UUID_TO_BIN(?)`,
        values
      );
  
      await conn.commit();
      return this.getUserById(userId);
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async getUsersByRole(roleId) {
    const conn = await pool.getConnection();
    try {
      const [users] = await conn.query(
        `SELECT 
          BIN_TO_UUID(u.id) AS id,
          u.nombre,
          u.email,
          BIN_TO_UUID(u.rol_id) AS rol_id,
          r.nombre AS rol_nombre,
          BIN_TO_UUID(u.empresa_id) AS empresa_id,
          e.razon_social
        FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        LEFT JOIN empresa e ON u.empresa_id = e.id
        WHERE u.rol_id = UUID_TO_BIN(?)`,
        [roleId]
      );
      return users;
    } finally {
      conn.release();
    }
  }

  static async deleteUser(id) {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(
        'DELETE FROM usuarios WHERE id = UUID_TO_BIN(?)',
        [id]
      );
      if (result.affectedRows === 0) throw new Error('Usuario no encontrado');
      return { message: 'Usuario eliminado correctamente' };
    } finally {
      conn.release();
    }
  }
}