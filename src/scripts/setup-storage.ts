import postgres from "postgres";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL tidak ditemukan di .env.local");
  process.exit(1);
}

const sql = postgres(databaseUrl);

async function setupStorage() {
  console.log("🚀 Menyiapkan Supabase Storage (Public Access Version)...");

  try {
    // 1. Buat bucket 'profiles'
    await sql`
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('profiles', 'profiles', true)
      ON CONFLICT (id) DO NOTHING;
    `;
    console.log("✅ Bucket 'profiles' berhasil dibuat/sudah ada.");

    // 2. Set up Policies
    console.log("🛠️ Mengatur kebijakan (policies) storage untuk akses publik...");
    
    // Hapus semua kebijakan lama agar bersih
    await sql`DROP POLICY IF EXISTS "Public Access" ON storage.objects;`;
    await sql`DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;`;
    await sql`DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;`;
    await sql`DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;`;
    await sql`DROP POLICY IF EXISTS "Public Upload" ON storage.objects;`;
    await sql`DROP POLICY IF EXISTS "Public Update" ON storage.objects;`;
    await sql`DROP POLICY IF EXISTS "Public Delete" ON storage.objects;`;

    // Kebijakan Baca: Siapa saja bisa melihat foto profil
    await sql`
      CREATE POLICY "Public Access"
      ON storage.objects FOR SELECT
      TO public
      USING ( bucket_id = 'profiles' );
    `;

    // Kebijakan Tambah: Karena kita tidak pakai Supabase Auth (pakai Better Auth), 
    // kita izinkan 'public' untuk upload ke bucket ini.
    await sql`
      CREATE POLICY "Public Upload"
      ON storage.objects FOR INSERT
      TO public
      WITH CHECK ( bucket_id = 'profiles' );
    `;

    // Kebijakan Update: Izinkan update di bucket profiles
    await sql`
      CREATE POLICY "Public Update"
      ON storage.objects FOR UPDATE
      TO public
      USING ( bucket_id = 'profiles' );
    `;

    // Kebijakan Hapus: Izinkan hapus di bucket profiles
    await sql`
      CREATE POLICY "Public Delete"
      ON storage.objects FOR DELETE
      TO public
      USING ( bucket_id = 'profiles' );
    `;

    console.log("✅ Kebijakan storage publik berhasil diterapkan.");
    console.log("\n🎉 Setup selesai! Sekarang fitur unggah foto profil harusnya sudah bekerja.");
    
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat setup storage:", error);
  } finally {
    await sql.end();
  }
}

setupStorage();
