import { Pool } from 'pg'
import config from '../lib/config'
import { spawn } from 'child_process'
import path from 'path'

const pool = new Pool(config.database)

async function dropAllTables() {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    // Drop all tables
    console.log('Dropping all tables...')
    
    // First drop the migrations table if it exists
    await client.query(`
      DROP TABLE IF EXISTS migrations CASCADE
    `)
    
    // Get all tables in our schema
    const result = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `)
    
    // Drop each table
    for (const row of result.rows) {
      console.log(`Dropping table: ${row.tablename}`)
      await client.query(`DROP TABLE IF EXISTS "${row.tablename}" CASCADE`)
    }
    
    await client.query('COMMIT')
    console.log('Successfully dropped all tables')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

async function resetDatabase() {
  try {
    await dropAllTables()
    
    // Run migrations
    console.log('\nRunning migrations...')
    const migrate = spawn('npm', ['run', 'migrate'], {
      stdio: 'inherit',
      shell: true
    })
    
    await new Promise<void>((resolve, reject) => {
      migrate.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Migration process exited with code ${code}`))
        }
      })
      
      migrate.on('error', (err) => {
        reject(err)
      })
    })
    
    // Run seeds if they exist
    try {
      console.log('\nRunning seeds...')
      const seed = spawn('npm', ['run', 'db:seed'], {
        stdio: 'inherit',
        shell: true
      })
      
      await new Promise<void>((resolve, reject) => {
        seed.on('close', (code) => {
          if (code === 0) {
            resolve()
          } else {
            reject(new Error(`Seed process exited with code ${code}`))
          }
        })
        
        seed.on('error', (err) => {
          reject(err)
        })
      })
    } catch (error) {
      console.warn('Warning: Seeding failed or not implemented yet')
      console.warn(error)
    }
    
    console.log('\nDatabase reset completed successfully')
  } catch (error) {
    console.error('Error resetting database:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Only run if this file is being executed directly
if (require.main === module) {
  // Confirm before resetting in production
  if (process.env.NODE_ENV === 'production') {
    console.error('Cannot reset database in production!')
    process.exit(1)
  }
  
  console.log('WARNING: This will delete all data in the database!')
  console.log('Press Ctrl+C to cancel or wait 5 seconds to continue...')
  
  setTimeout(() => {
    resetDatabase().catch(console.error)
  }, 5000)
}
