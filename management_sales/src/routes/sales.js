import { Router } from 'express';
import { saleModel } from '../models/saleModel.js';

const router = Router();

router.post('/create', async (req, res) => {
  try {
    const result = await saleModel.createSale(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const sale = await saleModel.getSale(req.params.id);
    res.status(200).json(sale);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.patch('/update-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const result = await saleModel.updateSaleStatus(id, estado);
    res.status(200).json({ message: "Estado actualizado", ...result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const sales = await saleModel.listSales();
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/adjust-total/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amountToSubtract } = req.body;

    const result = await saleModel.adjustTotal(id, amountToSubtract);
    res.status(200).json({ message: 'Total ajustado correctamente', ...result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


export default router;