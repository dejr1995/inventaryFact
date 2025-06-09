import crypto from 'node:crypto'
import Joi from 'joi'
import pool from '../services/db.js'

const schema = Joi.object({
  names: Joi.string().required(),
  lastnames: Joi.string().required(),
  dni: Joi.string().required(), 
  email: Joi.string().email().required(), 
  direction: Joi.string().required(),
})

export class clientModel {
  static async create ({ names, lastnames, dni, email, direction }) {
    const { error } = schema.validate({
      names,
      lastnames,
      dni,
      email,
      direction,
    })
    if (error) {
      throw new Error(error.details[0].message)
    }

    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      const [rows] = await conn.query(
        'SELECT * FROM clientes WHERE nombres = ? AND apellidos = ? AND dni = ? AND email = ? AND direccion = ? FOR UPDATE',
        [names, lastnames, dni, email, direction]
      )
      if (rows.length > 0) {
        throw new Error('Client already exists')
      }
      const id = crypto.randomUUID()

      await conn.query(
        `INSERT INTO clientes (id, nombres, apellidos, dni, email, direccion) VALUES (UUID_TO_BIN(?),?,?,?,?,?)`,
        [ id, names, lastnames, dni, email, direction ]
      )
      await conn.commit()
      return id
    }catch (error) {
      await conn.rollback()
      throw error
    } finally {
      conn.release()
    }
  }

  static async listAll() {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(
        `SELECT 
          BIN_TO_UUID(id) AS id, 
          nombres, 
          apellidos, 
          dni, 
          email,
          direccion,
          created_at,
          updated_at
        FROM clientes`
      );
      return result;
    } finally {
      conn.release();
    }
  }

  static async FindById (clientId) {
    const conn = await pool.getConnection()
    try {
      const [rows] = await conn.query(
        'SELECT * FROM clientes WHERE id = UUID_TO_BIN(?)',
        [clientId]
      )
      if (rows.length === 0) {
        throw new Error('Client not found')
      }
      return rows[0]
    } finally {
      conn.release()
    }
  }

  static async deleteClient (id) {
    const conn = await pool.getConnection()
    try {
      const [result] = await conn.query('DELETE FROM clientes WHERE id = UUID_TO_BIN(?)', [id])
      if (result.affectedRows === 0) {
        throw new Error('Client not found')
      }
      return result
    } finally {
      conn.release()
    }
  }

  static async updateClient (id, fields) {
    const { error } = schema.validate(fields)
    if (error) {
      throw new Error(error.details[0].message)
    }

    const conn = await pool.getConnection()
    try {
      await conn.query(`UPDATE clientes SET nombres = ?, apellidos = ?, dni = ?, email = ?, direccion = ? WHERE id = UUID_TO_BIN(?)`,
        [fields.names,fields.lastnames,fields.dni,fields.email,fields.direction, id])

      const [updated] = await conn.query('SELECT * FROM clientes WHERE id = UUID_TO_BIN(?)', [id])
      
      if (updated.length === 0) {
        throw new Error('Client not found')
      }
      return updated[0]
    } finally {
      conn.release()
    }
  }

}
