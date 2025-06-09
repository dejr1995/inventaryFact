// db.js
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'api_prueba2'
})

export default pool
