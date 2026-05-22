import { Client } from "pg"

async function query(queryObject) {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  })

  try {
    await client.connect()
    const result = await client.query(queryObject)
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  } finally {
    await client.end()
  }
}

export default {
  query,
}
