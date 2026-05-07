-- SCRIPT SETUP SUPABASE STORAGE
-- Jalankan script ini di SQL Editor Supabase Anda

-- 1. Buat bucket 'profiles' jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Kebijakan (Policies) untuk Storage

-- Hapus kebijakan lama jika ada (opsional, untuk menghindari error saat rerun)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

-- a. Izinkan akses publik untuk melihat foto
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profiles' );

-- b. Izinkan user terautentikasi untuk mengunggah foto
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'profiles' );

-- c. Izinkan user untuk memperbarui foto mereka sendiri
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'profiles' );

-- d. Izinkan user untuk menghapus foto mereka sendiri
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'profiles' );
