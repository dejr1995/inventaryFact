import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import auth from './src/routes/auth.js';
import pool from './src/services/db.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT ?? 9000;

app.use(express.json());
app.use(cors());

const initDB = async () => {
  // Roles fijos con UUIDs predefinidos
  const SUPERADMIN_ROLE_UUID = process.env.SUPERADMIN_ROLE_UUID;
  const ADMIN_ROLE_UUID = process.env.ADMIN_ROLE_UUID;
  const USER_ROLE_UUID = process.env.USER_ROLE_UUID;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS roles (
      id BINARY(16) PRIMARY KEY,
      nombre VARCHAR(50) UNIQUE NOT NULL,
      descripcion VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id BINARY(16) PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(200) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      rol_id BINARY(16) NOT NULL,
      empresa_id BINARY(16),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (rol_id) REFERENCES roles(id),
      FOREIGN KEY (empresa_id) REFERENCES empresa(id) ON DELETE SET NULL
    )
  `);

  // Insertar roles base
  await pool.query(`
    INSERT IGNORE INTO roles (id, nombre, descripcion)
    VALUES
      (UUID_TO_BIN('${SUPERADMIN_ROLE_UUID}'), 'superadmin', 'Super Administrador con todos los privilegios'),
      (UUID_TO_BIN('${ADMIN_ROLE_UUID}'), 'admin', 'Administrador del sistema'),
      (UUID_TO_BIN('${USER_ROLE_UUID}'), 'user', 'Usuario estándar')
  `);
};

app.use('/api/auth', auth);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
  });
});