import { SYSTEM_PROMPT } from "./system-prompt";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function sendMessageToAI(
  messages: ChatMessage[],
  knowledgeContext?: string | null
): Promise<string> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openrouterApiKey = process.env.OPENROUTER_API_KEY;

  // Coba gunakan Google Gemini API secara langsung jika kunci API tersedia (Sangat stabil & gratis 15 RPM)
  if (geminiApiKey) {
    try {
      console.log("🚀 Sending request directly to Google Gemini API...");
      
      let systemText = SYSTEM_PROMPT;
      if (knowledgeContext) {
        systemText += `\n\nGunakan informasi referensi ilmiah berikut sebagai panduan utama untuk merumuskan jawaban Anda jika relevan dengan keluhan pengguna:\n${knowledgeContext}`;
      }

      // Format pesan untuk Gemini API (menggunakan role 'user' dan 'model')
      const geminiMessages = messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      // Bersihkan dari role selain 'user' dan 'model'
      const cleanMessages = geminiMessages.filter(m => m.role === "user" || m.role === "model");

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey,
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

      if (response.ok) {
        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) {
          console.log("✅ AI Response received successfully directly from Google Gemini API");
          return content;
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Google Gemini API Error:", response.status, errorData);
      }
    } catch (error) {
      console.error("❌ Google Gemini API Exception:", error);
    }
    console.warn("⚠️ Direct Google Gemini API failed or not fully configured. Trying OpenRouter as fallback...");
  }

  // Fallback ke OpenRouter
  if (!openrouterApiKey) {
    console.error("❌ Both GEMINI_API_KEY and OPENROUTER_API_KEY are missing");
    throw new Error("No API keys configured");
  }

  let model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";
  let attempt = 0;

  while (attempt < 2) {
    try {
      console.log(`🚀 Sending request to OpenRouter AI (Model: ${model}, Attempt: ${attempt + 1})...`);
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openrouterApiKey}`,
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
          max_tokens: 400, // Menurunkan sedikit dari 500 ke 400 untuk efisiensi token
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`❌ OpenRouter API Error (Status: ${response.status}):`, errorData);

        // Jika error 402 (Payment/Credits Required) dan model bukan model gratis, coba fallback ke model gratis
        if (response.status === 402 && attempt === 0 && !model.endsWith(":free") && model !== "openrouter/free") {
          console.warn("⚠️ OpenRouter out of credits. Retrying with a free model (openrouter/free)...");
          model = "openrouter/free";
          attempt++;
          continue;
        }

        throw new Error(`OpenRouter API error: ${response.status} ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        console.error("❌ OpenRouter returned empty content:", data);
        return "Maaf, saya sedang kesulitan memproses pesanmu. Bisa tolong ulangi?";
      }

      console.log(`✅ AI Response received successfully using model: ${model}`);
      return content;
    } catch (error) {
      console.error(`❌ sendMessageToAI OpenRouter Exception (Attempt ${attempt + 1}):`, error);

      // Jika terjadi exception koneksi/lainnya dan belum fallback, coba sekali lagi dengan model gratis
      if (attempt === 0 && !model.endsWith(":free") && model !== "openrouter/free") {
        console.warn("⚠️ Exception occurred. Retrying with a free model (openrouter/free)...");
        model = "openrouter/free";
        attempt++;
        continue;
      }

      throw error;
    }
  }

  throw new Error("Failed to send message to AI after retry.");
}
