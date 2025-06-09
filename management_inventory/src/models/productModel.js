import crypto from 'crypto';
import Joi from 'joi';
import pool from '../services/db.js';

const schema = Joi.object({
  name: Joi.string().required().max(100),
  description: Joi.string().required().max(255),
  price: Joi.number().positive().precision(2).required(),
  stock: Joi.number().integer().min(0).required(),
  categoria_id: Joi.string().required()
});

export class productModel {
  static async create({ name, description, price, stock = 0, categoria_id }) {
    const { error } = schema.validate({ name, description, price, stock, categoria_id });
    if (error) throw new Error(error.details[0].message);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Verificar nombre único
      const [existing] = await conn.query(
        'SELECT id FROM productos WHERE nombre = ? FOR UPDATE',
        [name]
      );
      if (existing.length > 0) throw new Error('El producto ya existe');

      const id = crypto.randomUUID();
      
      await conn.query(
        `INSERT INTO productos 
        (id, nombre, descripcion, precio, stock, categoria_id) 
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, UUID_TO_BIN(?))`,
        [id, name, description, price, stock, categoria_id ]
      );

      await conn.commit();
      return { id, name, description, price, stock, categoria_id  };
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
      const [products] = await conn.query(
        `SELECT 
          BIN_TO_UUID(id) AS id, 
          nombre, 
          descripcion, 
          precio, 
          stock,
          BIN_TO_UUID(categoria_id) AS categoria_id,
          created_at,
          updated_at
        FROM productos`
      );
      return products;
    } finally {
      conn.release();
    }
  }

  static async findById(productId) {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        `SELECT 
          BIN_TO_UUID(id) AS id, 
          nombre, 
          descripcion, 
          precio, 
          stock,
          BIN_TO_UUID(categoria_id) AS categoria_id,
          created_at,
          updated_at
        FROM productos 
        WHERE id = UUID_TO_BIN(?)`,
        [productId]
      );
      if (rows.length === 0) throw new Error('Producto no encontrado');
      return rows[0];
    } finally {
      conn.release();
    }
  }

  static async deleteProduct(id) {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(
        'DELETE FROM productos WHERE id = UUID_TO_BIN(?)',
        [id]
      );
      if (result.affectedRows === 0) throw new Error('Producto no encontrado');
      return { message: 'Producto eliminado correctamente' };
    } finally {
      conn.release();
    }
  }

  static async updateProduct(id, fields) {
    const { error } = schema.validate(fields);
    if (error) throw new Error(error.details[0].message);

    const conn = await pool.getConnection();
    try {
      await conn.query(
        `UPDATE productos SET
          nombre = ?,
          descripcion = ?,
          precio = ?,
          stock = ?,
          categoria_id = UUID_TO_BIN(?)
        WHERE id = UUID_TO_BIN(?)`,
        [fields.name, fields.description, fields.price, fields.stock, fields.categoria_id, id]
      );

      const [updated] = await conn.query(
        `SELECT 
          BIN_TO_UUID(id) AS id, 
          nombre, 
          descripcion, 
          precio, 
          stock,
          BIN_TO_UUID(categoria_id) AS categoria_id,
          created_at,
          updated_at
        FROM productos 
        WHERE id = UUID_TO_BIN(?)`,
        [id]
      );
      
      if (updated.length === 0) throw new Error('Producto no encontrado');
      return updated[0];
    } finally {
      conn.release();
    }
  }
  
  static async updateStock(productId, quantity) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      
      const [product] = await conn.query(
        `SELECT stock FROM productos 
        WHERE id = UUID_TO_BIN(?) FOR UPDATE`,
        [productId]
      );
      
      if (product.length === 0) throw new Error('Producto no existe');
      
      const newStock = product[0].stock - quantity;
      if (newStock < 0) throw new Error('Stock no puede ser negativo');
      
      await conn.query(
        `UPDATE productos SET stock = ? 
        WHERE id = UUID_TO_BIN(?)`,
        [newStock, productId]
      );
      
      await conn.commit();
      return newStock;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}