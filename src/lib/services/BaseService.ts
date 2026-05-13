import { db } from "@/lib/db";

/**
 * BaseService - Abstract parent class
 * Menerapkan: ABSTRACTION + ENCAPSULATION
 *
 * - Properti `database` di-encapsulate (protected)
 * - Method `handleError` sebagai abstraksi error handling
 * - Child class hanya perlu implement logika spesifik
 */
export abstract class BaseService {
  // ENCAPSULATION: db connection hanya bisa diakses oleh class dan turunannya
  protected readonly database = db;

  // ABSTRACTION: error handling tersembunyi di balik method sederhana
  protected handleError(error: unknown, context: string): never {
    console.error(`[${this.constructor.name}] Error in ${context}:`, error);
    throw new Error(
      `Terjadi kesalahan pada ${context}. Silakan coba lagi.`
    );
  }

  // ABSTRACTION: logging untuk audit trail
  protected log(action: string, details?: Record<string, unknown>): void {
    console.log(`[${this.constructor.name}] ${action}`, details || "");
  }

  /**
   * POLYMORPHISM: Method ini diimplementasikan secara berbeda oleh tiap child class
   * tergantung pada jenis respons yang ditangani.
   */
  abstract handleResponse(data: unknown): unknown;
}
