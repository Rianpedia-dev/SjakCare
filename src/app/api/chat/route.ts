import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { chatService } from "@/lib/services/ChatService";

export async function POST(request: NextRequest) {
  try {
    // 1. Autentikasi
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { consultationId, userMessage } = await request.json();

    // 2. Validasi input
    if (!userMessage || !consultationId) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // 3. Panggil ChatService (Menerapkan enkapsulasi & polimorfisme)
    const result = await chatService.sendMessage(consultationId, userMessage);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server. Silakan dicoba lagi." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const deleted = await chatService.deleteAllSessions(session.user.id);
    return NextResponse.json({ success: true, count: deleted.length });
  } catch (error) {
    console.error("DELETE All Chat Sessions Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
