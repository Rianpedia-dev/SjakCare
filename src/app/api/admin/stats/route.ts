import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { userService } from "@/lib/services/UserService";
import { consultationService } from "@/lib/services/ConsultationService";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    // Check if session exists and user is admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalUsers = await userService.getTotalUsers();
    const totalConsultations = await consultationService.getTotalConsultations();
    const totalMessages = await consultationService.getTotalMessages();

    // Mock active users for now (or implement in UserService)
    const activeUsers24h = Math.floor(totalUsers * 0.3); 
    const crisisDetections = 0; // Placeholder

    return NextResponse.json({
      totalUsers,
      totalConsultations,
      totalMessages,
      activeUsers24h,
      crisisDetections
    });
  } catch (error) {
    console.error("Admin Stats API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
