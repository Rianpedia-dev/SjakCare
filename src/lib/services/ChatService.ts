import { BaseService } from "./BaseService";
import { consultation, message } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { sendMessageToAI } from "@/lib/ai/openrouter";
import { detectCrisis, CRISIS_RESPONSE } from "@/lib/ai/content-filter";

/**
 * ChatService - Chat/AI Service
 * Menerapkan: INHERITANCE (extends BaseService) + POLYMORPHISM
 */
export class ChatService extends BaseService {

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
      throw error;
    }
  }

  async deleteSession(sessionId: string, userId: string) {
    try {
      const [deletedSession] = await this.database
        .delete(consultation)
        .where(
          and(
            eq(consultation.id, sessionId),
            eq(consultation.userId, userId)
          )
        )
        .returning();

      this.log("deleteSession", { sessionId, userId });
      return deletedSession;
    } catch (error) {
      this.handleError(error, "menghapus sesi konsultasi");
      throw error;
    }
  }

  async deleteAllSessions(userId: string) {
    try {
      const deletedSessions = await this.database
        .delete(consultation)
        .where(eq(consultation.userId, userId))
        .returning();

      this.log("deleteAllSessions", { userId, count: deletedSessions.length });
      return deletedSessions;
    } catch (error) {
      this.handleError(error, "menghapus semua sesi konsultasi");
      throw error;
    }
  }

  async getChatStats(userId: string) {
    try {
      // 1. Hitung total sesi
      const sessions = await this.database
        .select({ id: consultation.id })
        .from(consultation)
        .where(eq(consultation.userId, userId));
      const totalSessions = sessions.length;

      // 2. Hitung total pesan
      let totalMessages = 0;
      if (totalSessions > 0) {
        const sessionIds = sessions.map(s => s.id);
        const messagesCount = await this.database
          .select({ id: message.id })
          .from(message)
          .where(inArray(message.consultationId, sessionIds));
        totalMessages = messagesCount.length;
      }

      return { totalSessions, totalMessages };
    } catch (error) {
      this.handleError(error, "mengambil statistik chat");
      throw error;
    }
  }

  async sendMessage(consultationId: string, userMessage: string) {
    try {
      console.log(`[ChatService] Sending message for consultation: ${consultationId}`);
      
      // 1. Simpan pesan user ke DB
      await this.database.insert(message).values({
        id: crypto.randomUUID(),
        consultationId,
        role: "user",
        content: userMessage,
      });

      // 2. Deteksi Krisis
      if (detectCrisis(userMessage)) {
        return this.handleCrisisResponse(consultationId);
      }

      // 3. Respon Normal
      return await this.handleNormalResponse(consultationId);
    } catch (error) {
      console.error("[ChatService] sendMessage Error:", error);
      throw error;
    }
  }

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

  private async handleNormalResponse(consultationId: string) {
    try {
      // Ambil riwayat chat untuk konteks AI
      const history = await this.getMessages(consultationId);
      const chatMessages = history.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      // Panggil AI
      const aiResponse = await sendMessageToAI(chatMessages);

      // Simpan balasan AI ke DB
      await this.database.insert(message).values({
        id: crypto.randomUUID(),
        consultationId,
        role: "assistant",
        content: aiResponse,
      });

      this.log("normalResponse", { consultationId });
      return { response: aiResponse, isCrisis: false };
    } catch (error) {
      console.error("[ChatService] handleNormalResponse Error:", error);
      // Fallback response jika AI gagal tapi user message sudah tersimpan
      const fallbackMsg = "Maaf, sistem AI kami sedang sibuk. Bisa tolong ulangi pertanyaanmu?";
      return { response: fallbackMsg, isCrisis: false, error: true };
    }
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

  /**
   * POLYMORPHISM: Implementasi spesifik untuk ChatService
   * Menangani respons dari AI atau basis data
   */
  handleResponse(data: any) {
    if (!data) return null;
    
    // Jika data adalah respons AI
    if (typeof data === 'string') {
      return { type: 'ai_response', content: data };
    }

    // Jika data adalah objek hasil DB
    return { type: 'db_result', data };
  }
}

export const chatService = new ChatService();
