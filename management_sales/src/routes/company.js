import { Router } from 'express';
import { companyModel } from '../models/companyModel.js';

const router = Router();

// Ruta para agregar los datos de la empresa
router.post('/add', async (req, res) => {
  try {
    const result = await companyModel.addCompany(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para actualizar los datos de la empresa (opcional)
router.patch('/update', async (req, res) => {
  try {
    const result = await companyModel.updateCompany(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
