import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Jika DATABASE_URL belum disetel, gunakan path semu (untuk mode build)
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres";

// Menonaktifkan prepare statements untuk dukungan PGBouncer (Supabase/Neon)
// Menambahkan ssl: 'require' untuk koneksi ke database cloud yang mewajibkan SSL
const client = postgres(connectionString, { 
  prepare: false,
  ssl: 'require' 
});

export const db = drizzle(client, { schema });
