"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, MessageSquare } from "lucide-react";

// Mock data (akan diganti dengan data dari server, misal via API atau Server Component prop)
const mockSessions = [
  { id: "1", title: "Merasa kewalahan dengan tugas", date: "Hari ini" },
  { id: "2", title: "Kecemasan menjelang ujian", date: "Kemarin" },
  { id: "3", title: "Masalah dengan teman sekelompok", date: "15 April" },
];

export function ChatSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-card/30 flex flex-col hidden md:flex">
      <div className="p-4 border-b">
        <Link href="/chat/new" className={cn(buttonVariants({ variant: "default" }), "w-full gap-2 shadow-sm")}>
          <Plus className="h-4 w-4" />
          Sesi Baru
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">
          Sesi Sebelumnya
        </h3>
        <div className="space-y-1">
          {mockSessions.map((session) => {
            const isActive = pathname === `/chat/${session.id}`;
            return (
              <Link
                key={session.id}
                href={`/chat/${session.id}`}
                className={cn(
                  "flex flex-col gap-1 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="font-medium truncate">{session.title}</span>
                </div>
                <span className="text-[10px] pl-6 text-muted-foreground/80">
                  {session.date}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
