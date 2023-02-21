const { Pool } = require('pg')

const testConfig = {
  database: process.env.PGDATABASE_TEST,
  host: process.env.PGHOST_TEST,
  port: process.env.PGPORT_TEST,
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
}

const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool()

module.exports = pool
