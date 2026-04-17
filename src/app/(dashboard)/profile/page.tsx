"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, LogOut, Check, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth/auth-client";
import { useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isLoading, setIsLoading] = useState(false);
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

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Berhasil keluar.");
    router.push("/login");
  };

  if (isPending) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const userRole = (session?.user as any)?.role || "user";
  const userEmail = session?.user?.email || "";
  const joinedDate = session?.user?.createdAt ? new Date(session.user.createdAt).toLocaleDateString("id-ID") : "-";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <User className="h-6 w-6 text-primary" /> Pengaturan Profil
        </h1>
        <p className="text-muted-foreground">Kelola informasi akun dan preferensi Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Card */}
        <Card className="md:col-span-1 shadow-sm h-fit">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                {name.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 w-full text-center">
              <h2 className="font-semibold text-xl truncate">{name}</h2>
              <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
            </div>
            
            <Badge role={userRole} />
            
            <Separator className="w-full" />
            
            <div className="w-full text-sm text-muted-foreground text-left space-y-2 pt-2">
              <div className="flex justify-between">
                <span>Member sejak</span>
                <span className="font-medium text-foreground">{joinedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Status Akun</span>
                <span className="font-medium text-green-600 flex items-center gap-1"><Check className="h-3 w-3"/> Aktif</span>
              </div>
            </div>

            <Button 
              variant="destructive" 
              className="w-full mt-4" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" /> Keluar
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          {/* Edit Profile */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Informasi Pribadi</CardTitle>
              <CardDescription>Perbarui nama tampilan Anda di SjakCare.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={userEmail} 
                    disabled 
                    className="bg-muted/50 cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">Email tidak dapat diubah (digunakan untuk login).</p>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-4">
                <Button type="submit" disabled={isLoading || name === session?.user?.name}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Simpan Perubahan
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Change Password */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Keamanan</CardTitle>
              <CardDescription>Perbarui kata sandi untuk menjaga keamanan akun.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdatePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="old-pw">Kata Sandi Saat Ini</Label>
                  <Input 
                    id="old-pw" 
                    type="password"
                    value={oldPassword} 
                    onChange={(e) => setOldPassword(e.target.value)} 
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-pw">Kata Sandi Baru</Label>
                  <Input 
                    id="new-pw" 
                    type="password"
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-4">
                <Button 
                  type="submit" 
                  variant="outline"
                  disabled={isLoading || !oldPassword || !newPassword}
                >
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

function Badge({ role }: { role: string }) {
  if (role === "admin") {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold w-fit">
        <Shield className="h-3.5 w-3.5" />
        Administrator
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium w-fit">
      User Terdaftar
    </div>
  );
}
