import express from 'express'
import dotenv from 'dotenv'

import cors from 'cors'
import clients from './src/routes/clients.js'
import reports from './src/routes/reports.js'

const app = express()

dotenv.config()
const PORT = process.env.PORT ?? 9000

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('API de Clientes')
})

app.use('/api/clients', clients)
app.use('/api/reports', reports)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
