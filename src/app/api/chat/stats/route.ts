import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { chatService } from "@/lib/services/ChatService";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await chatService.getChatStats(session.user.id);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET Chat Stats API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat memuat statistik." },
      { status: 500 }
    );
  }
}
