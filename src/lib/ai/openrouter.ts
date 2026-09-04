import { SYSTEM_PROMPT } from "./system-prompt";
import { settingService } from "@/lib/services/SettingService";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Panggilan langsung ke Google Gemini API (AI Studio)
 */
async function callGeminiDirect(
  messages: ChatMessage[],
  knowledgeContext?: string | null,
  apiKey?: string
): Promise<string> {
  const geminiApiKey = apiKey || process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY belum disetel di .env.local");
  }

  console.log("🚀 [Gemini] Mengirim permintaan langsung ke Google Gemini API...");

  let systemText = SYSTEM_PROMPT;
  if (knowledgeContext) {
    systemText += `\n\nGunakan informasi referensi ilmiah berikut sebagai panduan utama untuk merumuskan jawaban Anda jika relevan dengan keluhan pengguna:\n${knowledgeContext}`;
  }

  // Format pesan untuk Gemini API (menggunakan role 'user' dan 'model')
  const geminiMessages = messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const cleanMessages = geminiMessages.filter(
    (m) => m.role === "user" || m.role === "model"
  );

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: cleanMessages,
        systemInstruction: {
          parts: [{ text: systemText }],
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 400,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("❌ Google Gemini API Error:", response.status, errorData);
    throw new Error(`Gemini API error: ${response.status} ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error("Gemini returned empty response candidate");
  }

  console.log("✅ [Gemini] AI Response diterima langsung dari Google Gemini API");
  return content;
}

/**
 * Panggilan ke OpenRouter AI
 */
async function callOpenRouter(
  messages: ChatMessage[],
  knowledgeContext?: string | null,
  apiKey?: string
): Promise<string> {
  const openrouterApiKey = apiKey || process.env.OPENROUTER_API_KEY;
  if (!openrouterApiKey) {
    throw new Error("OPENROUTER_API_KEY belum disetel di .env.local");
  }

  let model = process.env.OPENROUTER_MODEL || "openrouter/free";
  let attempt = 0;

  while (attempt < 2) {
    try {
      console.log(`🚀 [OpenRouter] Mengirim permintaan (Model: ${model}, Attempt: ${attempt + 1})...`);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openrouterApiKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "SjakCare Mental Health Support",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...(knowledgeContext
              ? [
                  {
                    role: "system",
                    content: `Gunakan informasi referensi ilmiah berikut sebagai panduan utama untuk merumuskan jawaban Anda jika relevan dengan keluhan pengguna:\n${knowledgeContext}`,
                  } as ChatMessage,
                ]
              : []),
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 400,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`❌ OpenRouter API Error (Status: ${response.status}):`, errorData);

        // Jika error 402 (Payment Required) & belum pakai model gratis, coba openrouter/free
        if (
          response.status === 402 &&
          attempt === 0 &&
          !model.endsWith(":free") &&
          model !== "openrouter/free"
        ) {
          console.warn("⚠️ OpenRouter out of credits. Mencoba fallback ke model gratis (openrouter/free)...");
          model = "openrouter/free";
          attempt++;
          continue;
        }

        throw new Error(`OpenRouter API error: ${response.status} ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error("OpenRouter mengembalikan balasan kosong");
      }

      console.log(`✅ [OpenRouter] AI Response diterima via model: ${model}`);
      return content;
    } catch (error) {
      console.error(`❌ callOpenRouter Exception (Attempt ${attempt + 1}):`, error);

      if (
        attempt === 0 &&
        !model.endsWith(":free") &&
        model !== "openrouter/free"
      ) {
        console.warn("⚠️ Mencoba ulang dengan model gratis (openrouter/free)...");
        model = "openrouter/free";
        attempt++;
        continue;
      }

      throw error;
    }
  }

  throw new Error("Gagal mendapatkan respons dari OpenRouter setelah percobaan berulang.");
}

/**
 * Fungsi utama untuk mengirim pesan ke AI yang menghargai konfigurasi Switch Admin (Gemini vs OpenRouter)
 */
export async function sendMessageToAI(
  messages: ChatMessage[],
  knowledgeContext?: string | null
): Promise<string> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openrouterApiKey = process.env.OPENROUTER_API_KEY;

  if (!geminiApiKey && !openrouterApiKey) {
    throw new Error("Konfigurasi API AI tidak ditemukan di .env.local (GEMINI_API_KEY atau OPENROUTER_API_KEY diperlukan).");
  }

  // Ambil provider aktif yang diset oleh Admin di Dashboard/Profil
  let activeProvider: "gemini" | "openrouter" = "gemini";
  try {
    activeProvider = await settingService.getAIProvider();
  } catch (err) {
    console.warn("Gagal membaca AI provider dari DB, fallback default:", err);
    activeProvider = geminiApiKey ? "gemini" : "openrouter";
  }

  console.log(`🎯 [AI Provider] Mode aktif: ${activeProvider.toUpperCase()}`);

  if (activeProvider === "gemini") {
    // Mode Utama: GOOGLE GEMINI API
    try {
      if (geminiApiKey) {
        return await callGeminiDirect(messages, knowledgeContext, geminiApiKey);
      } else {
        console.warn("⚠️ GEMINI_API_KEY kosong, mengalihkan otomatis ke OpenRouter...");
      }
    } catch (err) {
      console.error("❌ Google Gemini API gagal, mencoba fallback ke OpenRouter:", err);
    }

    // Fallback ke OpenRouter jika Gemini gagal
    if (openrouterApiKey) {
      return await callOpenRouter(messages, knowledgeContext, openrouterApiKey);
    }
  } else {
    // Mode Utama: OPENROUTER AI
    try {
      if (openrouterApiKey) {
        return await callOpenRouter(messages, knowledgeContext, openrouterApiKey);
      } else {
        console.warn("⚠️ OPENROUTER_API_KEY kosong, mengalihkan otomatis ke Google Gemini...");
      }
    } catch (err) {
      console.error("❌ OpenRouter gagal, mencoba fallback ke Google Gemini:", err);
    }

    // Fallback ke Gemini jika OpenRouter gagal
    if (geminiApiKey) {
      return await callGeminiDirect(messages, knowledgeContext, geminiApiKey);
    }
  }

  throw new Error("Semua penyedia AI (Gemini & OpenRouter) tidak dapat dihubungi. Silakan periksa kunci API Anda.");
}
