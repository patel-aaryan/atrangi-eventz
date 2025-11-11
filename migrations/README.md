# Database Migrations Guide

This project uses [db-migrate](https://db-migrate.readthedocs.io/) for managing database migrations with raw SQL files.

## Table of Contents
- [Overview](#overview)
- [Setup](#setup)
- [Quick Start](#quick-start)
- [Creating Migrations](#creating-migrations)
- [Running Migrations](#running-migrations)
- [Environment Setup](#environment-setup)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

**db-migrate** is a database migration framework that allows you to:
- Write migrations in raw SQL files
- Track which migrations have been applied
- Roll back changes when needed
- Maintain database schema version control

### Why db-migrate?
- ✅ Write migrations in pure SQL (full control)
- ✅ Automatic migration tracking
- ✅ Support for up/down migrations (rollbacks)
- ✅ Works with PostgreSQL and other databases
- ✅ Simple, straightforward CLI

---

## Setup

The project is already configured! All dependencies are installed when you run:

```bash
npm install
```

### Configuration Files

**`database.json`** - Database connection settings:
- **Development**: Uses individual PostgreSQL environment variables
- **Production**: Uses `DATABASE_URL` connection string

**Migration Structure**:
```
migrations/
├── 20251111204341-helper-functions.js       # JS loader
├── 20251111204349-events-table.js           # JS loader
└── sqls/
    ├── 20251111204341-helper-functions-up.sql     # ⬆️ Apply changes
    ├── 20251111204341-helper-functions-down.sql   # ⬇️ Rollback changes
    ├── 20251111204349-events-table-up.sql
    └── 20251111204349-events-table-down.sql
```

---

## Quick Start

### 1. Run All Pending Migrations
```bash
npm run migrate
```

### 2. Check Pending Migrations
```bash
npm run migrate:check
```

### 3. Rollback Last Migration
```bash
npm run migrate:down
```

### 4. Create a New Migration
```bash
npm run migrate:create add-users-table -- --sql-file
```

---

## Creating Migrations

### Step 1: Generate Migration Files

```bash
npm run migrate:create your-migration-name -- --sql-file
```

**Example**:
```bash
npm run migrate:create add-users-table -- --sql-file
```

This creates three files:
1. `migrations/TIMESTAMP-your-migration-name.js` - JavaScript loader
2. `migrations/sqls/TIMESTAMP-your-migration-name-up.sql` - Migration SQL
3. `migrations/sqls/TIMESTAMP-your-migration-name-down.sql` - Rollback SQL

### Step 2: Write the UP Migration

Edit the `*-up.sql` file with your SQL changes:

```sql
-- migrations/sqls/20251111123456-add-users-table-up.sql

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Add update trigger
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE users IS 'Application users table';
```

### Step 3: Write the DOWN Migration

Edit the `*-down.sql` file to reverse the changes:

```sql
-- migrations/sqls/20251111123456-add-users-table-down.sql

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TABLE IF EXISTS users CASCADE;
```

### Step 4: Apply the Migration

```bash
npm run migrate
```

---

## Running Migrations

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run migrate` | Run all pending migrations |
| `npm run migrate:check` | Check pending migrations without running them |
| `npm run migrate:down` | Rollback the last migration |
| `npm run migrate:reset` | ⚠️ Rollback ALL migrations (dangerous!) |

### Manual Commands

You can also use `db-migrate` directly:

```bash
# Run migrations
npx db-migrate up

# Rollback last migration
npx db-migrate down

# Rollback specific number of migrations
npx db-migrate down --count 2

# Run specific migration
npx db-migrate up 20251111204341

# Check migration status
npx db-migrate status
```

### Check Pending Migrations

See which migrations are pending (not yet applied):

```bash
npm run migrate:check
```

Output example:
```
✓ Loaded environment from .env.development.local

🔄 Running database migration: check

[INFO] No migrations to run

✅ Migration completed successfully
```

---

## Environment Setup

### How It Works

The migration script (`scripts/migrate.js`) automatically detects your environment:

- **Development**: Loads `.env.development.local` automatically
- **Production/CI**: Uses environment variables directly (from GitHub Secrets, etc.)

### Development Environment

Create a `.env.development.local` file in the project root:

```bash
# Database connection string
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# For Neon Database (this project uses Neon):
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

**That's it!** The migration script will automatically load this file when you run `npm run migrate`.

### Production Environment

Set the `DATABASE_URL` environment variable on your production server or in GitHub Secrets:

```bash
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

The GitHub Actions workflow is already configured to use `secrets.DATABASE_URL`.

---

## Best Practices

### 1. **Always Test Locally First**
Run migrations on your local database before deploying to production.

```bash
npm run migrate        # Test up migration
npm run migrate:down   # Test rollback
npm run migrate        # Run again to verify idempotency
```

### 2. **Write Idempotent Migrations**
Use `IF EXISTS` and `IF NOT EXISTS` to make migrations safe to run multiple times:

```sql
-- Good ✅
CREATE TABLE IF NOT EXISTS users (...);
DROP TABLE IF EXISTS users CASCADE;

-- Bad ❌
CREATE TABLE users (...);
DROP TABLE users;
```

### 3. **One Logical Change Per Migration**
Keep migrations focused on a single feature or change:

```bash
# Good ✅
npm run migrate:create add-users-table -- --sql-file
npm run migrate:create add-users-indexes -- --sql-file

# Bad ❌
npm run migrate:create add-everything -- --sql-file
```

### 4. **Always Write Rollbacks**
Every migration should have a corresponding down migration that reverses the changes.

### 5. **Never Modify Applied Migrations**
Once a migration has been run in production, **never** modify it. Create a new migration instead.

```bash
# Good ✅
npm run migrate:create fix-users-table-typo -- --sql-file

# Bad ❌
# Editing migrations/sqls/20251111204349-events-table-up.sql after it's deployed
```

### 6. **Use Transactions**
Wrap complex migrations in transactions for atomicity:

```sql
BEGIN;

CREATE TABLE users (...);
CREATE INDEX idx_users_email ON users(email);
ALTER TABLE events ADD COLUMN user_id UUID REFERENCES users(id);

COMMIT;
```

### 7. **Add Comments**
Document your migrations:

```sql
-- Migration: Add users table
-- Description: Creates the users table for authentication
-- Author: Your Name
-- Date: 2025-11-11

CREATE TABLE users (...);
```

### 8. **Test Rollbacks**
Always test that your down migration actually works:

```bash
npm run migrate        # Apply
npm run migrate:down   # Rollback
npm run migrate        # Re-apply
```

---

## Migration Examples

### Example 1: Add a New Table

**Up Migration** (`*-add-tickets-table-up.sql`):
```sql
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tickets_event_id ON tickets(event_id);
CREATE INDEX idx_tickets_email ON tickets(email);
```

**Down Migration** (`*-add-tickets-table-down.sql`):
```sql
DROP TABLE IF EXISTS tickets CASCADE;
```

### Example 2: Add a Column

**Up Migration** (`*-add-events-max-tickets-up.sql`):
```sql
ALTER TABLE events 
ADD COLUMN max_tickets_per_order INTEGER DEFAULT 10;

COMMENT ON COLUMN events.max_tickets_per_order IS 'Maximum number of tickets allowed per order';
```

**Down Migration** (`*-add-events-max-tickets-down.sql`):
```sql
ALTER TABLE events 
DROP COLUMN IF EXISTS max_tickets_per_order;
```

### Example 3: Modify Existing Data

**Up Migration** (`*-normalize-event-status-up.sql`):
```sql
-- Update any 'active' status to 'published'
UPDATE events 
SET status = 'published' 
WHERE status = 'active';

-- Add constraint to ensure only valid statuses
ALTER TABLE events 
ADD CONSTRAINT check_event_status 
CHECK (status IN ('draft', 'published', 'cancelled', 'completed'));
```

**Down Migration** (`*-normalize-event-status-down.sql`):
```sql
ALTER TABLE events 
DROP CONSTRAINT IF EXISTS check_event_status;

-- Revert published back to active
UPDATE events 
SET status = 'active' 
WHERE status = 'published';
```

---

## CI/CD Integration

Migrations run automatically on push to `main` via GitHub Actions.

See: `.github/workflows/migrate-production.yml`

### Manual Production Migration

You can manually trigger migrations from GitHub:
1. Go to **Actions** tab
2. Select **Run Production Database Migrations**
3. Click **Run workflow**
4. Type `migrate` to confirm
5. Click **Run workflow**

---

## Troubleshooting

### Error: "relation already exists"

**Problem**: You're trying to create a table/index that already exists.

**Solution**: Use `IF NOT EXISTS`:
```sql
CREATE TABLE IF NOT EXISTS users (...);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

### Error: "relation does not exist"

**Problem**: Migrations ran out of order, or a dependency is missing.

**Solution**: Check that all dependent migrations have been run:
```bash
npx db-migrate status
```

### Error: "permission denied"

**Problem**: Database user doesn't have necessary permissions.

**Solution**: Ensure your database user has CREATE, ALTER, DROP permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE atrangi_eventz TO your_user;
```

### Need to Skip a Migration?

**Not recommended**, but if absolutely necessary:
```bash
npx db-migrate up --force
```

### Reset Everything (⚠️ Destructive!)

```bash
npm run migrate:reset
```

This will rollback ALL migrations. Use with extreme caution!

---

## Common Patterns

### Adding a Foreign Key

```sql
-- Up
ALTER TABLE tickets 
ADD CONSTRAINT fk_tickets_event 
FOREIGN KEY (event_id) 
REFERENCES events(id) 
ON DELETE CASCADE;

-- Down
ALTER TABLE tickets 
DROP CONSTRAINT IF EXISTS fk_tickets_event;
```

### Adding an Enum Type

```sql
-- Up
CREATE TYPE ticket_status AS ENUM ('pending', 'confirmed', 'cancelled', 'refunded');

ALTER TABLE tickets 
ADD COLUMN status ticket_status DEFAULT 'pending';

-- Down
ALTER TABLE tickets 
DROP COLUMN IF EXISTS status;

DROP TYPE IF EXISTS ticket_status;
```

### Adding a JSONB Column with Validation

```sql
-- Up
ALTER TABLE events 
ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;

CREATE OR REPLACE FUNCTION validate_event_metadata()
RETURNS TRIGGER AS $$
BEGIN
    IF jsonb_typeof(NEW.metadata) != 'object' THEN
        RAISE EXCEPTION 'metadata must be a JSON object';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_metadata_trigger
    BEFORE INSERT OR UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION validate_event_metadata();

-- Down
DROP TRIGGER IF EXISTS validate_metadata_trigger ON events;
DROP FUNCTION IF EXISTS validate_event_metadata();
ALTER TABLE events DROP COLUMN IF EXISTS metadata;
```

---

## Additional Resources

- [db-migrate Documentation](https://db-migrate.readthedocs.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Neon Database Docs](https://neon.tech/docs/introduction)

---

## Getting Help

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Run `npx db-migrate status` to check migration state
3. Check your database connection settings in `database.json`
4. Review the migration logs for error messages

---

**Happy Migrating! 🚀**

