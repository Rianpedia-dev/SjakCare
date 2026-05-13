import { BaseService } from "./BaseService";
import { consultation, message } from "@/lib/db/schema";
import { count } from "drizzle-orm";

/**
 * ConsultationService - Consultation Statistics
 * Menerapkan: INHERITANCE (extends BaseService)
 */
export class ConsultationService extends BaseService {

  async getTotalConsultations() {
    try {
      const [result] = await this.database
        .select({ count: count() })
        .from(consultation);
      return result.count;
    } catch (error) {
      this.handleError(error, "menghitung total konsultasi");
    }
  }

  async getTotalMessages() {
    try {
      const [result] = await this.database
        .select({ count: count() })
        .from(message);
      return result.count;
    } catch (error) {
      this.handleError(error, "menghitung total pesan");
    }
  }

  /**
   * POLYMORPHISM: Implementasi spesifik untuk ConsultationService
   */
  handleResponse(data: any) {
    return { status: "success", result: data };
  }
}

export const consultationService = new ConsultationService();
