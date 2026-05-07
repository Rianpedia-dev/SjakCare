"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Sun, Moon, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession, signOut } from "@/lib/auth/auth-client";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import Image from "next/image";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/login";
  };

  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left side: Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group transition-all">
          <div className="relative h-10 w-10 flex items-center justify-center transition-transform group-hover:scale-105">
            <Image 
              src="/logo-sjakcare.png" 
              alt="SjakCare Logo" 
              width={40} 
              height={40} 
              className="object-contain"
            />
          </div>
          <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            SjakCare
          </span>
        </Link>

        {/* Right side: Actions */}
        <div className="flex items-center gap-1.5 md:gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full hover:bg-primary/5 transition-colors"
          >
            <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle tema</span>
          </Button>

          {/* User Profile (Desktop) */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full border-2 border-primary/10 hover:border-primary/30 transition-all overflow-hidden" />}>
                <Avatar className="h-8 w-8">
                  {session?.user?.image && (
                    <AvatarImage src={session.user.image} className="object-cover" />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <div className="px-3 py-2.5">
                  <p className="text-sm font-bold truncate">{session?.user?.name || "Pengguna"}</p>
                  <p className="text-[10px] font-medium text-muted-foreground/70 truncate">{session?.user?.email || "Sesi aktif"}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/profile" className="cursor-pointer w-full flex items-center px-3 py-2" />}>
                  <User className="mr-2 h-4 w-4" /> Profil Saya
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive cursor-pointer px-3 py-2"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/5" />}>
              <Menu className="h-5.5 w-5.5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0 border-l flex flex-col">
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
              
              <div className="p-6 border-b bg-muted/20">
                <Link href="/dashboard" className="flex items-center gap-3">
                  <Image 
                    src="/logo-sjakcare.png" 
                    alt="SjakCare Logo" 
                    width={36} 
                    height={36} 
                    className="object-contain"
                  />
                  <span className="font-bold text-xl text-primary tracking-tight">SjakCare</span>
                </Link>
              </div>

              <div className="flex-1 py-2 overflow-y-auto">
                <Sidebar isMobile />
              </div>

              <div className="p-4 border-t bg-muted/10 space-y-3">
                <Link href="/profile" className="flex items-center gap-3 px-3 py-2 hover:bg-primary/5 rounded-xl transition-all group">
                  <Avatar className="h-9 w-9 border-2 border-primary/10 group-hover:border-primary/30 transition-all">
                    {session?.user?.image && (
                      <AvatarImage src={session.user.image} className="object-cover" />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{session?.user?.name || "Profil"}</p>
                    <p className="text-[10px] text-muted-foreground truncate">Kelola Akun</p>
                  </div>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/5 px-3 rounded-xl h-11"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Keluar
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
