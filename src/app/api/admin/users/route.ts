import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { userService } from "@/lib/services/UserService";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    
    const users = await userService.getAllUsers(search);
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin Users GET Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, role } = await request.json();
    if (!id || !role) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    await userService.updateUserRole(id, role);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Users PATCH Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
