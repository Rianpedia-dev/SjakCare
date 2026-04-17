import { BaseService } from "./BaseService";
import { consultation, message } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendMessageToAI } from "@/lib/ai/openrouter";
import { detectCrisis, CRISIS_RESPONSE } from "@/lib/ai/content-filter";

/**
 * ChatService - Chat/AI Service
 * Menerapkan: INHERITANCE (extends BaseService) + POLYMORPHISM
 */
export class ChatService extends BaseService {

  // ENCAPSULATION: method publik, detail internal tersembunyi
  async createSession(userId: string, title?: string) {
    try {
      const [newSession] = await this.database
        .insert(consultation)
        .values({
          id: crypto.randomUUID(),
          userId,
          title: title || "Sesi Konsultasi Baru",
        })
        .returning();

      this.log("createSession", { sessionId: newSession.id, userId });
      return newSession;
    } catch (error) {
      this.handleError(error, "membuat sesi konsultasi");
    }
  }

  // POLYMORPHISM: handleResponse beda implementasi untuk krisis vs normal
  async sendMessage(consultationId: string, userMessage: string) {
    try {
      // Simpan pesan user
      await this.database.insert(message).values({
        id: crypto.randomUUID(),
        consultationId,
        role: "user",
        content: userMessage,
      });

      // Content filtering - deteksi krisis
      if (detectCrisis(userMessage)) {
        return this.handleCrisisResponse(consultationId);
      }

      return this.handleNormalResponse(consultationId);
    } catch (error) {
      this.handleError(error, "mengirim pesan");
    }
  }

  // POLYMORPHISM: handling berbeda untuk respons krisis
  private async handleCrisisResponse(consultationId: string) {
    await this.database.insert(message).values({
      id: crypto.randomUUID(),
      consultationId,
      role: "assistant",
      content: CRISIS_RESPONSE,
    });

    this.log("crisisDetected", { consultationId });
    return { response: CRISIS_RESPONSE, isCrisis: true };
  }

  // POLYMORPHISM: handling berbeda untuk respons normal
  private async handleNormalResponse(consultationId: string) {
    const history = await this.getMessages(consultationId);
    const chatMessages = history.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    const aiResponse = await sendMessageToAI(chatMessages);

    await this.database.insert(message).values({
      id: crypto.randomUUID(),
      consultationId,
      role: "assistant",
      content: aiResponse,
    });

    this.log("normalResponse", { consultationId });
    return { response: aiResponse, isCrisis: false };
  }

  async getMessages(consultationId: string) {
    return this.database.query.message.findMany({
      where: eq(message.consultationId, consultationId),
      orderBy: (msg, { asc }) => [asc(msg.createdAt)],
    });
  }

  async getSessions(userId: string) {
    return this.database.query.consultation.findMany({
      where: eq(consultation.userId, userId),
      orderBy: (c, { desc }) => [desc(c.updatedAt)],
    });
  }
}

// Singleton instance
export const chatService = new ChatService();
