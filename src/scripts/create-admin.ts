import { auth } from "../lib/auth/auth";
import { db } from "../lib/db";
import { user } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import path from "node:path";
import dotenv from "dotenv";

/**
 * Script untuk membuat akun admin pertama kali.
 * Jalankan dengan: npx tsx --env-file=.env.local src/scripts/create-admin.ts
 */

// Load environment variables dari .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
dotenv.config({ path: envPath });

async function createAdmin() {
  // Konfigurasi akun admin - Silakan ubah jika diperlukan
  const email = "admin@sjakcare.com";
  const password = "password123";
  const name = "Admin SjakCare";

  console.log(`\nMenyiapkan pembuatan akun admin: ${email}...`);

  try {
    // 1. Cek apakah user sudah ada
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });
 
    if (existingUser) {
      console.log("User sudah ada. Memperbarui role ke admin...");
      await db.update(user)
        .set({ role: "admin" })
        .where(eq(user.email, email));
      console.log("✅ Role berhasil diperbarui menjadi admin.\n");
      return;
    }

    // 2. Buat user baru menggunakan API Better Auth agar hashing password benar
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!result) {
      throw new Error("Gagal membuat user melalui Better Auth API.");
    }

    // 3. Ubah role menjadi admin (karena signUpEmail default ke 'user')
    console.log("User berhasil dibuat. Mengatur role ke admin...");
    await db.update(user)
      .set({ role: "admin" })
      .where(eq(user.email, email));

    console.log("\n===================================");
    console.log("🚀 Akun Admin Berhasil Dibuat!");
    console.log(`📧 Email    : ${email}`);
    console.log(`🔑 Password : ${password}`);
    console.log("===================================");
    console.log("Gunakan kredensial di atas untuk login.\n");

  } catch (error) {
    console.error("\n❌ Terjadi kesalahan:", error instanceof Error ? error.message : error);
  } finally {
    process.exit(0);
  }
}

createAdmin();
