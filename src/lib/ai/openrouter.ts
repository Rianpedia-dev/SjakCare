import { SYSTEM_PROMPT } from "./system-prompt";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function sendMessageToAI(
  messages: ChatMessage[]
): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "",
      "X-Title": "MindCare Mental Health Support",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo", // Atau model lain yang tersedia di OpenRouter
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "Maaf, saya tidak dapat merespons saat ini.";
}
