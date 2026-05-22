import database from "infra/database.js"

async function status(_, res) {
  const updatedAt = new Date().toISOString()
  const version = await database.query("SHOW server_version;")
  const maxConnections = await database.query("SHOW max_connections;")
  const databaseMaxConnections = maxConnections.rows[0].max_connections
  const connectionsInUse = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: ["postgres"],
  })
  const databaseConectionsInUse = connectionsInUse.rows[0].count

  res.status(200).json({
    updated_at: updatedAt,
    database: {
      version: version.rows[0].server_version,
      max_connections: parseInt(databaseMaxConnections),
      connections_in_use: databaseConectionsInUse,
    },
  })
}

export default status
