# 🛠️ Plan Implementasi & Technical Document

## Pembuatan Web App: Sistem Pendukung Kesehatan Mental Mahasiswa Menggunakan AI

> **Judul:** Implementasi OOP Pendukung Kesehatan Mental Mahasiswa Menggunakan AI
>
> **Tech Stack:** Next.js 15 · Shadcn UI · Tailwind CSS · PostgreSQL · Drizzle ORM · Supabase · Better Auth · OpenRouter.ai · Docker
>
> **Metode Pengembangan:** Waterfall (Analysis → Design → Implementation → Testing → Maintenance)

---

## Daftar Isi

1. [Overview & Prasyarat](#1-overview--prasyarat)
2. [Struktur Folder Proyek](#2-struktur-folder-proyek)
3. [Fase 1 – Inisialisasi Proyek](#3-fase-1--inisialisasi-proyek)
4. [Fase 2 – Konfigurasi Database](#4-fase-2--konfigurasi-database)
5. [Fase 3 – Autentikasi (Better Auth)](#5-fase-3--autentikasi-better-auth)
6. [Fase 4 – Layout & Design System](#6-fase-4--layout--design-system)
7. [Fase 5 – Halaman Publik (Login & Register)](#7-fase-5--halaman-publik-login--register)
8. [Fase 6 – Dashboard & Navigasi](#8-fase-6--dashboard--navigasi)
9. [Fase 7 – Fitur Chat AI (Core Feature)](#9-fase-7--fitur-chat-ai-core-feature)
10. [Fase 8 – Riwayat Konsultasi](#10-fase-8--riwayat-konsultasi)
11. [Fase 9 – Profil Pengguna](#11-fase-9--profil-pengguna)
12. [Fase 10 – Admin Dashboard & Kelola Pengguna](#12-fase-10--admin-dashboard--kelola-pengguna)
13. [Fase 11 – Mekanisme Keamanan AI](#13-fase-11--mekanisme-keamanan-ai)
14. [Fase 12 – Penerapan OOP (Refactor)](#14-fase-12--penerapan-oop-refactor)
15. [Fase 13 – Pengujian (Black Box Testing)](#15-fase-13--pengujian-black-box-testing)
16. [Fase 14 – Dockerisasi & Deployment](#16-fase-14--dockerisasi--deployment)
17. [Fase 15 – Dokumentasi & Finalisasi](#17-fase-15--dokumentasi--finalisasi)
18. [Checklist Akhir](#18-checklist-akhir)
19. [Referensi Teknis](#19-referensi-teknis)

---

## 1. Overview & Prasyarat

### 1.1 Gambaran Umum

Dokumen ini adalah **panduan implementasi step-by-step** untuk membangun web app dari nol hingga deploy. Setiap fase berisi:
- **Tujuan** fase
- **File yang dibuat/dimodifikasi**
- **Kode/Perintah** yang dijalankan
- **Penjelasan teknis** setiap langkah
- **Validasi** bahwa fase berhasil

### 1.2 Prasyarat Software

Pastikan sudah terinstall di komputer:

| Software | Versi Minimum | Cek Instalasi | Download |
|----------|--------------|---------------|----------|
| **Node.js** | v20.x LTS | `node -v` | [nodejs.org](https://nodejs.org) |
| **npm** | v10.x | `npm -v` | Bundled with Node.js |
| **Git** | v2.x | `git --version` | [git-scm.com](https://git-scm.com) |
| **VS Code** | Latest | – | [code.visualstudio.com](https://code.visualstudio.com) |
| **Docker Desktop** | v24.x | `docker --version` | [docker.com](https://docker.com) |
| **PostgreSQL** (opsional lokal) | v16.x | `psql --version` | Atau pakai Supabase Cloud |

### 1.3 Akun yang Diperlukan

| Layanan | Keperluan | URL |
|---------|-----------|-----|
| **Supabase** | Hosting database PostgreSQL | [supabase.com](https://supabase.com) |
| **OpenRouter.ai** | API key untuk akses model AI/LLM | [openrouter.ai](https://openrouter.ai) |
| **GitHub** (opsional) | Version control & repository | [github.com](https://github.com) |

### 1.4 Environment Variables yang Dibutuhkan

Buat file `.env.local` di root proyek (akan dibuat di Fase 1):

```env
# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres

# Better Auth
BETTER_AUTH_SECRET=your-random-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# OpenRouter AI
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 2. Struktur Folder Proyek

### 2.1 Struktur Final yang Diharapkan

```
mental-health-app/
├── .env.local                    # Environment variables (JANGAN commit!)
├── .gitignore
├── Dockerfile                    # Docker configuration
├── docker-compose.yml            # Docker Compose
├── drizzle.config.ts             # Drizzle ORM config
├── next.config.ts                # Next.js configuration
├── package.json
├── tailwind.config.ts            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
│
├── public/                       # Static assets
│   ├── images/
│   │   └── logo.png
│   └── favicon.ico
│
├── src/
│   ├── app/                      # Next.js App Router (halaman-halaman)
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page / redirect
│   │   ├── globals.css           # Global styles
│   │   │
│   │   ├── (auth)/               # Route group: halaman auth
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # Halaman Login
│   │   │   └── register/
│   │   │       └── page.tsx      # Halaman Register
│   │   │
│   │   ├── (dashboard)/          # Route group: halaman user
│   │   │   ├── layout.tsx        # Dashboard layout (sidebar + navbar)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx      # Halaman Dashboard/Beranda
│   │   │   ├── chat/
│   │   │   │   ├── page.tsx      # Halaman Chat AI (daftar sesi)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # Halaman Chat Detail (per sesi)
│   │   │   ├── history/
│   │   │   │   └── page.tsx      # Halaman Riwayat Konsultasi
│   │   │   └── profile/
│   │   │       └── page.tsx      # Halaman Profil Pengguna
│   │   │
│   │   ├── (admin)/              # Route group: halaman admin
│   │   │   ├── layout.tsx        # Admin layout
│   │   │   ├── admin/
│   │   │   │   └── page.tsx      # Dashboard Admin (statistik)
│   │   │   └── admin/users/
│   │   │       └── page.tsx      # Kelola Pengguna
│   │   │
│   │   └── api/                  # API Routes
│   │       ├── auth/
│   │       │   └── [...all]/
│   │       │       └── route.ts  # Better Auth catch-all route
│   │       ├── chat/
│   │       │   └── route.ts      # API endpoint chat AI
│   │       └── admin/
│   │           └── users/
│   │               └── route.ts  # API CRUD pengguna
│   │
│   ├── components/               # Komponen reusable
│   │   ├── ui/                   # Shadcn UI components (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (komponen Shadcn lainnya)
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── Navbar.tsx        # Navigation bar
│   │   │   ├── Sidebar.tsx       # Sidebar navigasi
│   │   │   ├── Footer.tsx        # Footer
│   │   │   └── AdminSidebar.tsx  # Sidebar admin
│   │   │
│   │   ├── auth/                 # Auth components
│   │   │   ├── LoginForm.tsx     # Form login
│   │   │   ├── RegisterForm.tsx  # Form registrasi
│   │   │   └── AuthGuard.tsx     # Proteksi route
│   │   │
│   │   ├── chat/                 # Chat components
│   │   │   ├── ChatWindow.tsx    # Area percakapan
│   │   │   ├── ChatInput.tsx     # Input pesan
│   │   │   ├── ChatBubble.tsx    # Bubble pesan (user & AI)
│   │   │   ├── ChatSidebar.tsx   # Daftar sesi chat
│   │   │   └── DisclaimerModal.tsx # Modal disclaimer
│   │   │
│   │   └── admin/                # Admin components
│   │       ├── StatsCard.tsx     # Kartu statistik
│   │       ├── UsersTable.tsx    # Tabel pengguna
│   │       └── UserActions.tsx   # Aksi per pengguna
│   │
│   ├── lib/                      # Library & utilities
│   │   ├── db/
│   │   │   ├── index.ts          # Database connection (Drizzle)
│   │   │   ├── schema.ts         # Database schema definition
│   │   │   └── migrations/       # SQL migration files
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.ts           # Better Auth server config
│   │   │   └── auth-client.ts    # Better Auth client config
│   │   │
│   │   ├── ai/
│   │   │   ├── openrouter.ts     # OpenRouter API client
│   │   │   └── system-prompt.ts  # System prompt configuration
│   │   │
│   │   ├── services/             # OOP Service Classes
│   │   │   ├── BaseService.ts    # Parent class (abstract)
│   │   │   ├── AuthService.ts    # Autentikasi service
│   │   │   ├── ChatService.ts    # Chat/AI service
│   │   │   ├── UserService.ts    # User management service
│   │   │   └── ConsultationService.ts # Konsultasi service
│   │   │
│   │   ├── utils/                # Helper functions
│   │   │   ├── cn.ts             # className merger (shadcn)
│   │   │   ├── formatDate.ts     # Format tanggal Indonesia
│   │   │   └── validators.ts     # Validasi input
│   │   │
│   │   └── types/                # TypeScript types
│   │       ├── index.ts          # Type exports
│   │       ├── user.ts           # User types
│   │       ├── chat.ts           # Chat types
│   │       └── consultation.ts   # Consultation types
│   │
│   ├── hooks/                    # Custom React Hooks
│   │   ├── useAuth.ts            # Hook autentikasi
│   │   ├── useChat.ts            # Hook chat functionality
│   │   └── useAdmin.ts           # Hook admin data
│   │
│   └── middleware.ts             # Next.js middleware (route protection)
│
└── drizzle/                      # Drizzle migration output
    └── migrations/
```

### 2.2 Penjelasan Struktur

| Folder | Fungsi |
|--------|--------|
| `src/app/` | **Pages** – Halaman-halaman aplikasi (Next.js App Router) |
| `src/app/(auth)/` | **Route Group** – Halaman login & register (tanpa layout dashboard) |
| `src/app/(dashboard)/` | **Route Group** – Halaman user (dengan sidebar & navbar) |
| `src/app/(admin)/` | **Route Group** – Halaman admin (dengan sidebar admin) |
| `src/app/api/` | **API Routes** – Backend endpoints |
| `src/components/` | **Komponen** – UI reusable, dikelompokkan per fitur |
| `src/lib/` | **Library** – Logika bisnis, koneksi DB, OOP services |
| `src/lib/services/` | **OOP Classes** – Implementasi 4 pilar OOP |
| `src/hooks/` | **Custom Hooks** – React hooks untuk state management |

---

## 3. Fase 1 – Inisialisasi Proyek

### 3.1 Tujuan
Membuat proyek Next.js baru dengan konfigurasi TypeScript, Tailwind CSS, dan Shadcn UI.

### 3.2 Langkah-langkah

#### Step 1: Buat Proyek Next.js

```bash
# Buat proyek baru
npx -y create-next-app@latest mental-health-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

# Masuk ke folder proyek
cd mental-health-app
```

**Opsi yang dipilih saat create-next-app:**

| Opsi | Pilihan |
|------|---------|
| TypeScript | ✅ Yes |
| ESLint | ✅ Yes |
| Tailwind CSS | ✅ Yes |
| `src/` directory | ✅ Yes |
| App Router | ✅ Yes |
| Import alias | `@/*` |

#### Step 2: Install Dependencies Utama

```bash
# Database & ORM
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit

# Authentication
npm install better-auth

# UI Components (Shadcn UI dependencies)
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-avatar @radix-ui/react-toast @radix-ui/react-separator

# AI Integration
npm install ai  # Vercel AI SDK (opsional, untuk streaming)

# Utilities
npm install date-fns zod react-hook-form @hookform/resolvers
npm install next-themes sonner

# PostgreSQL driver
npm install postgres
```

#### Step 3: Inisialisasi Shadcn UI

```bash
# Init Shadcn UI
npx shadcn@latest init
```

**Opsi saat init shadcn:**

| Opsi | Pilihan |
|------|---------|
| Style | Default |
| Base color | Neutral / Slate |
| CSS variables | ✅ Yes |
| `tailwind.config.ts` | ✅ Yes |
| Components alias | `@/components` |
| Utils alias | `@/lib/utils` |

#### Step 4: Install Komponen Shadcn yang Dibutuhkan

```bash
npx shadcn@latest add button input label card
npx shadcn@latest add dialog sheet table
npx shadcn@latest add avatar dropdown-menu separator
npx shadcn@latest add toast textarea badge
npx shadcn@latest add form select tabs
npx shadcn@latest add scroll-area skeleton
```

#### Step 5: Buat File Environment

```bash
# Buat file .env.local
```

Isi `.env.local`:
```env
# ===== DATABASE =====
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres

# ===== BETTER AUTH =====
BETTER_AUTH_SECRET=generate-random-string-minimum-32-characters-here
BETTER_AUTH_URL=http://localhost:3000

# ===== OPENROUTER AI =====
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here

# ===== APP =====
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Step 6: Update `.gitignore`

Tambahkan di `.gitignore`:
```
.env.local
.env*.local
node_modules/
```

### 3.3 Validasi Fase 1

```bash
# Jalankan dev server
npm run dev
```

✅ **Berhasil jika:** Browser di `http://localhost:3000` menampilkan halaman default Next.js.

---

## 4. Fase 2 – Konfigurasi Database

### 4.1 Tujuan
Setup koneksi database PostgreSQL via Supabase dan definisi schema menggunakan Drizzle ORM.

### 4.2 Langkah-langkah

#### Step 1: Setup Supabase Project

1. Buka [supabase.com](https://supabase.com) → Buat project baru.
2. Catat **Database URL** dari Settings → Database → Connection String (URI).
3. Masukkan URL ke `.env.local` sebagai `DATABASE_URL`.

#### Step 2: Buat Drizzle Config

**File: `drizzle.config.ts`** (root proyek)

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

#### Step 3: Buat Database Connection

**File: `src/lib/db/index.ts`**

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
```

#### Step 4: Definisikan Database Schema

**File: `src/lib/db/schema.ts`**

```typescript
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ===== ENUMS =====
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const messageRoleEnum = pgEnum("message_role", ["user", "assistant"]);

// ===== TABLE: user =====
export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  image: text("image"),
  role: roleEnum("role").default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== TABLE: session (untuk Better Auth) =====
export const session = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== TABLE: account (untuk Better Auth) =====
export const account = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== TABLE: verification (untuk Better Auth) =====
export const verification = pgTable("verification", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===== TABLE: consultation (sesi konsultasi) =====
export const consultation = pgTable("consultation", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).default("Sesi Konsultasi Baru"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== TABLE: message (pesan percakapan) =====
export const message = pgTable("message", {
  id: uuid("id").primaryKey().defaultRandom(),
  consultationId: uuid("consultation_id")
    .notNull()
    .references(() => consultation.id, { onDelete: "cascade" }),
  role: messageRoleEnum("role").notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== RELATIONS =====
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  consultations: many(consultation),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const consultationRelations = relations(consultation, ({ one, many }) => ({
  user: one(user, {
    fields: [consultation.userId],
    references: [user.id],
  }),
  messages: many(message),
}));

export const messageRelations = relations(message, ({ one }) => ({
  consultation: one(consultation, {
    fields: [message.consultationId],
    references: [consultation.id],
  }),
}));
```

#### Step 5: Generate & Push Migration

```bash
# Generate migration files
npx drizzle-kit generate

# Push schema ke database Supabase
npx drizzle-kit push
```

### 4.3 Validasi Fase 2

- Buka **Supabase Dashboard** → Table Editor.
- ✅ **Berhasil jika:** Tabel `user`, `session`, `account`, `verification`, `consultation`, dan `message` sudah muncul dengan kolom yang sesuai.

---

## 5. Fase 3 – Autentikasi (Better Auth)

### 5.1 Tujuan
Konfigurasi Better Auth untuk autentikasi email/password dengan session management.

### 5.2 Langkah-langkah

#### Step 1: Konfigurasi Better Auth (Server)

**File: `src/lib/auth/auth.ts`**

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 hari
    updateAge: 60 * 60 * 24,     // Update setiap 24 jam
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
```

#### Step 2: Konfigurasi Better Auth (Client)

**File: `src/lib/auth/auth-client.ts`**

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
```

#### Step 3: Buat API Route untuk Auth

**File: `src/app/api/auth/[...all]/route.ts`**

```typescript
import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

#### Step 4: Buat Middleware (Route Protection)

**File: `src/middleware.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes yang memerlukan autentikasi
const protectedRoutes = ["/dashboard", "/chat", "/history", "/profile"];
const adminRoutes = ["/admin"];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek apakah user punya session cookie
  const sessionCookie = getSessionCookie(request);

  // Jika sudah login dan akses halaman auth → redirect ke dashboard
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Jika belum login dan akses halaman protected → redirect ke login
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Admin routes: cek cookie ada, role admin dicek di server component
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/chat/:path*",
    "/history/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
```

### 5.3 Validasi Fase 3

- Test signUp via API: `POST /api/auth/sign-up/email` dengan body `{ name, email, password }`.
- Test signIn via API: `POST /api/auth/sign-in/email` dengan body `{ email, password }`.
- ✅ **Berhasil jika:** User terbuat di database dan session cookie terset.

---

## 6. Fase 4 – Layout & Design System

### 6.1 Tujuan
Membangun layout utama, sidebar, navbar, dan design system (warna, font, tema).

### 6.2 Langkah-langkah

#### Step 1: Setup Global Styles & Font

**File: `src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Google Font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@layer base {
  :root {
    /* Warna tema utama - Nuansa hangat/coklat untuk kesehatan mental */
    --background: 0 0% 100%;
    --foreground: 20 14.3% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 20 14.3% 4.1%;
    --primary: 24 60% 45%;         /* Coklat hangat */
    --primary-foreground: 60 9.1% 97.8%;
    --secondary: 30 30% 96%;
    --secondary-foreground: 24 9.8% 10%;
    --muted: 30 20% 96%;
    --muted-foreground: 20 10% 45%;
    --accent: 24 40% 92%;
    --accent-foreground: 24 9.8% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 60 9.1% 97.8%;
    --border: 20 5.9% 90%;
    --input: 20 5.9% 90%;
    --ring: 24 60% 45%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 20 14.3% 4.1%;
    --foreground: 60 9.1% 97.8%;
    --card: 20 14.3% 7%;
    --card-foreground: 60 9.1% 97.8%;
    --primary: 24 60% 55%;
    --primary-foreground: 20 14.3% 4.1%;
    --secondary: 20 14.3% 12%;
    --secondary-foreground: 60 9.1% 97.8%;
    --muted: 20 14.3% 15%;
    --muted-foreground: 20 10% 55%;
    --accent: 20 14.3% 15%;
    --accent-foreground: 60 9.1% 97.8%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 60 9.1% 97.8%;
    --border: 20 14.3% 15%;
    --input: 20 14.3% 15%;
    --ring: 24 60% 55%;
  }
}

body {
  font-family: 'Inter', sans-serif;
}
```

#### Step 2: Root Layout

**File: `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"; // atau toast
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindCare - Pendukung Kesehatan Mental Mahasiswa",
  description: "Sistem pendukung kesehatan mental mahasiswa berbasis AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

#### Step 3: Buat Komponen Navbar

**File: `src/components/layout/Navbar.tsx`**

```tsx
"use client";

import { useSession, signOut } from "@/lib/auth/auth-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-xl font-bold text-primary">MindCare</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">{session?.user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile"><User className="mr-2 h-4 w-4" /> Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" /> Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

#### Step 4: Buat Komponen Sidebar

**File: `src/components/layout/Sidebar.tsx`**

```tsx
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

#### Step 5: Dashboard Layout

**File: `src/app/(dashboard)/layout.tsx`**

```tsx
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### 6.3 Validasi Fase 4

- ✅ Layout dashboard tampil dengan sidebar dan navbar.
- ✅ Menu navigasi berfungsi dan menunjukkan halaman aktif.
- ✅ Responsif di mobile (sidebar tersembunyi).

---

## 7. Fase 5 – Halaman Publik (Login & Register)

### 7.1 Tujuan
Membuat halaman login dan registrasi yang fungsional dengan validasi form.

### 7.2 File yang Dibuat

| File | Deskripsi |
|------|-----------|
| `src/app/(auth)/login/page.tsx` | Halaman login |
| `src/app/(auth)/register/page.tsx` | Halaman register |
| `src/components/auth/LoginForm.tsx` | Form login component |
| `src/components/auth/RegisterForm.tsx` | Form register component |

### 7.3 Detail Implementasi

#### LoginForm Component

**Fitur yang harus ada:**
- Input email dengan validasi format
- Input password dengan show/hide toggle
- Tombol "Masuk"
- Link ke halaman registrasi ("Belum punya akun? Daftar")
- Error handling: pesan error dalam **Bahasa Indonesia**
- Loading state saat proses login
- Redirect ke `/dashboard` setelah berhasil login

**Alur:**
```
User isi form → Klik "Masuk" → signIn(email, password) via Better Auth
  → Berhasil? → Redirect ke /dashboard
  → Gagal? → Tampilkan pesan error (Bahasa Indonesia)
```

#### RegisterForm Component

**Fitur yang harus ada:**
- Input nama lengkap
- Input email (validasi unik)
- Input password (min 8 karakter)
- Input konfirmasi password
- Tombol "Daftar"
- Link ke halaman login ("Sudah punya akun? Masuk")
- Validasi kekuatan password
- Redirect ke `/login` setelah berhasil register

**Alur:**
```
User isi form → Klik "Daftar" → signUp(name, email, password) via Better Auth
  → Berhasil? → Redirect ke /login dengan pesan sukses
  → Gagal? → Tampilkan error (email sudah terdaftar, dll)
```

### 7.4 Validasi Fase 5

| Test Case | Hasil yang Diharapkan |
|-----------|----------------------|
| Login valid | Masuk ke dashboard |
| Login password salah | Pesan error "Email atau kata sandi salah" |
| Login email tidak terdaftar | Pesan error "Akun tidak ditemukan" |
| Register data valid | Akun dibuat, redirect ke login |
| Register email duplikat | Pesan error "Email sudah terdaftar" |
| Register password < 8 char | Validasi gagal, pesan muncul |

---

## 8. Fase 6 – Dashboard & Navigasi

### 8.1 Tujuan
Membuat halaman dashboard (beranda) yang menampilkan informasi profil dan akses cepat ke fitur utama.

### 8.2 File yang Dibuat

| File | Deskripsi |
|------|-----------|
| `src/app/(dashboard)/dashboard/page.tsx` | Halaman dashboard |
| `src/app/page.tsx` | Root page (redirect ke /dashboard atau /login) |

### 8.3 Detail Implementasi

#### Halaman Dashboard

**Komponen yang ditampilkan:**
1. **Greeting Card** – "Selamat datang, [Nama User]!" dengan pesan motivasi
2. **Quick Action Cards:**
   - 💬 "Mulai Konsultasi" → Link ke `/chat`
   - 📋 "Riwayat Konsultasi" → Link ke `/history`
   - 👤 "Kelola Profil" → Link ke `/profile`
3. **Statistik Ringkas** – Jumlah sesi konsultasi yang pernah dilakukan
4. **Info Card** – Tips kesehatan mental singkat

**Data yang diambil dari Server:**
- Session/profil user (via Better Auth)
- Jumlah sesi konsultasi (COUNT dari tabel `consultation` WHERE `userId`)

### 8.4 Validasi Fase 6

- ✅ Dashboard tampil dengan nama user yang login.
- ✅ Quick action cards berfungsi dan mengarah ke halaman yang benar.
- ✅ Statistik menampilkan jumlah sesi yang benar.

---

## 9. Fase 7 – Fitur Chat AI (Core Feature)

### 9.1 Tujuan
Membangun fitur inti: konsultasi AI chatbot dengan real-time messaging, penyimpanan riwayat, dan integrasi OpenRouter.ai.

### 9.2 File yang Dibuat

| File | Deskripsi |
|------|-----------|
| `src/app/(dashboard)/chat/page.tsx` | Halaman daftar sesi chat |
| `src/app/(dashboard)/chat/[id]/page.tsx` | Halaman chat per sesi |
| `src/app/api/chat/route.ts` | API endpoint untuk kirim pesan ke AI |
| `src/lib/ai/openrouter.ts` | OpenRouter API client |
| `src/lib/ai/system-prompt.ts` | Konfigurasi system prompt |
| `src/components/chat/ChatWindow.tsx` | Area percakapan |
| `src/components/chat/ChatInput.tsx` | Input pesan |
| `src/components/chat/ChatBubble.tsx` | Bubble pesan |
| `src/components/chat/ChatSidebar.tsx` | Daftar sesi di sidebar |
| `src/components/chat/DisclaimerModal.tsx` | Modal disclaimer |

### 9.3 Detail Implementasi

#### A. System Prompt

**File: `src/lib/ai/system-prompt.ts`**

```typescript
export const SYSTEM_PROMPT = `Kamu adalah MindCare, pendamping kesehatan mental yang suportif dan empatik untuk mahasiswa.

ATURAN UTAMA:
1. Kamu BUKAN psikolog, psikiater, atau tenaga medis profesional.
2. Kamu TIDAK BOLEH memberikan diagnosis medis atau klinis.
3. Kamu adalah pendukung awal yang mendengarkan, memberikan dukungan emosional, dan informasi umum.
4. Selalu gunakan Bahasa Indonesia yang baik, hangat, dan mudah dipahami.
5. Gunakan nada yang empatik, tidak menghakimi, dan mendukung.
6. Jika pengguna menunjukkan tanda-tanda krisis (bunuh diri, self-harm), SEGERA:
   - Tunjukkan empati
   - Berikan nomor hotline: Into The Light Indonesia (119 ext 8)
   - Sarankan untuk menghubungi profesional terdekat
   - Jangan pernah meremehkan perasaan mereka
7. Selalu ingatkan bahwa layanan ini bersifat pendukung awal, bukan pengganti konsultasi profesional.
8. Berikan saran yang konstruktif dan berbasis bukti ketika memungkinkan.
9. Jangan pernah mendorong pengguna untuk menghentikan pengobatan yang sedang dijalani.
10. Hormati privasi pengguna dan jaga kerahasiaan percakapan.`;
```

#### B. OpenRouter API Client

**File: `src/lib/ai/openrouter.ts`**

```typescript
import { SYSTEM_PROMPT } from "./system-prompt";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function sendMessageToAI(
  messages: ChatMessage[]
): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "",
      "X-Title": "MindCare Mental Health Support",
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo", // atau model lain yang tersedia
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "Maaf, saya tidak dapat merespons saat ini.";
}
```

#### C. API Route Chat

**File: `src/app/api/chat/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { consultation, message } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendMessageToAI } from "@/lib/ai/openrouter";

export async function POST(request: NextRequest) {
  try {
    // 1. Autentikasi
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { consultationId, userMessage } = await request.json();

    // 2. Validasi input
    if (!userMessage || !consultationId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 3. Simpan pesan user ke database
    await db.insert(message).values({
      consultationId,
      role: "user",
      content: userMessage,
    });

    // 4. Ambil riwayat percakapan untuk konteks
    const history = await db.query.message.findMany({
      where: eq(message.consultationId, consultationId),
      orderBy: (msg, { asc }) => [asc(msg.createdAt)],
    });

    // 5. Format untuk API AI
    const chatMessages = history.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    // 6. Kirim ke OpenRouter AI
    const aiResponse = await sendMessageToAI(chatMessages);

    // 7. Simpan respons AI ke database
    await db.insert(message).values({
      consultationId,
      role: "assistant",
      content: aiResponse,
    });

    // 8. Update timestamp konsultasi
    await db
      .update(consultation)
      .set({ updatedAt: new Date() })
      .where(eq(consultation.id, consultationId));

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
```

#### D. Disclaimer Modal

Tampilkan modal ini **sebelum sesi pertama** pengguna memulai chat:

```
╔════════════════════════════════════════════════╗
║         ⚠️ Pemberitahuan Penting              ║
║                                                ║
║  Layanan chatbot AI ini bersifat sebagai       ║
║  PENDUKUNG AWAL dan BUKAN PENGGANTI           ║
║  konsultasi dengan tenaga kesehatan mental     ║
║  profesional (psikolog/psikiater).             ║
║                                                ║
║  Jika Anda berada dalam kondisi darurat,       ║
║  segera hubungi:                               ║
║  📞 Into The Light Indonesia: 119 ext 8        ║
║                                                ║
║  Dengan melanjutkan, Anda memahami dan         ║
║  menyetujui ketentuan di atas.                 ║
║                                                ║
║       [Saya Memahami & Melanjutkan]            ║
╚════════════════════════════════════════════════╝
```

### 9.4 Alur Chat Lengkap

```
1. User buka /chat
       │
       ▼
2. Tampilkan daftar sesi konsultasi yang pernah ada
   + Tombol "Mulai Sesi Baru"
       │
       ▼
3. User klik "Mulai Sesi Baru"
       │
       ▼
4. Tampilkan DisclaimerModal (jika belum pernah accept)
       │
       ▼
5. Buat record baru di tabel `consultation`
       │
       ▼
6. Redirect ke /chat/[id] (halaman chat detail)
       │
       ▼
7. User ketik pesan → Klik kirim
       │
       ▼
8. POST /api/chat { consultationId, userMessage }
       │
       ├── Simpan pesan user ke DB
       ├── Ambil history percakapan
       ├── Kirim ke OpenRouter.ai (dengan system prompt + history)
       ├── Terima respons AI
       └── Simpan respons AI ke DB
       │
       ▼
9. Tampilkan respons AI di ChatWindow
       │
       ▼
10. User bisa lanjut chat atau tutup sesi
```

### 9.5 Validasi Fase 7

| Test Case | Hasil yang Diharapkan |
|-----------|----------------------|
| Mulai sesi baru | Sesi terbuat di DB, redirect ke chat |
| Kirim pesan | AI merespons < 3 detik |
| Riwayat percakapan | Pesan sebelumnya tampil saat buka sesi lama |
| Disclaimer | Modal tampil sebelum sesi pertama |
| Kata kunci krisis | AI tampilkan hotline + saran profesional |

---

## 10. Fase 8 – Riwayat Konsultasi

### 10.1 Tujuan
Menampilkan arsip seluruh sesi konsultasi pengguna.

### 10.2 File yang Dibuat

| File | Deskripsi |
|------|-----------|
| `src/app/(dashboard)/history/page.tsx` | Halaman riwayat |

### 10.3 Detail Implementasi

**Data yang ditampilkan:**
- Daftar seluruh sesi konsultasi milik user yang login
- Setiap item menampilkan: Judul sesi, Tanggal, Preview pesan terakhir
- Klik item → Buka `/chat/[id]` untuk melihat detail percakapan
- Urutkan dari sesi terbaru ke terlama

**Query Database:**
```typescript
const sessions = await db.query.consultation.findMany({
  where: eq(consultation.userId, session.user.id),
  orderBy: (c, { desc }) => [desc(c.updatedAt)],
  with: {
    messages: {
      limit: 1,
      orderBy: (m, { desc }) => [desc(m.createdAt)],
    },
  },
});
```

### 10.4 Validasi Fase 8

- ✅ Daftar sesi tampil lengkap dengan timestamp.
- ✅ Klik sesi membuka detail percakapan.
- ✅ Hanya menampilkan sesi milik user yang login.

---

## 11. Fase 9 – Profil Pengguna

### 11.1 Tujuan
Membuat halaman profil untuk mengelola informasi akun.

### 11.2 File yang Dibuat

| File | Deskripsi |
|------|-----------|
| `src/app/(dashboard)/profile/page.tsx` | Halaman profil |

### 11.3 Detail Implementasi

**Fitur:**
1. **Tampilkan Info Akun:** Nama, Email, Tanggal bergabung
2. **Edit Nama:** Form untuk mengubah nama tampilan
3. **Ganti Password:** Form old password + new password + confirm
4. **Tombol Logout:** Mengakhiri sesi
5. **Statistik:** Total sesi konsultasi, total pesan

**Catatan Teknis:**
- Gunakan Better Auth API untuk update profil: `auth.api.updateUser()`
- Gunakan Better Auth API untuk ganti password: `auth.api.changePassword()`
- Pesan sukses/error dalam Bahasa Indonesia

### 11.4 Validasi Fase 9

| Test Case | Hasil yang Diharapkan |
|-----------|----------------------|
| Edit nama | Nama berubah di database dan tampilan |
| Ganti password (benar) | Password berhasil diubah |
| Ganti password (salah) | Pesan error "Password lama salah" |
| Logout | Sesi dihapus, redirect ke login |

---

## 12. Fase 10 – Admin Dashboard & Kelola Pengguna

### 12.1 Tujuan
Membuat panel admin dengan statistik dan manajemen pengguna.

### 12.2 File yang Dibuat

| File | Deskripsi |
|------|-----------|
| `src/app/(admin)/layout.tsx` | Layout admin (sidebar admin) |
| `src/app/(admin)/admin/page.tsx` | Dashboard admin |
| `src/app/(admin)/admin/users/page.tsx` | Kelola pengguna |
| `src/app/api/admin/users/route.ts` | API CRUD pengguna |
| `src/components/layout/AdminSidebar.tsx` | Sidebar admin |
| `src/components/admin/StatsCard.tsx` | Kartu statistik |
| `src/components/admin/UsersTable.tsx` | Tabel pengguna |

### 12.3 Detail Implementasi

#### A. Proteksi Admin

Setiap halaman admin harus validasi role:

```typescript
// Di Server Component admin
const session = await auth.api.getSession({ headers: await headers() });

if (!session || session.user.role !== "admin") {
  redirect("/dashboard");
}
```

#### B. Dashboard Admin

**Statistik yang ditampilkan:**

| Metrik | Query |
|--------|-------|
| Total Pengguna | `SELECT COUNT(*) FROM user` |
| Total Sesi Konsultasi | `SELECT COUNT(*) FROM consultation` |
| Total Pesan | `SELECT COUNT(*) FROM message` |
| Pengguna Baru (Bulan Ini) | `SELECT COUNT(*) FROM user WHERE created_at >= start_of_month` |
| Sesi Aktif (Hari Ini) | `SELECT COUNT(*) FROM consultation WHERE updated_at >= today` |

#### C. Kelola Pengguna

**Fitur Tabel:**
- Kolom: No, Nama, Email, Role, Tanggal Daftar, Status, Aksi
- **Pencarian:** Search by nama/email
- **Filter:** Filter by role (user/admin)
- **Aksi per row:**
  - 👁️ Lihat detail
  - ✏️ Ubah role
  - 🚫 Nonaktifkan akun

### 12.4 Membuat Admin Pertama

Untuk membuat admin pertama, jalankan query langsung di Supabase SQL Editor:

```sql
-- Ubah role user menjadi admin
UPDATE "user" SET role = 'admin' WHERE email = 'admin@example.com';
```

Atau buat API endpoint khusus (proteksi dengan secret key):

```typescript
// POST /api/admin/create-first-admin
// Header: x-admin-secret: [secret dari env]
```

### 12.5 Validasi Fase 10

| Test Case | Hasil yang Diharapkan |
|-----------|----------------------|
| User biasa akses /admin | Redirect ke /dashboard |
| Admin akses /admin | Dashboard admin tampil |
| Lihat statistik | Angka statistik sesuai data di DB |
| Cari pengguna | Hasil pencarian tampil |
| Nonaktifkan akun | User tidak bisa login lagi |

---

## 13. Fase 11 – Mekanisme Keamanan AI

### 13.1 Tujuan
Implementasi safety guardrails untuk memastikan respons AI aman dan etis.

### 13.2 Detail Implementasi

#### A. System Prompt Engineering
- ✅ Sudah dibuat di Fase 7 (`system-prompt.ts`)
- AI diarahkan sebagai pendamping suportif, bukan diagnosa

#### B. Content Filtering (Crisis Detection)

**File: `src/lib/ai/content-filter.ts`**

```typescript
// Kata kunci krisis yang harus dideteksi
const CRISIS_KEYWORDS = [
  "bunuh diri", "ingin mati", "tidak ingin hidup",
  "menyakiti diri", "self-harm", "suicide",
  "mengakhiri hidup", "tidak ada harapan",
  "overdose", "gantung diri",
];

export function detectCrisis(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) =>
    lowerMessage.includes(keyword)
  );
}

export const CRISIS_RESPONSE = `
🆘 **Saya memahami bahwa kamu sedang merasakan beban yang sangat berat.**

Perasaanmu valid dan kamu tidak sendirian. Saya sangat menyarankan untuk segera menghubungi bantuan profesional:

📞 **Hotline Kesehatan Mental:**
- Into The Light Indonesia: **119 ext 8**
- LSM Jangan Bunuh Diri: **021-9696-9293**
- Yayasan Pulih: **021-788-42580**

Tenaga profesional terlatih siap mendengarkan dan membantu kamu 24 jam.

💙 Kamu berharga, dan ada orang-orang yang peduli padamu.
`;
```

#### C. Integrasi Content Filter ke Chat API

Modifikasi `src/app/api/chat/route.ts`:

```typescript
import { detectCrisis, CRISIS_RESPONSE } from "@/lib/ai/content-filter";

// Di dalam handler POST, sebelum kirim ke OpenRouter:
if (detectCrisis(userMessage)) {
  // Simpan pesan user
  await db.insert(message).values({
    consultationId, role: "user", content: userMessage,
  });

  // Simpan respons krisis
  await db.insert(message).values({
    consultationId, role: "assistant", content: CRISIS_RESPONSE,
  });

  return NextResponse.json({ response: CRISIS_RESPONSE, isCrisis: true });
}
```

#### D. Disclaimer & Informed Consent
- ✅ DisclaimerModal dibuat di Fase 7
- Simpan status accept di `localStorage` atau database

#### E. Logging & Audit Trail
- ✅ Semua pesan otomatis tersimpan di tabel `message`
- Setiap pesan memiliki `timestamp` untuk traceability
- Admin dapat mengaudit percakapan jika diperlukan

### 13.3 Validasi Fase 11

| Test Case | Hasil yang Diharapkan |
|-----------|----------------------|
| Kirim pesan normal | Respons AI normal |
| Kirim pesan "ingin bunuh diri" | Tampilkan info hotline |
| Kirim pesan "self-harm" | Tampilkan info hotline |
| Disclaimer tampil | Modal muncul sebelum chat pertama |
| Cek database | Semua pesan tersimpan dengan timestamp |

---

## 14. Fase 12 – Penerapan OOP (Refactor)

### 14.1 Tujuan
Refactor kode ke arsitektur OOP yang jelas, menerapkan 4 pilar OOP.

### 14.2 Struktur Class

```
src/lib/services/
├── BaseService.ts          # Abstract parent class
├── AuthService.ts          # extends BaseService
├── ChatService.ts          # extends BaseService
├── UserService.ts          # extends BaseService
└── ConsultationService.ts  # extends BaseService
```

### 14.3 Implementasi Class

#### A. BaseService (Abstraksi + Enkapsulasi)

**File: `src/lib/services/BaseService.ts`**

```typescript
import { db } from "@/lib/db";

/**
 * BaseService - Abstract parent class
 * Menerapkan: ABSTRACTION + ENCAPSULATION
 *
 * - Properti `db` di-encapsulate (protected)
 * - Method `handleError` sebagai abstraksi error handling
 * - Child class hanya perlu implement logika spesifik
 */
export abstract class BaseService {
  // ENCAPSULATION: db connection hanya bisa diakses oleh class dan turunannya
  protected readonly database = db;

  // ABSTRACTION: error handling tersembunyi di balik method sederhana
  protected handleError(error: unknown, context: string): never {
    console.error(`[${this.constructor.name}] Error in ${context}:`, error);
    throw new Error(
      `Terjadi kesalahan pada ${context}. Silakan coba lagi.`
    );
  }

  // ABSTRACTION: logging untuk audit trail
  protected log(action: string, details?: Record<string, unknown>): void {
    console.log(`[${this.constructor.name}] ${action}`, details || "");
  }
}
```

#### B. ChatService (Pewarisan + Polimorfisme)

**File: `src/lib/services/ChatService.ts`**

```typescript
import { BaseService } from "./BaseService";
import { consultation, message } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendMessageToAI } from "@/lib/ai/openrouter";
import { detectCrisis, CRISIS_RESPONSE } from "@/lib/ai/content-filter";

/**
 * ChatService - Chat/AI Service
 * Menerapkan: INHERITANCE (extends BaseService) + POLYMORPHISM
 */
export class ChatService extends BaseService {

  // ENCAPSULATION: method publik, detail internal tersembunyi
  async createSession(userId: string, title?: string) {
    try {
      const [newSession] = await this.database
        .insert(consultation)
        .values({
          userId,
          title: title || "Sesi Konsultasi Baru",
        })
        .returning();

      this.log("createSession", { sessionId: newSession.id, userId });
      return newSession;
    } catch (error) {
      this.handleError(error, "membuat sesi konsultasi");
    }
  }

  // POLYMORPHISM: handleResponse beda implementasi untuk krisis vs normal
  async sendMessage(consultationId: string, userMessage: string) {
    try {
      // Simpan pesan user
      await this.database.insert(message).values({
        consultationId,
        role: "user",
        content: userMessage,
      });

      // Content filtering - deteksi krisis
      if (detectCrisis(userMessage)) {
        return this.handleCrisisResponse(consultationId);
      }

      return this.handleNormalResponse(consultationId);
    } catch (error) {
      this.handleError(error, "mengirim pesan");
    }
  }

  // POLYMORPHISM: handling berbeda untuk respons krisis
  private async handleCrisisResponse(consultationId: string) {
    await this.database.insert(message).values({
      consultationId,
      role: "assistant",
      content: CRISIS_RESPONSE,
    });

    this.log("crisisDetected", { consultationId });
    return { response: CRISIS_RESPONSE, isCrisis: true };
  }

  // POLYMORPHISM: handling berbeda untuk respons normal
  private async handleNormalResponse(consultationId: string) {
    const history = await this.getMessages(consultationId);
    const chatMessages = history.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    const aiResponse = await sendMessageToAI(chatMessages);

    await this.database.insert(message).values({
      consultationId,
      role: "assistant",
      content: aiResponse,
    });

    this.log("normalResponse", { consultationId });
    return { response: aiResponse, isCrisis: false };
  }

  async getMessages(consultationId: string) {
    return this.database.query.message.findMany({
      where: eq(message.consultationId, consultationId),
      orderBy: (msg, { asc }) => [asc(msg.createdAt)],
    });
  }

  async getSessions(userId: string) {
    return this.database.query.consultation.findMany({
      where: eq(consultation.userId, userId),
      orderBy: (c, { desc }) => [desc(c.updatedAt)],
    });
  }
}

// Singleton instance
export const chatService = new ChatService();
```

#### C. UserService (Pewarisan)

**File: `src/lib/services/UserService.ts`**

```typescript
import { BaseService } from "./BaseService";
import { user } from "@/lib/db/schema";
import { eq, like, count } from "drizzle-orm";

/**
 * UserService - User Management
 * Menerapkan: INHERITANCE (extends BaseService)
 */
export class UserService extends BaseService {

  async getAllUsers(search?: string) {
    try {
      if (search) {
        return this.database.query.user.findMany({
          where: like(user.name, `%${search}%`),
        });
      }
      return this.database.query.user.findMany();
    } catch (error) {
      this.handleError(error, "mengambil data pengguna");
    }
  }

  async getUserById(id: string) {
    try {
      return this.database.query.user.findFirst({
        where: eq(user.id, id),
      });
    } catch (error) {
      this.handleError(error, "mengambil detail pengguna");
    }
  }

  async updateUserRole(id: string, role: "user" | "admin") {
    try {
      await this.database
        .update(user)
        .set({ role, updatedAt: new Date() })
        .where(eq(user.id, id));

      this.log("updateRole", { userId: id, newRole: role });
    } catch (error) {
      this.handleError(error, "mengubah role pengguna");
    }
  }

  async getTotalUsers() {
    try {
      const [result] = await this.database
        .select({ count: count() })
        .from(user);
      return result.count;
    } catch (error) {
      this.handleError(error, "menghitung total pengguna");
    }
  }
}

export const userService = new UserService();
```

#### D. ConsultationService (Pewarisan)

**File: `src/lib/services/ConsultationService.ts`**

```typescript
import { BaseService } from "./BaseService";
import { consultation, message } from "@/lib/db/schema";
import { count } from "drizzle-orm";

/**
 * ConsultationService - Consultation Statistics
 * Menerapkan: INHERITANCE (extends BaseService)
 */
export class ConsultationService extends BaseService {

  async getTotalConsultations() {
    try {
      const [result] = await this.database
        .select({ count: count() })
        .from(consultation);
      return result.count;
    } catch (error) {
      this.handleError(error, "menghitung total konsultasi");
    }
  }

  async getTotalMessages() {
    try {
      const [result] = await this.database
        .select({ count: count() })
        .from(message);
      return result.count;
    } catch (error) {
      this.handleError(error, "menghitung total pesan");
    }
  }
}

export const consultationService = new ConsultationService();
```

### 14.4 Ringkasan Penerapan OOP

| Pilar OOP | Dimana | Contoh |
|-----------|--------|--------|
| **Encapsulation** | `BaseService.database` (protected) | Database hanya diakses via method, tidak langsung |
| **Inheritance** | `ChatService extends BaseService` | Child class mewarisi `database`, `handleError()`, `log()` |
| **Polymorphism** | `handleCrisisResponse` vs `handleNormalResponse` | Method berbeda untuk konteks berbeda |
| **Abstraction** | `BaseService.handleError()` | Detail error handling tersembunyi |

### 14.5 Validasi Fase 12

- ✅ Semua service berjalan tanpa error.
- ✅ API endpoint menggunakan service class (bukan query langsung).
- ✅ Struktur class terdokumentasi dengan JSDoc comment.
- ✅ Setiap pilar OOP teridentifikasi jelas di kode.

---

## 15. Fase 13 – Pengujian (Black Box Testing)

### 15.1 Tujuan
Melakukan pengujian seluruh fungsionalitas menggunakan Black Box Testing.

### 15.2 Skenario Pengujian Lengkap

| No | Modul | Skenario | Input | Output yang Diharapkan | Status |
|----|-------|----------|-------|----------------------|--------|
| 1 | Auth | Login valid | Email + password benar | Redirect ke Dashboard | ⬜ |
| 2 | Auth | Login password salah | Password salah | Pesan error Indonesia | ⬜ |
| 3 | Auth | Login email tidak terdaftar | Email salah | Pesan error Indonesia | ⬜ |
| 4 | Auth | Register data valid | Nama + email + password | Akun dibuat, redirect ke Login | ⬜ |
| 5 | Auth | Register email duplikat | Email yang sudah ada | Pesan error | ⬜ |
| 6 | Chat | Kirim pesan normal | Teks tentang stres | Respons AI empatik < 3 detik | ⬜ |
| 7 | Chat | Deteksi kata kunci krisis | "ingin bunuh diri" | Hotline + saran profesional | ⬜ |
| 8 | Chat | Disclaimer tampil | Buka chat pertama kali | Modal disclaimer muncul | ⬜ |
| 9 | Riwayat | Lihat riwayat | Klik menu riwayat | Daftar sesi tampil | ⬜ |
| 10 | Profil | Edit profil | Ubah nama | Data tersimpan | ⬜ |
| 11 | Admin | Akses admin oleh user | User biasa buka /admin | Redirect ke Dashboard | ⬜ |
| 12 | Admin | Akses admin oleh admin | Admin login | Dashboard admin tampil | ⬜ |
| 13 | Auth | Logout | Klik tombol logout | Sesi dihapus, redirect ke Login | ⬜ |

### 15.3 Cara Melakukan Testing

1. **Manual Testing:** Buka setiap halaman, test setiap skenario.
2. **Screenshot:** Ambil screenshot setiap hasil pengujian.
3. **Dokumentasi:** Catat hasil di tabel di atas (✅ Valid / ❌ Invalid).
4. **Bug Report:** Jika ada yang gagal, catat bug dan perbaiki.

### 15.4 Target

- **Total Skenario:** 13
- **Target Keberhasilan:** 100% Valid

---

## 16. Fase 14 – Dockerisasi & Deployment

### 16.1 Tujuan
Membuat Docker configuration untuk deployment.

### 16.2 Dockerfile

**File: `Dockerfile`**

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

### 16.3 Docker Compose

**File: `docker-compose.yml`**

```yaml
version: "3.8"

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - BETTER_AUTH_URL=${BETTER_AUTH_URL}
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
    restart: unless-stopped
```

### 16.4 Next.js Config untuk Docker

**Update `next.config.ts`:**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Untuk Docker deployment
};

export default nextConfig;
```

### 16.5 Perintah Deployment

```bash
# Build Docker image
docker build -t mental-health-app .

# Jalankan container
docker compose up -d

# Cek status container
docker ps

# Cek logs
docker logs mental-health-app-web-1
```

### 16.6 Validasi Fase 14

- ✅ `docker build` berhasil tanpa error.
- ✅ `docker compose up` berhasil.
- ✅ Aplikasi bisa diakses di `http://localhost:3000`.
- ✅ Semua fitur berfungsi di dalam container.

---

## 17. Fase 15 – Dokumentasi & Finalisasi

### 17.1 Tujuan
Finalisasi dokumentasi, cleanup kode, dan persiapan untuk presentasi skripsi.

### 17.2 Checklist Dokumentasi

| Dokumentasi | Status |
|-------------|--------|
| Screenshot semua halaman (untuk BAB IV) | ⬜ |
| Screenshot hasil pengujian Black Box | ⬜ |
| Screenshot database (tabel di Supabase) | ⬜ |
| Kode OOP dengan komentar JSDoc | ⬜ |
| System prompt yang digunakan | ⬜ |
| Contoh percakapan representatif | ⬜ |
| README.md di repository | ⬜ |

### 17.3 Cleanup Kode

```bash
# Hapus console.log yang tidak perlu
# Pastikan semua import terpakai
# Format kode
npx prettier --write "src/**/*.{ts,tsx}"

# Lint check
npm run lint
```

### 17.4 Screenshot yang Dibutuhkan (untuk BAB IV)

| No | Screenshot | Untuk |
|----|-----------|-------|
| 1 | Halaman Login | BAB IV – 4.1.3a |
| 2 | Halaman Registrasi | BAB IV – 4.1.3b |
| 3 | Halaman Dashboard | BAB IV – 4.1.3c |
| 4 | Halaman Chat AI | BAB IV – 4.1.3d |
| 5 | Halaman Riwayat | BAB IV – 4.1.3e |
| 6 | Halaman Profil | BAB IV – 4.1.3f |
| 7 | Halaman Admin Dashboard | BAB IV – 4.1.3g |
| 8 | Halaman Kelola Pengguna | BAB IV – 4.1.3h |
| 9 | Struktur Tabel di Supabase | BAB IV – 4.1.2 |
| 10 | Contoh data di database | BAB IV – 4.1.2 |
| 11 | Hasil Black Box Testing | BAB IV – 4.2.1 |
| 12 | Contoh percakapan AI (normal) | BAB IV – 4.2.4 |
| 13 | Contoh percakapan AI (krisis) | BAB IV – 4.2.4 |
| 14 | Disclaimer modal | BAB IV – 4.1.5 |

---

## 18. Checklist Akhir

### 18.1 Checklist Per Fase

| # | Fase | Status |
|---|------|--------|
| 1 | Inisialisasi Proyek (Next.js + Shadcn) | ⬜ |
| 2 | Konfigurasi Database (Drizzle + Supabase) | ⬜ |
| 3 | Autentikasi (Better Auth) | ⬜ |
| 4 | Layout & Design System | ⬜ |
| 5 | Halaman Login & Register | ⬜ |
| 6 | Dashboard & Navigasi | ⬜ |
| 7 | **Chat AI (Core Feature)** | ⬜ |
| 8 | Riwayat Konsultasi | ⬜ |
| 9 | Profil Pengguna | ⬜ |
| 10 | Admin Dashboard & Kelola Pengguna | ⬜ |
| 11 | Mekanisme Keamanan AI | ⬜ |
| 12 | **Penerapan OOP (Refactor)** | ⬜ |
| 13 | Pengujian (Black Box Testing) | ⬜ |
| 14 | Dockerisasi & Deployment | ⬜ |
| 15 | Dokumentasi & Finalisasi | ⬜ |

### 18.2 Checklist Fitur

| Fitur | Fungsional | Teruji | Screenshots |
|-------|-----------|--------|-------------|
| Login | ⬜ | ⬜ | ⬜ |
| Register | ⬜ | ⬜ | ⬜ |
| Logout | ⬜ | ⬜ | ⬜ |
| Dashboard | ⬜ | ⬜ | ⬜ |
| Chat AI | ⬜ | ⬜ | ⬜ |
| Riwayat | ⬜ | ⬜ | ⬜ |
| Profil | ⬜ | ⬜ | ⬜ |
| Admin Dashboard | ⬜ | ⬜ | ⬜ |
| Kelola Pengguna | ⬜ | ⬜ | ⬜ |
| Crisis Detection | ⬜ | ⬜ | ⬜ |
| Disclaimer | ⬜ | ⬜ | ⬜ |
| OOP Classes | ⬜ | ⬜ | ⬜ |
| Docker | ⬜ | ⬜ | ⬜ |

### 18.3 Checklist Kesesuaian BAB Skripsi

| Elemen | PRD | BAB III | Implementasi | BAB IV |
|--------|-----|---------|-------------|--------|
| Tech Stack | ✅ | ✅ | ⬜ | ⬜ |
| Database/ERD | ✅ | ✅ | ⬜ | ⬜ |
| OOP (4 Pilar) | ✅ | ✅ | ⬜ | ⬜ |
| AI/OpenRouter | ✅ | ✅ | ⬜ | ⬜ |
| UI (8 halaman) | ✅ | ✅ | ⬜ | ⬜ |
| Black Box Test | ✅ | ✅ | ⬜ | ⬜ |
| Docker | ✅ | ✅ | ⬜ | ⬜ |

---

## 19. Referensi Teknis

### 19.1 Dokumentasi Resmi

| Teknologi | Link Dokumentasi |
|-----------|-----------------|
| Next.js 15 | [nextjs.org/docs](https://nextjs.org/docs) |
| Shadcn UI | [ui.shadcn.com](https://ui.shadcn.com) |
| Tailwind CSS | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| Drizzle ORM | [orm.drizzle.team](https://orm.drizzle.team) |
| Better Auth | [better-auth.com/docs](https://www.better-auth.com/docs) |
| Supabase | [supabase.com/docs](https://supabase.com/docs) |
| OpenRouter API | [openrouter.ai/docs](https://openrouter.ai/docs) |
| Docker | [docs.docker.com](https://docs.docker.com) |
| TypeScript | [typescriptlang.org/docs](https://www.typescriptlang.org/docs) |

### 19.2 Perintah yang Sering Digunakan

```bash
# Development
npm run dev                    # Jalankan dev server (localhost:3000)
npm run build                  # Build production
npm run start                  # Start production server

# Database
npx drizzle-kit generate       # Generate migration
npx drizzle-kit push           # Push schema ke database
npx drizzle-kit studio         # Buka Drizzle Studio (GUI)

# Shadcn UI
npx shadcn@latest add [nama]   # Tambah komponen baru

# Docker
docker build -t app .          # Build image
docker compose up -d           # Jalankan container
docker compose down            # Stop container
docker logs [container]        # Lihat logs
```

---

> **📌 Catatan Penting:**
>
> 1. Selalu commit perubahan setelah setiap fase selesai.
> 2. Test setiap fitur sebelum lanjut ke fase berikutnya.
> 3. Pesan error harus dalam **Bahasa Indonesia**.
> 4. Jangan lupa ambil **screenshot** untuk lampiran skripsi.
> 5. Pastikan semua code memiliki **JSDoc comment** untuk dokumentasi OOP.
>
> *Dokumen ini adalah panduan implementasi yang konsisten dengan PRD dan BAB I-V Skripsi.*
>
> *Terakhir diperbarui: 17 April 2026*
