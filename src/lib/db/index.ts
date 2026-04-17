import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Jika DATABASE_URL belum disetel, gunakan path semu (untuk mode build)
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres";

// Menonaktifkan prepare statements untuk dukungan PGBouncer (Supabase/Neon)
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
