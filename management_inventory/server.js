import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import products from './src/routes/products.js'
import providers from './src/routes/providers.js'
import entrances from './src/routes/entrances.js'
import reports from './src/routes/reports.js'
import categories from './src/routes/categories.js'

const app = express()
dotenv.config()
const PORT = process.env.PORT ?? 9000

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('API de Productos')
})

app.use('/api/products', products)
app.use('/api/providers', providers)
app.use('/api/entrances', entrances)
app.use('/api/reports', reports)
app.use('/api/categories', categories)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
