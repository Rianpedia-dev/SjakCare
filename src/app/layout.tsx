import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SjakCare - Pendukung Kesehatan Mental Mahasiswa",
  description:
    "Sistem pendukung kesehatan mental mahasiswa berbasis AI. Konsultasi, dukungan emosional, dan informasi kesehatan mental.",
  keywords: ["kesehatan mental", "mahasiswa", "AI", "konsultasi", "SjakCare"],
  icons: {
    icon: [
      { url: "/logo-sjakcare.png" },
      { url: "/logo-sjakcare.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: ["/logo-sjakcare.png"],
    apple: [
      { url: "/logo-sjakcare.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/logo-sjakcare.png" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
