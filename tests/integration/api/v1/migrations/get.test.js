import database from "infra/database"
import orquestrator from "tests/orquestrator"

beforeAll(async () => {
  await orquestrator.waitForAllServices() // Aguarda os serviços evitando race-condition
  await database.query("drop schema public cascade; create schema public;") // Limpa o banco de dados
})

async function fetchStatus() {
  const res = await fetch("http://localhost:3000/api/v1/migrations")
  const body = await res.json()
  return { status: res.status, body }
}

describe("GET /api/v1/migrations", () => {
  test("should return 200", async () => {
    const res = await fetchStatus()
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })
})
