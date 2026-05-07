"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  History,
  User,
  Heart,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { useSession } from "@/lib/auth/auth-client";
import Image from "next/image";

const quickActions = [
  {
    title: "Mulai Konsultasi",
    description: "Curhat & dapatkan dukungan dari AI",
    icon: MessageCircle,
    href: "/chat",
    color: "from-blue-500/10 to-blue-600/5 border-blue-200/50 dark:border-blue-800/50",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Riwayat Konsultasi",
    description: "Lihat percakapan sebelumnya",
    icon: History,
    href: "/history",
    color: "from-emerald-500/10 to-emerald-600/5 border-emerald-200/50 dark:border-emerald-800/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Kelola Profil",
    description: "Edit informasi akun kamu",
    icon: User,
    href: "/profile",
    color: "from-purple-500/10 to-purple-600/5 border-purple-200/50 dark:border-purple-800/50",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];

const mentalHealthTips = [
  {
    icon: Heart,
    tip: "Luangkan 10 menit sehari untuk meditasi atau pernapasan dalam",
  },
  {
    icon: BookOpen,
    tip: "Journaling dapat membantu mengelola emosi dan pikiran secara lebih baik",
  },
  {
    icon: TrendingUp,
    tip: "Aktivitas fisik ringan seperti berjalan kaki bisa meningkatkan mood",
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Tamu";
  
  // Mock stats
  const mockStats = { totalSessions: 5, totalMessages: 23 };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 17) return "Selamat Siang";
    if (hour < 21) return "Selamat Sore";
    return "Selamat Malam";
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Greeting Card */}
      <Card className="border-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <CardHeader className="pb-2">
          <CardDescription className="text-sm font-medium text-primary">
            {getGreeting()} 👋
          </CardDescription>
          <CardTitle className="text-2xl md:text-3xl font-bold">
            {userName}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm md:text-base">
            Selamat datang kembali di SjakCare. Bagaimana perasaanmu hari ini? Jangan ragu untuk berbagi cerita.
          </p>
          <Link href="/chat" className={cn(buttonVariants({ variant: "default", size: "lg" }), "mt-4 gap-2.5 shadow-sm active:scale-95 transition-all")}>
            <div className="h-5 w-5 flex items-center justify-center">
              <Image 
                src="/logo-sjakcare.png" 
                alt="Logo" 
                width={20} 
                height={20} 
                className="object-contain"
              />
            </div>
            Mulai Konsultasi AI
          </Link>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockStats.totalSessions}</p>
              <p className="text-xs text-muted-foreground">Sesi Konsultasi</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockStats.totalMessages}</p>
              <p className="text-xs text-muted-foreground">Total Pesan</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Akses Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className={`border bg-gradient-to-br ${action.color} hover:shadow-md transition-all duration-200 cursor-pointer group h-full`}>
                <CardContent className="p-5">
                  <action.icon className={`h-8 w-8 ${action.iconColor} mb-3 group-hover:scale-110 transition-transform`} />
                  <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Mental Health Tips */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Heart className="h-4 w-4 text-pink-500" />
            Tips Kesehatan Mental
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mentalHealthTips.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
