"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, LogOut, Check, Shield, Loader2, Camera, Trash2, Mail, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth/auth-client";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name === session?.user?.name) return;
    
    setIsLoading(true);
    const { error } = await authClient.updateUser({
      name: name,
    });
    
    setIsLoading(false);
    if (error) {
      toast.error(error.message || "Gagal memperbarui profil.");
    } else {
      toast.success("Profil berhasil diperbarui!");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;
    
    setIsLoading(true);
    const { error } = await authClient.changePassword({
      newPassword: newPassword,
      currentPassword: oldPassword,
      revokeOtherSessions: true,
    });
    
    setIsLoading(false);
    if (error) {
      toast.error(error.message || "Gagal mengubah kata sandi.");
    } else {
      setOldPassword("");
      setNewPassword("");
      toast.success("Kata sandi berhasil diubah!");
    }
  };

  // Helper untuk menghapus file lama dari Supabase Storage
  const deleteOldImage = async (imageUrl: string | null | undefined) => {
    if (!imageUrl || !imageUrl.includes("supabase.co")) return;
    
    try {
      // Ekstrak path dari URL
      // Format URL Supabase: https://[project].supabase.co/storage/v1/object/public/profiles/[filePath]
      const parts = imageUrl.split("/profiles/");
      if (parts.length > 1) {
        const filePath = parts[1];
        await supabase.storage.from("profiles").remove([filePath]);
      }
    } catch (err) {
      console.error("Gagal menghapus file lama:", err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user) return;

    // Validasi file
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 2MB.");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Hapus foto lama jika ada
      if (session.user.image) {
        await deleteOldImage(session.user.image);
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // 2. Upload foto baru
      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Ambil URL publik
      const { data: { publicUrl } } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);

      // 4. Update di Better Auth
      const { error: updateError } = await authClient.updateUser({
        image: publicUrl,
      });

      if (updateError) throw updateError;

      toast.success("Foto profil berhasil diperbarui!");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Gagal mengunggah gambar.");
    } finally {
      setIsUploading(false);
      // Reset input file
      e.target.value = "";
    }
  };

  const handleRemoveImage = async () => {
    if (!session?.user?.image) return;

    setIsUploading(true);
    try {
      // 1. Hapus dari storage
      await deleteOldImage(session.user.image);

      // 2. Update user (hapus URL image)
      const { error: updateError } = await authClient.updateUser({
        image: "", // Menggunakan string kosong untuk menghapus
      });

      if (updateError) throw updateError;

      toast.success("Foto profil berhasil dihapus!");
    } catch (error: any) {
      console.error("Error removing image:", error);
      toast.error(error.message || "Gagal menghapus gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Berhasil keluar.");
    router.push("/login");
  };

  if (isPending) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const userRole = (session?.user as any)?.role || "user";
  const userEmail = session?.user?.email || "";
  const joinedDate = session?.user?.createdAt ? new Date(session.user.createdAt).toLocaleDateString("id-ID", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : "-";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <User className="h-7 w-7 text-primary" />
          </div>
          Pengaturan Profil
        </h1>
        <p className="text-muted-foreground text-lg">Kelola informasi identitas dan keamanan akun SjakCare Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Snapshot Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-none shadow-xl shadow-primary/5 bg-gradient-to-b from-card to-muted/20">
            <CardContent className="p-0">
              <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5 w-full relative">
                {/* Decorative blobs */}
                <div className="absolute top-2 right-4 w-12 h-12 bg-primary/10 rounded-full blur-xl" />
                <div className="absolute bottom-2 left-4 w-8 h-8 bg-emerald-500/10 rounded-full blur-lg" />
              </div>
              
              <div className="px-6 pb-8 flex flex-col items-center -mt-12">
                <div className="relative group">
                  <Avatar className="h-28 w-28 border-4 border-background shadow-xl transition-all duration-500 group-hover:scale-[1.02]">
                    {session?.user?.image && (
                      <AvatarImage src={session.user.image} alt={name} className="object-cover" />
                    )}
                    <AvatarFallback className="bg-primary/5 text-primary text-4xl font-bold">
                      {name.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                    <label 
                      htmlFor="avatar-upload" 
                      className="cursor-pointer bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors border border-white/20"
                      title="Ubah Foto"
                    >
                      {isUploading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <Camera className="h-6 w-6" />
                      )}
                    </label>
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </div>

                  {session?.user?.image && !isUploading && (
                    <button
                      onClick={handleRemoveImage}
                      className="absolute bottom-1 right-1 bg-destructive text-destructive-foreground p-1.5 rounded-full shadow-lg hover:bg-destructive/90 transition-all border-2 border-background"
                      title="Hapus Foto"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="mt-4 text-center space-y-1">
                  <h2 className="font-bold text-xl tracking-tight">{name}</h2>
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="text-sm">{userEmail}</span>
                  </div>
                </div>
                
                <div className="mt-6 w-full space-y-4">
                  <div className={cn(
                    "flex items-center justify-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider",
                    userRole === "admin" ? "bg-primary/10 text-primary" : "bg-emerald-500/10 text-emerald-600"
                  )}>
                    {userRole === "admin" ? <Shield className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                    {userRole === "admin" ? "Administrator" : "User Terdaftar"}
                  </div>
                  
                  <Separator className="opacity-50" />
                  
                  <div className="space-y-3 px-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Bergabung pada</span>
                      </div>
                      <span className="font-bold text-foreground">{joinedDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Status Akun</span>
                      </div>
                      <span className="font-bold text-emerald-600">Terverifikasi</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mt-6 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5" 
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Keluar Sesi
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Forms Container */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Info Card */}
          <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden">
            <CardHeader className="bg-muted/30 pb-6">
              <CardTitle className="text-xl">Informasi Pribadi</CardTitle>
              <CardDescription>Sesuaikan identitas digital Anda di platform SjakCare.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold">Nama Lengkap</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    disabled={isLoading}
                    className="rounded-xl border-muted-foreground/20 focus:ring-primary/20"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                  <p className="text-[10px] text-muted-foreground">Nama ini akan terlihat oleh konselor dan di dashboard Anda.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold opacity-70">Alamat Email</Label>
                  <Input 
                    id="email" 
                    value={userEmail} 
                    disabled 
                    className="rounded-xl bg-muted/30 border-dashed cursor-not-allowed opacity-70"
                  />
                  <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 italic">
                    <Shield className="h-3 w-3" /> Email dikunci untuk alasan keamanan.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 border-t p-6 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isLoading || name === session?.user?.name}
                  className="rounded-xl px-8 shadow-lg shadow-primary/10 transition-all active:scale-95"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Simpan Perubahan
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Security Card */}
          <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden">
            <CardHeader className="bg-muted/30 pb-6">
              <CardTitle className="text-xl">Keamanan Akun</CardTitle>
              <CardDescription>Ganti kata sandi secara berkala untuk menjaga privasi Anda.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdatePassword}>
              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="old-pw" className="text-sm font-bold">Kata Sandi Saat Ini</Label>
                    <Input 
                      id="old-pw" 
                      type="password"
                      value={oldPassword} 
                      onChange={(e) => setOldPassword(e.target.value)} 
                      disabled={isLoading}
                      className="rounded-xl border-muted-foreground/20"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-pw" className="text-sm font-bold">Kata Sandi Baru</Label>
                    <Input 
                      id="new-pw" 
                      type="password"
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      disabled={isLoading}
                      className="rounded-xl border-muted-foreground/20"
                      placeholder="Minimal 8 karakter"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 border-t p-6 flex justify-end">
                <Button 
                  type="submit" 
                  variant="outline"
                  disabled={isLoading || !oldPassword || !newPassword}
                  className="rounded-xl px-8 border-primary/20 hover:bg-primary/5 transition-all"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Ubah Kata Sandi
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
