import { Router } from 'express';
import { categoryModel } from '../models/categoryModel.js';

const router = Router();

// Crear una nueva categoría
router.post('/create', async (req, res) => {
  const { name } = req.body;
  try {
    const category = await categoryModel.create({ name });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categories = await categoryModel.listAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener categoría por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const category = await categoryModel.findById(id);
    res.status(200).json(category);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Eliminar categoría
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await categoryModel.deleteCategory(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Actualizar categoría
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedCategory = await categoryModel.updateCategory(id, { name });
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
