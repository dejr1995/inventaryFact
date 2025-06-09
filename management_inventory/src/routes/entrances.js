import { Router } from 'express'
import { entranceModel } from '../models/entranceModel.js'

const router = Router()

router.post('/create', async (req, res) => {
  const { productId, providerId, quantity, precio_compra } = req.body;
  try {
    const result = await entranceModel.registerInventoryEntry({ productId, providerId, quantity, precio_compra });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const entries = await entranceModel.listAllInventoryEntries();
    res.status(200).json(entries);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await entranceModel.deleteInventoryEntry(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router
