import Postgrator from "postgrator";
import { Pool } from "@neondatabase/serverless";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.development.local if running locally
// In production (GitHub Actions), DATABASE_URL will be set via environment
if (process.env.CI) {
  console.log("📝 Using environment variables from CI/CD");
} else {
  dotenv.config({ path: path.join(__dirname, "../.env.development.local") });
  console.log("📝 Loaded environment from .env.development.local");
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not set");

const pool = new Pool({ connectionString: databaseUrl });

try {
  console.log("🚀 Starting database migration...\n");

  const postgrator = new Postgrator({
    migrationPattern: path.join(__dirname, "../migrations/*"),
    driver: "pg",
    database: databaseUrl,
    schemaTable: "schemaversion",
    currentSchema: "public",
    execQuery: (query) => pool.query(query),
  });

  // Get current version
  const currentVersion = await postgrator.getDatabaseVersion();
  console.log(
    `📊 Current database version: ${currentVersion || "0 (no migrations applied)"}`
  );

  // Get all available migrations
  const migrations = await postgrator.getMigrations();
  const maxVersion =
    migrations.length > 0 ? Math.max(...migrations.map((m) => m.version)) : 0;

  if (currentVersion >= maxVersion) {
    console.log("✅ Database is already up to date!");
    await pool.end();
    process.exit(0);
  }

  console.log(`📦 Found ${migrations.length} migration(s)`);
  console.log(`⬆️  Migrating to version: ${maxVersion}\n`);

  // Run migrations
  const appliedMigrations = await postgrator.migrate();

  if (appliedMigrations.length === 0) {
    console.log("✅ No new migrations to apply");
  } else {
    console.log("\n✅ Successfully applied migrations:");
    for (const migration of appliedMigrations) {
      console.log(`   - ${migration.version}: ${migration.name}`);
    }
    console.log(`\n🎉 Database migrated to version ${maxVersion}`);
  }

  await pool.end();
} catch (error) {
  console.error("\n❌ Migration failed:", error.message);
  if (error.appliedMigrations) {
    console.log("\n⚠️  Partially applied migrations:");
    for (const migration of error.appliedMigrations) {
      console.log(`   - ${migration.version}: ${migration.name}`);
    }
  }
  await pool.end();
  process.exit(1);
}
