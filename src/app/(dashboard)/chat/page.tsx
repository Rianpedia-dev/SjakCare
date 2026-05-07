"use client";

import { MessageSquarePlus, History } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";

export default function ChatIndexPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-lg z-10 space-y-8"
      >
        <div className="relative inline-block">
          <div className="h-28 w-28 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/10 relative z-10 p-5 transition-transform hover:scale-105 duration-500">
            <Image 
              src="/logo-sjakcare.png" 
              alt="SjakCare" 
              width={80} 
              height={80} 
              className="object-contain"
            />
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"
          >
            <div className="h-5 w-5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </motion.div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">Pusat Konsultasi SjakCare</h2>
          <p className="text-muted-foreground leading-relaxed">
            Selamat datang di ruang amanmu. SjakCare AI siap mendengarkan setiap ceritamu tanpa menghakimi. Mulai sesi baru atau pilih riwayat konsultasi di samping.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/chat/new" 
            className={cn(
              buttonVariants({ size: "lg" }), 
              "w-full sm:w-auto gap-2 rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
            )}
          >
            <MessageSquarePlus className="h-5 w-5" />
            Mulai Sesi Baru
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium px-4 py-2 rounded-2xl border border-border/50 bg-background/50">
            <History className="h-4 w-4" />
            Pilih Riwayat di Sidebar
          </div>
        </div>

        <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Privasi Terjamin", icon: "🛡️" },
            { label: "Respon Cepat", icon: "⚡" },
            { label: "Tanpa Judgment", icon: "🤝" }
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm space-y-2">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-xs font-bold uppercase tracking-wider opacity-70">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
