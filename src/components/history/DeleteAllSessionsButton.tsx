"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DeleteAllSessionsButtonProps {
  className?: string;
}

export function DeleteAllSessionsButton({ className }: DeleteAllSessionsButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAll = async () => {
    const confirmDelete = window.confirm(
      "APAKAH ANDA YAKIN?\nTindakan ini akan menghapus SELURUH riwayat sesi konsultasi Anda secara permanen dan tidak dapat dibatalkan."
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/chat", {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menghapus semua sesi");
      }

      toast.success("Seluruh riwayat sesi berhasil dihapus!");
      if (pathname.startsWith("/chat/")) {
        router.push("/chat/new");
      } else {
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Terjadi kesalahan saat menghapus semua sesi.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isDeleting}
      onClick={handleDeleteAll}
      className={cn(
        "rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive transition-all text-xs font-semibold py-1.5 h-auto px-3 shrink-0",
        className
      )}
    >
      {isDeleting ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
      ) : (
        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
      )}
      Hapus Semua
    </Button>
  );
}
