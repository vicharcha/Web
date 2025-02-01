import fs from 'fs'
import path from 'path'
import { Pool } from 'pg'
import config from '../lib/config'

const pool = new Pool(config.database)

async function createMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

async function getExecutedMigrations(): Promise<string[]> {
  const result = await pool.query('SELECT name FROM migrations ORDER BY id ASC')
  return result.rows.map(row => row.name)
}

async function executeMigration(name: string, content: string) {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    console.log(`Executing migration: ${name}`)
    await client.query(content)
    await client.query('INSERT INTO migrations (name) VALUES ($1)', [name])
    
    await client.query('COMMIT')
    console.log(`Successfully executed migration: ${name}`)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

async function migrate() {
  const migrationsDir = path.join(__dirname, '../db/migrations')
  
  try {
    // Create migrations table if it doesn't exist
    await createMigrationsTable()
    
    // Get list of executed migrations
    const executedMigrations = await getExecutedMigrations()
    
    // Read migration files
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort()
    
    // Execute pending migrations
    for (const file of migrationFiles) {
      if (!executedMigrations.includes(file)) {
        const filePath = path.join(migrationsDir, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        await executeMigration(file, content)
      } else {
        console.log(`Migration already executed: ${file}`)
      }
    }
    
    console.log('All migrations completed successfully')
  } catch (error) {
    console.error('Error executing migrations:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run migrations
migrate().catch(console.error)
