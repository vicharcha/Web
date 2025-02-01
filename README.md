# Vicharcha Backend

Backend services and database infrastructure for the Vicharcha application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```
Then edit `.env` with your configuration values.

3. Set up the database:

First, create a PostgreSQL database:
```bash
createdb vicharcha_db
```

Then run migrations:
```bash
npm run migrate
```

To seed the database with test data:
```bash
npm run db:seed
```

## Database Management

### Migrations

- Create a new migration:
```bash
npm run migrate:create <migration_name>
```

- Run all pending migrations:
```bash
npm run migrate
```

- Reset database (⚠️ Deletes all data):
```bash
npm run db:reset
```

### Environment Variables

Key environment variables needed:

- `POSTGRES_*`: Database connection settings
- `JWT_SECRET`: Secret key for JWT tokens
- `TWILIO_*`: SMS service credentials
- Additional variables listed in `.env.example`

## Project Structure

```
lib/
  ├── config.ts        # Configuration management
  ├── db.ts           # Database connection and utilities
  ├── services/       # Database service layers
  │   ├── user-service.ts
  │   ├── chat-service.ts
  │   ├── emergency-service.ts
  │   └── notification-service.ts
  └── types/         # TypeScript type definitions
      ├── db.ts
      └── env.d.ts

db/
  └── migrations/    # Database migrations
      └── 001_initial_schema.sql

scripts/
  ├── migrate.ts     # Run database migrations
  ├── create-migration.ts    # Create new migration
  ├── reset-db.ts    # Reset database
  └── seed-db.ts     # Seed test data
```

## Development

### Adding New Features

1. Create a new migration for database changes:
```bash
npm run migrate:create feature_name
```

2. Add schema changes to the new migration file in `db/migrations/`

3. Create or update service files in `lib/services/`

4. Add TypeScript types in `lib/types/`

5. Update API routes to use new services

### Testing

1. Reset database to a clean state:
```bash
npm run db:reset
```

2. Seed with test data:
```bash
npm run db:seed
```

## Production Deployment

1. Set up production database
2. Configure environment variables
3. Run migrations: `npm run migrate`

⚠️ Never run `db:reset` or `db:seed` in production

## Common Issues

### Database Connection Fails

1. Check PostgreSQL is running
2. Verify database exists: `createdb vicharcha_db`
3. Confirm connection settings in `.env`

### Migration Errors

1. Check migration files syntax
2. Ensure migrations are in correct order
3. Try `db:reset` in development (⚠️ deletes data)
