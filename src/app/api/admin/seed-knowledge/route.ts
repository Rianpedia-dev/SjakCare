import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { knowledgeBase } from "@/lib/db/schema";

const initialKnowledge = [
  {
    id: "kb-cbt-negatif",
    title: "Mengatasi Pikiran Negatif dengan Teknik CBT (Cognitive Behavioral Therapy)",
    category: "cbt",
    content: `Teknik CBT (Cognitive Behavioral Therapy) berfokus pada hubungan antara pikiran, perasaan, dan perilaku. 
Pikiran negatif otomatis (Automatic Negative Thoughts/ANTs) sering kali berupa distorsi kognitif seperti:
1. Berpikir Hitam-Putih (Melihat segala hal sebagai keberhasilan mutlak atau kegagalan total).
2. Katastrofis (Mengasumsikan skenario terburuk pasti akan terjadi).
3. Personalisasi (Menyalahkan diri sendiri atas peristiwa di luar kendali).

Untuk merestrukturisasi pikiran negatif, gunakan langkah-langkah berikut:
1. Identifikasi Pikiran: Tuliskan pikiran negatif yang muncul (misalnya: "Saya pasti gagal ujian ini dan masa depan saya hancur").
2. Cari Bukti: Tanyakan pada diri sendiri, "Apakah ada bukti kuat bahwa pikiran ini 100% benar? Apakah saya pernah lulus ujian sebelumnya?".
3. Buat Pikiran Alternatif yang Rasional: Ubah pikiran tersebut menjadi lebih realistis (misalnya: "Ujian ini memang menantang, tetapi saya sudah belajar. Bahkan jika hasilnya kurang memuaskan, saya masih bisa memperbaikinya dan ini tidak menentukan seluruh masa depan saya").
Latihan ini secara bertahap akan mengurangi kecemasan dan meningkatkan kontrol emosi.`
  },
  {
    id: "kb-stress-akademis",
    title: "Panduan Manajemen Stres Akademis dan Mengatasi Burnout",
    category: "academic",
    content: `Stres akademis dipicu oleh beban tugas, tekanan nilai, dan prokrastinasi. Jika dibiarkan, stres akan berkembang menjadi burnout (kelelahan mental, emosional, dan fisik ekstrem).

Strategi manajemen stres akademis yang terbukti ilmiah:
1. Eisenhower Matrix: Bagi tugas kuliah menjadi 4 kuadran:
   - Penting & Mendesak (Lakukan sekarang).
   - Penting tapi Tidak Mendesak (Jadwalkan).
   - Tidak Penting tapi Mendesak (Delegasikan/Batasi waktu).
   - Tidak Penting & Tidak Mendesak (Eliminasi).
2. Teknik Pomodoro: Belajar dengan fokus selama 25 menit, lalu istirahat selama 5 menit. Setelah 4 sesi, ambil istirahat lebih panjang (15-30 menit). Ini menjaga konsentrasi otak tetap segar.
3. Batasi Prokrastinasi: Mulai dari tugas terkecil yang bisa diselesaikan dalam 5 menit. Memulai adalah bagian tersulit; setelah berjalan, momentum akan terbentuk.
4. Jaga Keseimbangan: Pastikan tidur cukup 7-8 jam per hari, konsumsi air putih, dan lakukan olahraga ringan karena aktivitas fisik dapat melepaskan hormon endorfin pereda stres.`
  },
  {
    id: "kb-panic-attack",
    title: "Panduan Pertolongan Pertama Saat Mengalami Serangan Panik (Panic Attack)",
    category: "anxiety",
    content: `Serangan panik adalah gelombang ketakutan intens yang tiba-tiba, sering kali disertai detak jantung cepat, sesak napas, dan pusing. Ingatlah bahwa serangan panik adalah reaksi kecemasan ekstrem dan akan mereda dalam 10-20 menit.

Langkah pertolongan pertama saat panik menyerang:
1. Sadari dan Terima: Katakan pada diri sendiri, "Saya sedang mengalami serangan panik. Ini sangat tidak nyaman, tetapi ini aman dan pasti akan berlalu." Jangan melawan perasaan tersebut.
2. Box Breathing (Pernapasan Kotak):
   - Tarik napas melalui hidung secara perlahan selama 4 detik.
   - Tahan napas selama 4 detik.
   - Hembuskan napas melalui mulut secara perlahan selama 4 detik.
   - Tahan napas selama 4 detik. Ulangi siklus ini 5-10 kali untuk menenangkan sistem saraf otonom.
3. Teknik Grounding 5-4-3-2-1: Alihkan fokus otak Anda ke lingkungan sekitar dengan mengidentifikasi:
   - 5 benda yang bisa Anda LIHAT.
   - 4 benda yang bisa Anda SENTUH (misalnya: baju Anda, meja dingin).
   - 3 suara yang bisa Anda DENGAR (misalnya: detak jam, angin).
   - 2 bau yang bisa Anda HIRUP.
   - 1 rasa yang bisa Anda RASAKAN di mulut.
Teknik ini membantu menarik kesadaran Anda kembali ke masa kini (here and now) dari pikiran kecemasan yang berputar.`
  },
  {
    id: "kb-interpersonal-lonely",
    title: "Mengatasi Kesepian dan Membangun Hubungan Sosial yang Sehat",
    category: "stress",
    content: `Kesepian bukanlah tentang tidak adanya orang di sekitar kita, melainkan kurangnya koneksi emosional yang bermakna. Hubungan sosial yang sehat sangat penting bagi kesehatan mental.

Panduan membangun hubungan dan mengatasi kesepian:
1. Kurangi Penarikan Diri: Ketika merasa kesepian, insting kita sering kali adalah mengisolasi diri karena takut ditolak. Lawan insting ini dengan tetap terhubung melalui pesan singkat atau sapaan sederhana kepada teman atau keluarga.
2. Dengarkan secara Aktif: Saat mengobrol, fokuslah sepenuhnya pada apa yang dikatakan lawan bicara daripada memikirkan apa yang akan Anda katakan selanjutnya. Ajukan pertanyaan terbuka untuk menunjukkan ketertarikan yang tulus.
3. Batasi Media Sosial: Media sosial sering kali memicu fenomena perbandingan sosial (FOMO) yang memperburuk kesepian. Gantilah waktu layar dengan interaksi tatap muka langsung atau telepon suara.
4. Bergabunglah dengan Komunitas: Ikuti kegiatan relawan, klub hobi, atau organisasi mahasiswa. Kebersamaan dalam minat yang sama mempermudah terjalinnya pertemanan baru yang alami.`
  }
];

export async function GET(request: NextRequest) {
  try {
    console.log("🚀 Memulai seeding RAG dari route API...");

    // 1. Buat tabel knowledge_base via Raw SQL
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "knowledge_base" (
        "id" text PRIMARY KEY,
        "title" text NOT NULL,
        "content" text NOT NULL,
        "category" text NOT NULL,
        "createdAt" timestamp DEFAULT now() NOT NULL,
        "updatedAt" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("✅ Tabel knowledge_base siap.");

    // 2. Hapus data lama
    await db.delete(knowledgeBase);
    console.log("🧹 Data lama dibersihkan.");

    // 3. Masukkan data
    for (const item of initialKnowledge) {
      await db.insert(knowledgeBase).values({
        id: item.id,
        title: item.title,
        content: item.content,
        category: item.category,
      });
    }
    console.log("📥 Data baru diinsert.");

    return NextResponse.json({
      success: true,
      message: "Seeding basis pengetahuan kesehatan mental sukses!",
      count: initialKnowledge.length
    });
  } catch (error: any) {
    console.error("❌ Gagal seeding RAG via API:", error);
    return NextResponse.json({
      success: false,
      error: error.message || error
    }, { status: 500 });
  }
}
