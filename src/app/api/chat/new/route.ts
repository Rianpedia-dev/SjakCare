import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { chatService } from "@/lib/services/ChatService";

export async function POST(request: NextRequest) {
  try {
    // 1. Autentikasi
    const allHeaders = await headers();
    const cookieHeader = allHeaders.get("cookie") || "";
    const session = await auth.api.getSession({ headers: allHeaders });
    
    console.log("DEBUG: Auth Session:", session ? "Found" : "Not Found");
    console.log("DEBUG: Cookie Header Present:", !!cookieHeader);
    if (cookieHeader) {
      console.log("DEBUG: Cookie names:", cookieHeader.split(';').map(c => c.split('=')[0].trim()));
    }

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await request.json();

    // 2. Buat sesi baru via ChatService
    const newSession = await chatService.createSession(session.user.id, title);

    if (!newSession) {
      throw new Error("Gagal membuat sesi chat");
    }

    return NextResponse.json(newSession);
  } catch (error) {
    console.error("New Chat API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat percakapan baru." },
      { status: 500 }
    );
  }
}
