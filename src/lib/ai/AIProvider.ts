import { sendMessageToAI } from "./openrouter";

/**
 * AIProvider - AI Integration Layer
 * Menerapkan: ABSTRACTION
 * 
 * Class ini menyembunyikan detail teknis komunikasi dengan OpenRouter API.
 * Pengembang lain hanya perlu memanggil sendMessage() tanpa perlu tahu
 * model, temperature, atau konfigurasi header API lainnya.
 */
export class AIProvider {
  private readonly model = "google/gemini-2.0-flash-lite-001";

  /**
   * ABSTRACTION: Interface sederhana untuk mengirim pesan ke AI
   */
  async sendMessage(userMessage: string, history: { role: "user" | "assistant", content: string }[] = []) {
    try {
      console.log(`[AIProvider] Abstraction layer sending message with model: ${this.model}`);
      
      const messages = [
        ...history,
        { role: "user" as const, content: userMessage }
      ];

      return await sendMessageToAI(messages);
    } catch (error) {
      console.error("[AIProvider] Abstraction Error:", error);
      throw new Error("Gagal berkomunikasi dengan layanan AI.");
    }
  }
}

export const aiProvider = new AIProvider();
