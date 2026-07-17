import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { eleven, ELEVENLABS_VOICE_ID } from "@/lib/elevenlabs";

export async function POST(request: NextRequest) {
  try {
    // 0. Validasi environment variables
    if (!process.env.ELEVENLABS_API_KEY || !process.env.ELEVENLABS_VOICE_ID) {
      console.error("❌ [TTS] ELEVENLABS_API_KEY atau ELEVENLABS_VOICE_ID belum diset");
      return Response.json(
        { error: "Konfigurasi TTS belum lengkap" },
        { status: 500 }
      );
    }

    // 1. Autentikasi
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return Response.json(
        { error: "Teks tidak ditemukan" },
        { status: 400 }
      );
    }

    // 2. Batasi panjang teks (ElevenLabs punya limit)
    const trimmedText = text.substring(0, 5000);

    console.log(
      `🔊 [TTS] Mengubah teks menjadi suara (${trimmedText.length} chars)`
    );
    console.log(`🔊 [TTS] Voice ID: ${ELEVENLABS_VOICE_ID}`);

    // 3. Kirim ke ElevenLabs Text-to-Speech via REST API
    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        },
        body: JSON.stringify({
          text: trimmedText,
          model_id: "eleven_multilingual_v2",
        }),
      }
    );

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      console.error(`❌ [TTS] ElevenLabs API error status ${elevenRes.status}:`, errText);
      let detailMsg = "";
      try {
        const errJson = JSON.parse(errText);
        detailMsg = errJson.detail?.message || errText;
      } catch {
        detailMsg = errText;
      }
      throw new Error(`ElevenLabs API error (${elevenRes.status}): ${detailMsg}`);
    }

    const audioArrayBuffer = await elevenRes.arrayBuffer();
    const audioBuffer = Buffer.from(audioArrayBuffer);

    console.log(`✅ [TTS] Audio dihasilkan: ${audioBuffer.length} bytes`);

    // 5. Kirim audio sebagai response
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("❌ [TTS] Error:", error);
    
    // Berikan pesan error yang lebih spesifik
    const message = error?.message || "Gagal mengubah teks menjadi suara. Silakan coba lagi.";
    
    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}

