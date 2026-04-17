"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageCircle,
  History,
  User,
} from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Beranda", icon: LayoutDashboard },
  { href: "/chat", label: "Konsultasi AI", icon: MessageCircle },
  { href: "/history", label: "Riwayat", icon: History },
  { href: "/profile", label: "Profil", icon: User },
];

interface SidebarProps {
  isMobile?: boolean;
}

export function Sidebar({ isMobile = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col bg-card/50 p-4",
        isMobile
          ? "flex w-full"
          : "hidden md:flex w-64 border-r min-h-0"
      )}
    >
      <nav className="space-y-1.5">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "drop-shadow-sm")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Info box at bottom */}
      <div className="mt-auto pt-4">
        <div className="rounded-xl bg-primary/5 border border-primary/10 p-3.5">
          <p className="text-xs font-medium text-primary mb-1">💡 Tips Hari Ini</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Luangkan waktu 5 menit untuk bernapas dalam dan tenangkan pikiran.
          </p>
        </div>
      </div>
    </aside>
  );
}
