import useSWR from "swr"

async function fetchApi(key) {
  const res = await fetch(key)
  const data = await res.json()
  return data
}

export default function StatusPage() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  })

  return (
    <>
      <h1>Status</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </>
  )
}
