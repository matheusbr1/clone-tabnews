import database from "infra/database"

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;")
}

beforeAll(cleanDatabase)

async function fetchStatus() {
  const res = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  })
  const body = await res.json()
  return { status: res.status, body }
}

describe("POST /api/v1/migrations", () => {
  test("should return 200", async () => {
    const firstRes = await fetchStatus()
    expect(firstRes.status).toBe(201)
    expect(Array.isArray(firstRes.body)).toBe(true)
    expect(firstRes.body.length).toBeGreaterThan(0)

    const secondRes = await fetchStatus()
    expect(secondRes.status).toBe(200)
    expect(Array.isArray(secondRes.body)).toBe(true)
    expect(secondRes.body.length).toBe(0)
  })
})
