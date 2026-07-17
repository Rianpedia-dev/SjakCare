import { SYSTEM_PROMPT } from "./system-prompt";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function sendMessageToAI(
  messages: ChatMessage[],
  knowledgeContext?: string | null
): Promise<string> {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("❌ OPENROUTER_API_KEY is missing in environment variables");
      throw new Error("API Key missing");
    }

    console.log("🚀 Sending request to OpenRouter AI...");
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "SjakCare Mental Health Support",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash", // Menggunakan model yang lebih stabil dan hemat di OpenRouter
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
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ OpenRouter API Error:", response.status, errorData);
      throw new Error(`OpenRouter API error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      console.error("❌ OpenRouter returned empty content:", data);
      return "Maaf, saya sedang kesulitan memproses pesanmu. Bisa tolong ulangi?";
    }

    console.log("✅ AI Response received successfully");
    return content;
  } catch (error) {
    console.error("❌ sendMessageToAI Exception:", error);
    throw error;
  }
}
