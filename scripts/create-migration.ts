import fs from 'fs'
import path from 'path'
import { format } from 'date-fns'

function createMigrationFile() {
  // Get migration name from command line arguments
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Please provide a migration name')
    console.error('Example: npm run migrate:create add_users_table')
    process.exit(1)
  }

  const migrationName = args[0].toLowerCase().replace(/\s+/g, '_')
  const timestamp = format(new Date(), 'yyyyMMddHHmmss')
  const fileName = `${timestamp}_${migrationName}.sql`
  const migrationsDir = path.join(__dirname, '../db/migrations')

  // Create migrations directory if it doesn't exist
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true })
  }

  const filePath = path.join(migrationsDir, fileName)

  // Create migration file with template
  const template = `-- Migration: ${migrationName}
-- Created at: ${new Date().toISOString()}
-- Description: [Add description here]

-- Up Migration
BEGIN;

-- Add your migration SQL here
-- Example:
-- CREATE TABLE example (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

COMMIT;

-- Down Migration (in case you need to rollback)
-- BEGIN;
--   DROP TABLE IF EXISTS example;
-- COMMIT;
`

  try {
    fs.writeFileSync(filePath, template)
    console.log(`Created migration file: ${fileName}`)
    console.log(`Location: ${filePath}`)
    console.log('\nNext steps:')
    console.log('1. Open the migration file and add your SQL commands')
    console.log('2. Add a description')
    console.log('3. Run the migration with: npm run migrate')
  } catch (error) {
    console.error('Error creating migration file:', error)
    process.exit(1)
  }
}

// Only run if this file is being executed directly
if (require.main === module) {
  createMigrationFile()
}
