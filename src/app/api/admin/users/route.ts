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

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password, role } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Menggunakan better-auth admin API untuk membuat user
    await auth.api.admin.createUser({
      headers: await headers(),
      body: {
        email,
        password,
        name,
        role: role || "user",
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Users POST Error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
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

    // Menggunakan better-auth admin API untuk set role
    await auth.api.admin.setRole({
      headers: await headers(),
      body: {
        userId: id,
        role: role,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Users PATCH Error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // Menggunakan better-auth admin API untuk menghapus user
    await auth.api.admin.removeUser({
      headers: await headers(),
      body: {
        userId: id,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Users DELETE Error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
