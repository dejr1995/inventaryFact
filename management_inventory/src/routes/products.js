import { Router } from 'express'
import { productModel } from '../models/productModel.js'

const router = Router()

router.post('/create', async (req, res) => {
  const { name, description, price, stock, categoria_id } = req.body

  try {
    const id = await productModel.create({
      name,
      description,
      price,
      stock,
      categoria_id,
    })
    res.send({ id })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const products = await productModel.listAll()
    res.status(200).json(products)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/find/:id', async (req, res) => {
  const { id } = req.params
  try {
    const product = await productModel.findById(id)
    res.status(200).json(product)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})


router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const product = await productModel.deleteProduct(id)
    res.status(200).json(product)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, description, price, stock, categoria_id } = req.body

  try {
    const updatedProduct = await productModel.updateProduct(id, { name, description, price, stock, categoria_id })
    res.status(200).json(updatedProduct)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.patch('/:id/stock', async (req, res) => {
  try {
    const newStock = await productModel.updateStock(
      req.params.id,
      req.body.cantidad
    );
    res.json({ newStock });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router
