"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DeleteSessionButtonProps {
  sessionId: string;
  className?: string;
}

export function DeleteSessionButton({ sessionId, className }: DeleteSessionButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Mencegah card memicu navigasi ke chat

    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus riwayat sesi konsultasi ini secara permanen?");
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/chat/${sessionId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menghapus sesi");
      }

      toast.success("Riwayat sesi berhasil dihapus!");
      router.refresh(); // Memicu server-side re-validation
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Terjadi kesalahan saat menghapus sesi.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={isDeleting}
      onClick={handleDelete}
      className={cn(
        "h-9 w-9 rounded-full text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-all shrink-0",
        className
      )}
      title="Hapus Riwayat"
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin text-destructive" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
