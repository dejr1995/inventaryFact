import express from 'express'
import dotenv from 'dotenv'

import cors from 'cors'
import sales from './src/routes/sales.js'
import company from './src/routes/company.js'
import reports from './src/routes/reports.js'
import axios from 'axios'

const app = express()

dotenv.config()
const PORT = process.env.PORT ?? 9000

app.use(express.json())
app.use(cors())

const productsAPI = axios.create({
  baseURL: 'http://localhost:3000/api/products'
});

const clientsAPI = axios.create({
  baseURL: 'http://localhost:3001/api/clients'
});

app.locals.api = { productsAPI, clientsAPI };

app.use('/api/sales', sales);
app.use('/api/company', company);
app.use('/api/reports',reports )

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
