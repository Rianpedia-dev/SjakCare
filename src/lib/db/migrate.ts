import postgres from "postgres";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

const sql_path = path.join(process.cwd(), "drizzle", "migrations", "0000_awesome_otto_octavius.sql");

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing in .env.local");
    process.exit(1);
  }

  console.log("Connecting to database...");
  const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

  try {
    console.log("Cleaning up existing tables (forcing fresh start)...");
    // Drop in correct order due to FKs
    await sql.unsafe(`
      DROP TABLE IF EXISTS "message";
      DROP TABLE IF EXISTS "consultation";
      DROP TABLE IF EXISTS "session";
      DROP TABLE IF EXISTS "account";
      DROP TABLE IF EXISTS "verification";
      DROP TABLE IF EXISTS "user";
    `);

    const query = fs.readFileSync(sql_path, "utf8");
    console.log("Executing SQL migration...");
    
    const statements = query.split("--> statement-breakpoint");
    
    for (const statement of statements) {
      if (statement.trim()) {
        await sql.unsafe(statement);
      }
    }

    console.log("✅ Migration completed successfully (Fresh Start)!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await sql.end();
  }
}

migrate();
