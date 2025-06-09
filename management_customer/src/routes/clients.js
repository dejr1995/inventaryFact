import { Router } from 'express'
import { clientModel } from '../models/clientModel.js'

const router = Router()

router.post('/create', async (req, res) => {
  const { names, lastnames,  dni, email, direction } = req.body

  try {
    const id = await clientModel.create({
      names,
      lastnames,
      dni,
      email,
      direction,
    })
    res.send({ id })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const clients = await clientModel.listAll()
    res.status(200).json(clients)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/find/:id', async (req, res) => {
  const { id } = req.params
  try {
    const client = await clientModel.FindById(id)
    res.status(200).json(client)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})


router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const client = await clientModel.deleteClient(id)
    res.status(200).json(client)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { names, lastnames,  dni, email, direction } = req.body

  try {
    const updatedClient = await clientModel.updateClient(id, { names, lastnames,  dni, email, direction })
    res.status(200).json(updatedClient)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router
