import { BaseService } from "./BaseService";
import { systemSetting } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export class SettingService extends BaseService {
  private isTableInitialized = false;

  private async ensureTable() {
    if (this.isTableInitialized) return;
    try {
      await this.database.execute(sql`
        CREATE TABLE IF NOT EXISTS "system_setting" (
          "key" text PRIMARY KEY,
          "value" text NOT NULL,
          "updatedAt" timestamp DEFAULT now() NOT NULL
        );
      `);
      this.isTableInitialized = true;
    } catch (err) {
      console.warn("[SettingService] ensureTable notice:", err);
    }
  }

  async getSetting(key: string, defaultValue: string = ""): Promise<string> {
    try {
      await this.ensureTable();
      const record = await this.database.query.systemSetting.findFirst({
        where: eq(systemSetting.key, key),
      });
      return record ? record.value : defaultValue;
    } catch (error) {
      console.warn(`[SettingService] Failed to read setting ${key}:`, error);
      return defaultValue;
    }
  }

  async setSetting(key: string, value: string): Promise<void> {
    try {
      await this.ensureTable();
      await this.database
        .insert(systemSetting)
        .values({
          key,
          value,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: systemSetting.key,
          set: {
            value,
            updatedAt: new Date(),
          },
        });
      this.log("setSetting", { key, value });
    } catch (error) {
      this.handleError(error, `menyimpan setting ${key}`);
      throw error;
    }
  }

  async getAIProvider(): Promise<"gemini" | "openrouter"> {
    const setting = await this.getSetting("ai_provider", "");
    if (setting === "gemini" || setting === "openrouter") {
      return setting;
    }
    // Default fallback jika belum diset di DB: gunakan gemini jika GEMINI_API_KEY ada, atau openrouter
    return process.env.GEMINI_API_KEY ? "gemini" : "openrouter";
  }

  async setAIProvider(provider: "gemini" | "openrouter"): Promise<void> {
    await this.setSetting("ai_provider", provider);
  }

  /**
   * POLYMORPHISM: Implementasi untuk SettingService
   */
  handleResponse(data: unknown): unknown {
    return data;
  }
}

export const settingService = new SettingService();
