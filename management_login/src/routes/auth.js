import { Router } from 'express';
import { authModel } from '../models/authModel.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { genAuthToken } from '../../utils/genAuthToken.js';
import bcrypt from 'bcrypt';
import { roleModel } from '../models/roleModel.js';
import pool from '../services/db.js';

const router = Router();

router.post('/users', authenticate(['superadmin', 'admin']), async (req, res) => {
  try {
    let targetRoleId;

    if (req.user.rol_nombre === 'superadmin') {
      targetRoleId = process.env.ADMIN_ROLE_UUID;
    } else if (req.user.rol_nombre === 'admin') {
      targetRoleId = process.env.USER_ROLE_UUID;
    } else {
      throw new Error('No tienes permisos para crear usuarios');
    }

    req.body.rol_id = targetRoleId;

    if (req.user.rol_nombre === 'admin' && req.user.empresa_id) {
      req.body.empresa_id = req.user.empresa_id;
    }

    const user = await authModel.createUser(req.body);
    
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const user = await authModel.createUser(req.body);
    const token = genAuthToken(user);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authModel.findByEmail(email);
    if (!user) throw new Error('Credenciales inválidas');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Credenciales inválidas');

    const token = genAuthToken(user);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/me', authenticate(['admin', 'user']), async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/me', authenticate(['admin', 'user']), async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario autenticado
    
    // Validar que no se intente actualizar campos restringidos
    const forbiddenFields = ['rol_id', 'empresa_id'];
    Object.keys(req.body).forEach(field => {
      if (forbiddenFields.includes(field)) {
        throw new Error(`No puedes actualizar el campo: ${field}`);
      }
    });

    const updatedUser = await authModel.updateUser(userId, req.body);
    const token = genAuthToken(updatedUser); // Generar nuevo token si cambió email
    
    res.json({ 
      user: updatedUser,
      token // Enviar nuevo token por si cambió el email
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/roles', async (req, res) => {
  try {
    const roles = await roleModel.getAllRoles()
    res.status(200).json(roles)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/admin', authenticate(['admin']), (req, res) => {
  res.json({ message: 'Acceso administrativo concedido' });
});

router.post('/company', authenticate(['admin', 'user']), async (req, res) => {
  const conn = await pool.getConnection();
  try {
      await conn.beginTransaction();

      const { razon_social, numero_ruc, domicilio_fiscal, datos_contacto } = req.body;
      const userId = req.user.id;

      // Verificar permisos según rol
      if (req.user.rol_id === 'user') {
          // Validar campos permitidos para usuarios comunes
          const allowedFields = ['datos_contacto'];
          const invalidFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
          
          if (invalidFields.length > 0) {
              throw new Error(`Usuarios regulares solo pueden actualizar: ${allowedFields.join(', ')}`);
          }
      }

      // Validación de campos requeridos
      const requiredFields = ['razon_social', 'numero_ruc', 'domicilio_fiscal', 'datos_contacto'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
          throw new Error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
      }

      // Verificar si el usuario ya tiene empresa
      const [currentUser] = await conn.query(
          'SELECT empresa_id FROM usuarios WHERE id = UUID_TO_BIN(?)',
          [userId]
      );

      let empresaId = currentUser[0].empresa_id;

      // Crear nueva empresa si no existe
      if (!empresaId) {
          if (req.user.rol_nombre !== 'admin') {
              throw new Error('Solo administradores pueden crear nuevas empresas');
          }
          
          empresaId = crypto.randomUUID();
          await conn.query(
              `INSERT INTO empresa 
              (id, razon_social, numero_ruc, domicilio_fiscal, datos_contacto)
              VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)`,
              [empresaId, razon_social, numero_ruc, domicilio_fiscal, datos_contacto]
          );

          // Vincular empresa al usuario
          await conn.query(
              `UPDATE usuarios 
              SET empresa_id = UUID_TO_BIN(?) 
              WHERE id = UUID_TO_BIN(?)`,
              [empresaId, userId]
          );
      } else {
          // Actualizar empresa existente
          await conn.query(
              `UPDATE empresa 
              SET razon_social = ?, 
                  numero_ruc = ?, 
                  domicilio_fiscal = ?, 
                  datos_contacto = ?
              WHERE id = UUID_TO_BIN(?)`,
              [razon_social, numero_ruc, domicilio_fiscal, datos_contacto, empresaId]
          );
      }

      await conn.commit();
      
      // Respuesta diferenciada por rol
      const responseMessage = req.user.rol_nombre === 'admin' 
          ? 'Empresa actualizada con privilegios de administrador' 
          : 'Información de contacto actualizada exitosamente';

      res.status(200).json({
          success: true,
          message: responseMessage,
          empresa: {
              id: empresaId,
              razon_social,
              numero_ruc,
              domicilio_fiscal,
              datos_contacto
          }
      });

  } catch (error) {
      await conn.rollback();
      console.error('Error en /company:', error);
      
      const statusCode = error.message.includes('No tienes permiso') ? 403 : 500;
      res.status(statusCode).json({ 
          error: error.message || 'Error interno del servidor' 
      });
  } finally {
      conn.release();
  }
});

router.get('/users/role/:roleId', authenticate(['admin']), async (req, res) => {
  try {
    const users = await authModel.getUsersByRole(req.params.roleId);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await authModel.deleteUser(id)
    res.status(200).json(user)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

export default router;