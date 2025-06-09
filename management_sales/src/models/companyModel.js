import crypto from 'node:crypto';
import Joi from 'joi';
import pool from '../services/db.js';

const schema = Joi.object({
  razonSocial: Joi.string().required(),
  numeroRUC: Joi.string().required(),
  domicilioFiscal: Joi.string().required(),
  datosContacto: Joi.string().required(),
});

export class companyModel {
  static async addCompany({ razonSocial, numeroRUC, domicilioFiscal, datosContacto }) {
    const { error } = schema.validate({ razonSocial, numeroRUC, domicilioFiscal, datosContacto });
    if (error) throw new Error(error.details[0].message);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const companyId = crypto.randomUUID();
      await conn.query(
        `INSERT INTO empresa (id, razon_social, numero_ruc, domicilio_fiscal, datos_contacto)
         VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)`,
        [companyId, razonSocial, numeroRUC, domicilioFiscal, datosContacto]
      );
      await conn.commit();
      return { message: "Datos de la empresa agregados correctamente", companyId };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async updateCompany({ razonSocial, numeroRUC, domicilioFiscal, datosContacto }) {
    const { error } = schema.validate({ razonSocial, numeroRUC, domicilioFiscal, datosContacto });
    if (error) throw new Error(error.details[0].message);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(
        `UPDATE empresa
         SET razon_social = ?, numero_ruc = ?, domicilio_fiscal = ?, datos_contacto = ?`,
        [razonSocial, numeroRUC, domicilioFiscal, datosContacto]
      );
      await conn.commit();
      return { message: "Datos de la empresa actualizados correctamente" };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}
