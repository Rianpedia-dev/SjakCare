import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { chatService } from "@/lib/services/ChatService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const messages = await chatService.getMessages(resolvedParams.id);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("GET Chat Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    let consultationId = resolvedParams.id;
    if (consultationId === "new") {
      const { title } = await request.json();
      const newSession = await chatService.createSession(session.user.id, title);
      
      if (!newSession) {
        return NextResponse.json({ error: "Gagal membuat sesi" }, { status: 500 });
      }
      return NextResponse.json(newSession);
    }
    
    return NextResponse.json({ error: "Method not mapped" }, { status: 400 });
  } catch (error) {
    console.error("POST Chat Session Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
