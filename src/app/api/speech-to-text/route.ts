import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { eleven } from "@/lib/elevenlabs";

function getExtensionFromMime(mimeType: string): string {
  if (mimeType.includes("mp4")) return "mp4";
  if (mimeType.includes("m4a")) return "m4a";
  if (mimeType.includes("aac")) return "aac";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("wav")) return "wav";
  if (mimeType.includes("mp3")) return "mp3";
  return "webm";
}

export async function POST(request: NextRequest) {
  try {
    // 1. Autentikasi
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Ambil file audio dari form data
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return Response.json(
        { error: "File audio tidak ditemukan" },
        { status: 400 }
      );
    }

    console.log(
      `🎤 [STT] Menerima audio: ${audioFile.name}, size: ${audioFile.size} bytes`
    );

    // 3. Konversi File dari request menjadi File objek baru yang bersih untuk dikirim ke ElevenLabs
    const mimeType = audioFile.type || "audio/webm";
    const ext = getExtensionFromMime(mimeType);
    const filename = audioFile.name || `recording.${ext}`;

    const fileToSend = new File(
      [await audioFile.arrayBuffer()],
      filename,
      { type: mimeType }
    );

    // 4. Kirim ke ElevenLabs Speech-to-Text via REST API
    const elevenFormData = new FormData();
    elevenFormData.append("file", fileToSend);
    elevenFormData.append("model_id", "scribe_v1");
    elevenFormData.append("language_code", "id");

    const elevenRes = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
      },
      body: elevenFormData,
    });

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      console.error(`❌ [STT] ElevenLabs API error status ${elevenRes.status}:`, errText);
      let detailMsg = "";
      try {
        const errJson = JSON.parse(errText);
        detailMsg = errJson.detail?.message || errText;
      } catch {
        detailMsg = errText;
      }
      throw new Error(`ElevenLabs API error (${elevenRes.status}): ${detailMsg}`);
    }

    const result = await elevenRes.json();

    console.log(`✅ [STT] Transkripsi berhasil: "${result.text}"`);

    return Response.json({ text: result.text });
  } catch (error: any) {
    console.error("❌ [STT] Error:", error);
    return Response.json(
      { error: error.message || "Gagal mengubah suara menjadi teks. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
