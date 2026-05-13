import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables dari .env.local jika ada (untuk testing lokal)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function pingDb() {
  const startTime = Date.now();
  try {
    console.log("📡 Mengirim ping ke database Supabase...");
    
    // Kueri sederhana untuk memastikan koneksi aktif
    const result = await db.execute(sql`SELECT 1 as ping`);
    
    const duration = Date.now() - startTime;
    console.log(`✅ Ping berhasil! (${duration}ms)`);
    console.log("Hasil:", result[0]);

  } catch (err) {
    console.error("❌ Gagal melakukan ping ke database:", err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

pingDb();
