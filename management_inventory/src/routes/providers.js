import { Router } from 'express'
import { providerModel } from '../models/providerModel.js'

const router = Router()

router.post('/create', async (req, res) => {
  const { name, email, phone, address } = req.body

  try {
    const id = await providerModel.create({
      name,
      email,
      phone,
      address,
    })
    res.send({ id })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const providers = await providerModel.listAll()
    res.status(200).json(providers)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/find/:id', async (req, res) => {
  const { id } = req.params
  try {
    const provider = await providerModel.findById(id)
    res.status(200).json(provider)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})


router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const provider = await providerModel.deleteProvider(id)
    res.status(200).json(provider)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, email, phone, address } = req.body

  try {
    const updatedProvider = await providerModel.updateProvider(id, { name, email, phone, address })
    res.status(200).json(updatedProvider)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.patch('/:id/stock', async (req, res) => {
  try {
    const newStock = await providerModel.updateStock(
      req.params.id,
      req.body.cantidad
    );
    res.json({ newStock });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router
