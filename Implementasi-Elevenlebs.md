Karena project Anda sudah memiliki **Next.js + OpenRouter**, implementasi ElevenLabs sebenarnya cukup sederhana. Yang perlu Anda buat hanya **2 endpoint**: satu untuk **Speech-to-Text (STT)** dan satu lagi untuk **Text-to-Speech (TTS)**.

---

# 1. Buat akun dan API Key

1. Daftar di ElevenLabs.
2. Masuk ke Dashboard.
3. Buat API Key.
4. Pilih suara (Voice) yang ingin digunakan dan salin **Voice ID**.

Tambahkan ke `.env.local`:

```env
ELEVENLABS_API_KEY=xxxxxxxxxxxxxxxx
ELEVENLABS_VOICE_ID=xxxxxxxxxxxxxxxx
```

---

# 2. Install SDK

Gunakan SDK resmi:

```bash
npm install @elevenlabs/elevenlabs-js
```

Atau gunakan REST API jika tidak ingin memakai SDK. ElevenLabs menyediakan keduanya. ([ElevenLabs][1])

---

# 3. Buat helper ElevenLabs

```
lib/
    elevenlabs.ts
```

Isi helper:

* inisialisasi client
* export client

Contoh konsep:

```ts
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export const eleven = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY!,
});
```

---

# 4. Implementasi Speech-to-Text

## Route

```
app/api/speech-to-text/route.ts
```

Flow:

```
Frontend
      │
      ▼
audio.webm
      │
      ▼
Next.js API
      │
      ▼
ElevenLabs STT
      │
      ▼
text
      │
      ▼
Frontend
```

Endpoint menerima:

```
multipart/form-data
```

berisi

```
audio.webm
```

Kemudian kirim file tersebut ke ElevenLabs menggunakan model **Scribe v2** (atau model STT terbaru yang direkomendasikan). API akan mengembalikan hasil transkripsi dalam bentuk teks. ([ElevenLabs][1])

Response yang dikirim ke frontend cukup:

```json
{
  "text": "Saya sedang merasa cemas akhir-akhir ini."
}
```

---

# 5. Hubungkan dengan OpenRouter

Bagian ini **tidak berubah**.

Flow:

```
Audio
    ↓

Speech To Text

    ↓

Text

    ↓

OpenRouter

    ↓

AI Text
```

Anda cukup mengirim hasil transkripsi sebagai pesan user ke fungsi chat yang sudah ada.

---

# 6. Implementasi Text-to-Speech

Buat route:

```
app/api/text-to-speech/route.ts
```

Request dari frontend:

```json
{
  "text": "Aku memahami bagaimana perasaanmu."
}
```

Server kemudian mengirim teks tersebut ke endpoint Text-to-Speech ElevenLabs menggunakan `VOICE_ID` yang telah dipilih. Hasilnya berupa audio (misalnya MP3), yang dapat langsung dikirim kembali ke frontend sebagai stream atau buffer audio. ([ElevenLabs][2])

---

# 7. Frontend

## Record suara

Gunakan

```
MediaRecorder API
```

Flow:

```
Klik mic

↓

Start Recording

↓

Stop Recording

↓

audio.webm

↓

POST

/api/speech-to-text
```

Setelah API mengembalikan teks:

```
"Saya sedang sedih."
```

langsung panggil fungsi chat Anda:

```text
sendMessage(text)
```

---

# 8. Setelah AI menjawab

Misalnya AI mengembalikan

```
Aku memahami apa yang sedang kamu rasakan.
```

langsung lakukan

```
POST

/api/text-to-speech
```

Body

```json
{
  "text":"Aku memahami apa yang sedang kamu rasakan."
}
```

Server mengembalikan audio, lalu frontend:

```ts
const audio = new Audio(audioUrl);
audio.play();
```

---

# 9. Flow lengkap

```text
🎤 User

↓

MediaRecorder

↓

audio.webm

↓

Speech-to-Text API

↓

Text

↓

OpenRouter

↓

AI Text

↓

Text-to-Speech API

↓

Audio

↓

Play
```

---

# 10. Struktur project

```
app
│
├── api
│   ├── chat
│   ├── speech-to-text
│   └── text-to-speech
│
├── components
│   ├── VoiceRecorder.tsx
│   ├── VoicePlayer.tsx
│   └── ChatRoom.tsx
│
└── lib
    └── elevenlabs.ts
```

## Saran implementasi

Karena Anda sudah memiliki sistem chat yang berjalan, **jangan ubah alur chat yang ada**. Anggap ElevenLabs hanya sebagai dua layanan tambahan:

* **Speech-to-Text**: mengubah audio pengguna menjadi teks sebelum dikirim ke OpenRouter.
* **Text-to-Speech**: mengubah teks balasan AI menjadi audio setelah respons diterima.

Dengan cara ini, logika chatbot, penyimpanan riwayat percakapan, autentikasi, dan integrasi OpenRouter tetap sama. Perubahan hanya terjadi pada input (audio → teks) dan output (teks → audio), sehingga implementasinya lebih sederhana dan mudah dipelihara.

[1]: https://elevenlabs.io/docs/eleven-api/guides/cookbooks/speech-to-text?utm_source=chatgpt.com "Speech to Text quickstart | ElevenLabs Documentation"
[2]: https://elevenlabs.io/docs/eleven-api/resources/libraries/scribe-stt/javascript-scribe?utm_source=chatgpt.com "JavaScript SDK | ElevenLabs Documentation"
