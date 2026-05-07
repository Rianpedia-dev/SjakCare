import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testAI() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  console.log("🔑 API Key check:", apiKey ? "Exists (Starts with " + apiKey.substring(0, 7) + "...)" : "MISSING");

  if (!apiKey) return;

  try {
    console.log("📡 Testing OpenRouter API with google/gemini-2.0-flash-lite-001...");
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "SjakCare Test",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-lite-001",
        messages: [{ role: "user", content: "Hello, test." }],
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ API Success!");
      console.log("🤖 Response:", data.choices[0]?.message?.content);
    } else {
      console.error("❌ API Failed:", response.status, data);
    }
  } catch (err) {
    console.error("❌ Fetch Exception:", err);
  }
}

testAI();
