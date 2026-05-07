import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, password } = await request.json();
    if (!id || !password) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Menggunakan better-auth admin API untuk set password
    await auth.api.admin.setPassword({
      headers: await headers(),
      body: {
        userId: id,
        newPassword: password,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Users Reset Password Error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
