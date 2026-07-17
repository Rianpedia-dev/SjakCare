import { BaseService } from "./BaseService";
import { knowledgeBase } from "@/lib/db/schema";
import { ilike, or } from "drizzle-orm";

export class KnowledgeService extends BaseService {
  /**
   * findRelevantKnowledge
   * Mencari modul ilmiah yang paling relevan dengan pesan pengguna untuk dimasukkan ke konteks RAG.
   */
  async findRelevantKnowledge(userMessage: string): Promise<string | null> {
    try {
      const msg = userMessage.toLowerCase();
      let targetCategory: string | null = null;

      // 1. Klasifikasi kategori heuristik berdasarkan kata kunci
      if (
        msg.includes("belajar") ||
        msg.includes("tugas") ||
        msg.includes("kuliah") ||
        msg.includes("ujian") ||
        msg.includes("akademis") ||
        msg.includes("burnout") ||
        msg.includes("lelah") ||
        msg.includes("frustrasi")
      ) {
        targetCategory = "academic";
      } else if (
        msg.includes("panik") ||
        msg.includes("sesak") ||
        msg.includes("jantung") ||
        msg.includes("panic") ||
        msg.includes("takut") ||
        msg.includes("cemas") ||
        msg.includes("khawatir")
      ) {
        targetCategory = "anxiety";
      } else if (
        msg.includes("negatif") ||
        msg.includes("pikiran") ||
        msg.includes("salah") ||
        msg.includes("cbt") ||
        msg.includes("terapi") ||
        msg.includes("menyesal")
      ) {
        targetCategory = "cbt";
      } else if (
        msg.includes("sepi") ||
        msg.includes("kesepian") ||
        msg.includes("teman") ||
        msg.includes("sosial") ||
        msg.includes("hubungan") ||
        msg.includes("sendiri") ||
        msg.includes("isolasi")
      ) {
        targetCategory = "stress";
      }

      let articles: any[] = [];

      // 2. Ambil artikel dari database berdasarkan kategori
      if (targetCategory) {
        articles = await this.database
          .select()
          .from(knowledgeBase)
          .where(ilike(knowledgeBase.category, targetCategory))
          .limit(1);
      }

      // 3. Fallback: Cari kecocokan kata kunci tekstual di title atau content
      if (articles.length === 0) {
        const keywords = msg
          .split(/\s+/)
          .map(w => w.replace(/[^a-zA-Z]/g, ""))
          .filter(w => w.length > 4); // Ambil kata kunci yang signifikan saja

        if (keywords.length > 0) {
          const conditions = keywords.flatMap(kw => [
            ilike(knowledgeBase.title, `%${kw}%`),
            ilike(knowledgeBase.content, `%${kw}%`)
          ]);

          articles = await this.database
            .select()
            .from(knowledgeBase)
            .where(or(...conditions))
            .limit(1);
        }
      }

      // 4. Susun respon referensi untuk disisipkan ke context AI
      if (articles.length > 0) {
        const art = articles[0];
        this.log("findRelevantKnowledge", { found: art.title, category: art.category });
        return `[REFERENSI ILMIAH SJAKCARE - Kategori: ${art.category.toUpperCase()}]\nJudul: ${art.title}\nPanduan:\n${art.content}`;
      }

      return null;
    } catch (error) {
      this.handleError(error, "mencari basis pengetahuan");
      return null;
    }
  }

  handleResponse(data: any) {
    return data;
  }
}

export const knowledgeService = new KnowledgeService();
