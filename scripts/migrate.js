#!/usr/bin/env node

/**
 * Database Migration Runner
 *
 * This script handles running db-migrate with proper environment variable loading
 * for both development and production environments.
 */

const { spawn } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");

// Determine environment
const isProduction = process.env.NODE_ENV === "production";
const isCI = process.env.CI === "true";

// Load appropriate .env file for development
if (!isProduction && !isCI) {
  const envPath = path.join(__dirname, "..", ".env.development.local");

  // Check if .env.development.local exists
  if (fs.existsSync(envPath)) {
    require("dotenv").config({ path: envPath });
    console.log("✓ Loaded environment from .env.development.local");
  } else {
    console.warn("⚠ Warning: .env.development.local not found");
    console.warn("  Make sure DATABASE_URL is set in your environment\n");
  }
} else {
  console.log(`✓ Running in ${isProduction ? "production" : "CI"} mode`);
}

// Verify DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("❌ ERROR: DATABASE_URL environment variable is not set");
  console.error(
    "\nFor development, make sure you have .env.development.local with:"
  );
  console.error("  DATABASE_URL=postgresql://...\n");
  process.exit(1);
}

// Get the command (up, down, reset, etc.)
const command = process.argv[2] || "up";
const args = process.argv.slice(3);

console.log(`\n🔄 Running database migration: ${command}\n`);

// Run db-migrate
// Use 'db-migrate' directly - npm will resolve it from node_modules/.bin
const dbMigrate = spawn("db-migrate", [command, ...args], {
  stdio: "inherit",
  env: process.env,
  shell: true,
  cwd: path.join(__dirname, ".."),
});

dbMigrate.on("close", (code) => {
  if (code === 0) {
    console.log("\n✅ Migration completed successfully\n");
  } else {
    console.error(`\n❌ Migration failed with exit code ${code}\n`);
    process.exit(code);
  }
});

dbMigrate.on("error", (err) => {
  console.error("❌ Failed to start migration process:", err);
  process.exit(1);
});
