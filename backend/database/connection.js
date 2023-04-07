const dotenv = require('dotenv') // .env file
dotenv.config()
console.log(process.env);

const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'aqua-tech-interview-db-arman.cjdznkfiy2n7.us-east-1.rds.amazonaws.com',
  password: process.env.DB_PASS,
  database: 'techInterview',
  port: 5432,
})

module.exports = pool