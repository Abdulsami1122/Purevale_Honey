const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || 'honey',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'samij7141',
})

async function initDb() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Admins table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        "passwordHash" VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Users (customers) table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100),
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        collection VARCHAR(50) NOT NULL,
        image TEXT,
        "priceMin" NUMERIC(10, 2) NOT NULL,
        "priceMax" NUMERIC(10, 2),
        variants JSONB DEFAULT '["Default"]'::jsonb,
        rating NUMERIC(2, 1) DEFAULT 0,
        reviews INTEGER DEFAULT 0,
        available BOOLEAN DEFAULT true,
        featured INTEGER DEFAULT 0,
        "isCustom" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        status VARCHAR(50) DEFAULT 'pending',
        customer_email VARCHAR(255) NOT NULL,
        customer_firstName VARCHAR(255),
        customer_lastName VARCHAR(255),
        customer_phone VARCHAR(50),
        shipping_country VARCHAR(100),
        shipping_address VARCHAR(255),
        shipping_apartment VARCHAR(100),
        shipping_city VARCHAR(100),
        shipping_postalCode VARCHAR(50),
        "paymentMethod" VARCHAR(50),
        "billingSameAsShipping" BOOLEAN,
        subtotal NUMERIC(10, 2) NOT NULL,
        "shippingCost" NUMERIC(10, 2) NOT NULL,
        total NUMERIC(10, 2) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Order Items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
        "productId" VARCHAR(50),
        title VARCHAR(255),
        variant VARCHAR(255),
        price NUMERIC(10, 2),
        quantity INTEGER,
        image TEXT
      )
    `)

    await client.query('COMMIT')
    console.log('[DB] Database schema initialized successfully')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('[DB] Error initializing database schema', err)
    throw err
  } finally {
    client.release()
  }
}

const genId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

module.exports = {
  pool,
  initDb,
  genId,
}
