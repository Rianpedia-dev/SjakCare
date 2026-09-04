"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Cpu, Zap, CheckCircle2, ShieldCheck, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AIProviderSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function AIProviderSwitcher({ className, compact = false }: AIProviderSwitcherProps) {
  const [provider, setProvider] = useState<"gemini" | "openrouter">("gemini");
  const [geminiConfigured, setGeminiConfigured] = useState(true);
  const [openrouterConfigured, setOpenrouterConfigured] = useState(true);
  const [openrouterModel, setOpenrouterModel] = useState("openrouter/free");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch initial setting
  const fetchSetting = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/ai-provider");
      if (res.ok) {
        const data = await res.json();
        setProvider(data.provider || "gemini");
        setGeminiConfigured(Boolean(data.geminiConfigured));
        setOpenrouterConfigured(Boolean(data.openrouterConfigured));
        if (data.openrouterModel) setOpenrouterModel(data.openrouterModel);
      }
    } catch (err) {
      console.error("Gagal mengambil konfigurasi AI Provider:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSetting();
  }, []);

  // Handle toggle switch
  const handleToggle = async (newProvider: "gemini" | "openrouter") => {
    if (newProvider === provider || isUpdating) return;

    setIsUpdating(true);
    const prev = provider;
    setProvider(newProvider); // Optimistic UI update

    try {
      const res = await fetch("/api/admin/ai-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: newProvider }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengubah penyedia AI.");
      }

      toast.success(
        `Berhasil dialihkan ke ${
          newProvider === "gemini" ? "Google Gemini API (Direct)" : "OpenRouter AI"
        }`
      );
    } catch (err: any) {
      setProvider(prev); // Revert on failure
      toast.error(err?.message || "Terjadi kesalahan saat menyimpan pengaturan.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("border-none shadow-xl shadow-primary/5 p-6", className)}>
        <div className="flex items-center justify-center gap-3 py-6 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium">Memuat konfigurasi AI Engine...</span>
        </div>
      </Card>
    );
  }

  const isGemini = provider === "gemini";

  return (
    <Card className={cn("border-none shadow-xl shadow-primary/5 overflow-hidden transition-all duration-300", className)}>
      <CardHeader className="bg-muted/30 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg md:text-xl">Konfigurasi AI Engine</CardTitle>
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-[10px] uppercase font-bold tracking-wider">
                  Admin Only
                </Badge>
              </div>
              <CardDescription className="text-xs md:text-sm mt-0.5">
                Pilih mesin kecerdasan buatan utama untuk konsultasi chat & evaluasi mental.
              </CardDescription>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={fetchSetting}
            disabled={isUpdating}
            className="rounded-full text-muted-foreground hover:text-foreground h-8 w-8"
            title="Refresh Status"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isUpdating && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Main Switch Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-muted/40 border border-muted-foreground/10 transition-all">
          <div className="flex items-center gap-3.5">
            <div className={cn(
              "p-2.5 rounded-xl transition-colors duration-300",
              isGemini ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
            )}>
              {isGemini ? <Zap className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm md:text-base">
                  {isGemini ? "Google Gemini API (Direct)" : "OpenRouter AI"}
                </span>
                <Badge className={cn(
                  "text-[10px] font-semibold px-2 py-0.5",
                  isGemini ? "bg-blue-600 text-white" : "bg-purple-600 text-white"
                )}>
                  Aktif
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isGemini
                  ? "Menggunakan Google AI Studio langsung (Sangat Cepat & Stabil)"
                  : `Menggunakan OpenRouter Multi-Model (${openrouterModel})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <span className="text-xs font-semibold text-muted-foreground hidden md:inline-block">
              {isGemini ? "Google Gemini" : "OpenRouter"}
            </span>
            <div className="flex items-center gap-2">
              <Switch
                checked={isGemini}
                disabled={isUpdating}
                onCheckedChange={(checked) => handleToggle(checked ? "gemini" : "openrouter")}
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-purple-600"
              />
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-primary ml-1" />}
            </div>
          </div>
        </div>

        {/* Comparison Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Google Gemini API */}
          <div
            onClick={() => handleToggle("gemini")}
            className={cn(
              "relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-200 flex flex-col justify-between",
              isGemini
                ? "border-blue-500 bg-blue-500/5 shadow-md shadow-blue-500/5"
                : "border-muted-foreground/15 bg-card hover:border-muted-foreground/30 opacity-75 hover:opacity-100"
            )}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="font-bold text-sm">Google Gemini API</span>
                </div>
                {isGemini && (
                  <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct connection ke Google AI Studio. Sangat direkomendasikan untuk performa optimal, respon super cepat, dan tanpa batas kuota kredit berbayar.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-muted/50 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="text-muted-foreground">Model: <strong className="text-foreground">gemini-1.5-flash</strong></span>
              <span className={cn(
                "inline-flex items-center gap-1 font-medium",
                geminiConfigured ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
              )}>
                <ShieldCheck className="h-3.5 w-3.5" />
                {geminiConfigured ? "GEMINI_API_KEY Terpasang" : "Kunci Belum Diset"}
              </span>
            </div>
          </div>

          {/* Card OpenRouter AI */}
          <div
            onClick={() => handleToggle("openrouter")}
            className={cn(
              "relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-200 flex flex-col justify-between",
              !isGemini
                ? "border-purple-500 bg-purple-500/5 shadow-md shadow-purple-500/5"
                : "border-muted-foreground/15 bg-card hover:border-muted-foreground/30 opacity-75 hover:opacity-100"
            )}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                  <span className="font-bold text-sm">OpenRouter AI</span>
                </div>
                {!isGemini && (
                  <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Platform agregator multi-model. Mendukung berbagai model AI seperti model gratis (<code className="text-[10px] bg-muted px-1 py-0.5 rounded">openrouter/free</code>) atau model berbayar lainnya.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-muted/50 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="text-muted-foreground">Model: <strong className="text-foreground">{openrouterModel}</strong></span>
              <span className={cn(
                "inline-flex items-center gap-1 font-medium",
                openrouterConfigured ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
              )}>
                <ShieldCheck className="h-3.5 w-3.5" />
                {openrouterConfigured ? "OPENROUTER_API_KEY Terpasang" : "Kunci Belum Diset"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/10 border-t px-6 py-3.5 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-primary" />
          <span>Perubahan berlaku secara instan untuk seluruh sesi chat pengguna.</span>
        </div>
      </CardFooter>
    </Card>
  );
}
