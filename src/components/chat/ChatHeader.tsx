"use client";

import { Menu, Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChatSidebar } from "./ChatSidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ChatHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="h-16 border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/5 rounded-full transition-all">
                <Menu className="h-5 w-5" />
              </Button>
            }
          />

          <SheetContent side="left" className="p-0 w-72">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu Chat</SheetTitle>
            </SheetHeader>
            <ChatSidebar isMobile />
          </SheetContent>
        </Sheet>
        
        {/* Title removed as requested */}
      </div>

      <div className="flex items-center gap-2">
        <Link 
          href="/chat/new"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-all"
          )}
          title="Mulai Sesi Baru"
        >
          <Plus className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
