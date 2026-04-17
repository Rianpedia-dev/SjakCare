import { StatsCard } from "@/components/admin/StatsCard";
import { Users, MessageSquare, Activity, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { userService } from "@/lib/services/UserService";
import { consultationService } from "@/lib/services/ConsultationService";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const totalUsers = await userService.getTotalUsers();
  const totalConsultations = await consultationService.getTotalConsultations();
  const totalMessages = await consultationService.getTotalMessages();
  
  // Real stats from services
  const stats = {
    totalUsers: totalUsers.toString(),
    totalConsultations: totalConsultations.toString(),
    totalMessages: totalMessages.toString(),
    activeUsers: Math.floor(totalUsers * 0.2).toString(), // Mock logic
    crisisAlerts: "0" // Placeholder
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">Ringkasan aktivitas platform SjakCare.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Pengguna"
          value={stats.totalUsers}
          icon={Users}
          description="terdaftar di sistem"
        />
        <StatsCard
          title="Sesi Konsultasi"
          value={stats.totalConsultations}
          icon={MessageSquare}
          description="total sesi seluruhnya"
        />
        <StatsCard
          title="Total Pesan"
          value={stats.totalMessages}
          icon={Activity}
          description="pesan terkirim (User & AI)"
        />
        <StatsCard
          title="Deteksi Krisis"
          value={stats.crisisAlerts}
          icon={ShieldAlert}
          className="border-amber-200 bg-amber-50/10 dark:border-amber-900/50"
          description="deteksi kata kunci krisis"
        />
      </div>

      {/* Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Sesi Terbaru</CardTitle>
            <CardDescription>Aktivitas konsultasi terbaru di platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Sesi anonim dimulai</p>
                    <p className="text-sm text-muted-foreground">
                      {i * 15} menit yang lalu
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
