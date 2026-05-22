async function fetchStatus() {
  const res = await fetch("http://localhost:3000/api/v1/status")
  const body = await res.json()
  return { status: res.status, body }
}

describe("GET /api/v1/status", () => {
  test("should return 200", async () => {
    const res = await fetchStatus()
    expect(res.status).toBe(200)
  })
  test("should contain a valid updated_at timestamp", async () => {
    const res = await fetchStatus()
    expect(res.body.updated_at).toBeDefined()
    const parsedUpdatedDate = new Date(res.body.updated_at).toISOString()
    expect(res.body.updated_at).toBe(parsedUpdatedDate)
  })
  test("should contain the postgres version", async () => {
    const res = await fetchStatus()
    expect(res.body.database.version).toBeDefined()
    expect(res.body.database.version).toBe("16.0")
  })
  test("should contain the postgres max_connections", async () => {
    const res = await fetchStatus()
    expect(res.body.database.max_connections).toEqual(100)
    expect(typeof res.body.database.max_connections).toBe("number")
    expect(res.body.database.max_connections).toBeDefined()
  })
  test("should contain the postgres connections_in_use", async () => {
    const res = await fetchStatus()
    console.log(res.body.database)
    expect(typeof res.body.database.max_connections).toBe("number")
    expect(res.body.database.connections_in_use).toEqual(1)
    expect(res.body.database.connections_in_use).toBeDefined()
  })
})
