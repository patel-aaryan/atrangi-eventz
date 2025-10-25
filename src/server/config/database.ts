import { Pool } from "@neondatabase/serverless";

// Validate required environment variables
const requiredEnvVars = ["PGHOST", "PGDATABASE", "PGUSER", "PGPASSWORD"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

// Construct the database URL from individual environment variables
const databaseUrl = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}?sslmode=${process.env.PGSSLMODE || "require"}${process.env.PGCHANNELBINDING ? `&channel_binding=${process.env.PGCHANNELBINDING}` : ""}`;

export const pool = new Pool({ connectionString: databaseUrl });
