import migrationRunner from 'node-pg-migrate'
import { join } from 'node:path'
import database from 'infra/database.js'

async function migrations(req, res) {
  const allowedMethods = ["GET", "POST"]
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      error: `Method ${req.method} not allowed`
    })
  }

  let dbClient

  try {
    dbClient = await database.getNewClient()

    const DEFAULT_MIGRATION_OPTIONS = {
      dbClient,
      dryRun: true, // Dry run: Método GET apenas simula a execução das migrações, sem aplicá-las de fato.
      dir: join('infra', 'migrations'),
      direction: 'up',
      verbose: true,
      migrationsTable: 'pgmigrations',
    }
    
    if (req.method === 'GET') {
      const pendingMigrations = await migrationRunner(DEFAULT_MIGRATION_OPTIONS)
      return res.status(200).json(pendingMigrations)
    }

    if (req.method === 'POST') {
      const migratedMigrations = await migrationRunner({
        ...DEFAULT_MIGRATION_OPTIONS,
        dryRun: false,
      })
      if (migratedMigrations.length > 0) {
        return res.status(201).json(migratedMigrations)
      }
      return res.status(200).json(migratedMigrations)
    }
  } catch (error) {
    console.error(error)
    throw error
  } finally {
    await dbClient.end()
  }
}

export default migrations