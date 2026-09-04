import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { settingService } from "@/lib/services/SettingService";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentProvider = await settingService.getAIProvider();
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
    const hasOpenRouterKey = Boolean(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.trim().length > 0);
    const openrouterModel = process.env.OPENROUTER_MODEL || "openrouter/free";

    return Response.json({
      provider: currentProvider,
      geminiConfigured: hasGeminiKey,
      openrouterConfigured: hasOpenRouterKey,
      openrouterModel,
    });
  } catch (error: any) {
    console.error("❌ [API] Error fetching AI provider setting:", error);
    return Response.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized. Admin role required." }, { status: 401 });
    }

    const body = await request.json();
    const { provider } = body;

    if (provider !== "gemini" && provider !== "openrouter") {
      return Response.json(
        { error: "Invalid provider. Must be 'gemini' or 'openrouter'." },
        { status: 400 }
      );
    }

    await settingService.setAIProvider(provider);

    return Response.json({
      success: true,
      provider,
      message: `Penyedia AI berhasil dialihkan ke ${provider === "gemini" ? "Google Gemini API" : "OpenRouter AI"}.`,
    });
  } catch (error: any) {
    console.error("❌ [API] Error saving AI provider setting:", error);
    return Response.json({ error: error?.message || "Gagal memperbarui konfigurasi AI." }, { status: 500 });
  }
}
