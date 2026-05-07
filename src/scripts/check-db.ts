import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables dari .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function checkDb() {
  try {
    console.log("📡 Checking database connection...");
    const result = await db.execute(sql`SELECT current_database(), current_user;`);
    console.log("✅ Connection success:", result[0]);

    console.log("📋 Checking tables...");
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    console.log("Tables found:", tables.map(t => t.table_name));

    console.log("🔍 Checking 'user' table columns...");
    const columns = await db.execute(sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'user' AND table_schema = 'public';
    `);
    console.table(columns);

  } catch (err) {
    console.error("❌ Database Error:", err);
  } finally {
    process.exit(0);
  }
}

checkDb();
