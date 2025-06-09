import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const genAuthToken = (user) => {
  if (!process.env.JWT_SECRET_KEY) throw new Error('JWT_SECRET no configurado');
  
  return jwt.sign(
    {
      user_id: user.id,
      email: user.email,
      role: user.rol_nombre,
      empresa_id: user.empresa_id
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '8h', algorithm: 'HS256' }
  );
};