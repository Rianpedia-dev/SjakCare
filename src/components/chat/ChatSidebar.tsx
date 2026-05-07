"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Plus, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ChatSidebarProps {
  isMobile?: boolean;
}

export function ChatSidebar({ isMobile = false }: ChatSidebarProps) {
  return (
    <div className={cn(
      "w-72 border-r bg-card/40 backdrop-blur-xl flex flex-col h-full relative z-20",
      !isMobile && "hidden lg:flex"
    )}>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo-sjakcare.png" 
              alt="SjakCare" 
              width={32} 
              height={32} 
              className="object-contain"
            />
            <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Konsultasi
            </h2>
          </div>
          <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
            <Link 
              href="/chat/new" 
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }), 
                "rounded-2xl border-primary/20 bg-background/50 hover:bg-primary hover:text-primary-foreground transition-all shadow-lg shadow-primary/5"
              )}
            >
              <Plus className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>

        {/* Info card instead of large CTA */}
        <div className="px-2">
          <div className="flex items-start gap-3 p-5 rounded-3xl bg-primary/5 border border-primary/10 transition-all hover:bg-primary/[0.08]">
            <Heart className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-primary">Ruang Amanmu</p>
              <p className="text-[10px] text-muted-foreground leading-normal">
                Suaramu didengar. Ceritakan apa saja yang ada di pikiranmu tanpa rasa takut dihakimi.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* Footer Minimalis */}
      <div className="p-8 text-center space-y-3">
        <Image 
          src="/logo-sjakcare.png" 
          alt="SjakCare" 
          width={24} 
          height={24} 
          className="mx-auto object-contain opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500"
        />
        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-40">
          SjakCare Digital Support
        </p>
      </div>
    </div>
  );
}
