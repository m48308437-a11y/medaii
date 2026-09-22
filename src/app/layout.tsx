import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { getCurrentUser } from "@/lib/auth";
import { getLocaleFromHeaders, type Locale } from "@/lib/i18n";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: {
    default: "MedAI — Intelligent Health Assistant",
    template: "%s | MedAI",
  },
  description:
    "MedAI is your intelligent health assistant. Understand symptoms, analyze lab results, learn about medications — powered by AI, designed for safety.",
  keywords: [
    "health AI",
    "medical assistant",
    "symptom checker",
    "lab analyzer",
    "MedAI",
    "health tech",
    "دستیار سلامت",
    "هوش مصنوعی پزشکی",
  ],
  authors: [{ name: "MedAI" }],
  openGraph: {
    title: "MedAI — Intelligent Health Assistant",
    description: "Understand your health with AI — safely, privately, intelligently.",
    type: "website",
    locale: "fa_IR",
    siteName: "MedAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "MedAI — Intelligent Health Assistant",
    description: "Your AI-powered health companion for symptom understanding & lab analysis.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05070A",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const acceptLang = h.get("accept-language") || undefined;
  const locale: Locale = "fa"; // default Persian; language toggle UI can be added
  const dir = locale === "fa" ? "rtl" : "ltr";

  let user = null;
  try {
    user = await getCurrentUser();
  } catch {
    user = null;
  }

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="bg-bg text-text antialiased min-h-screen flex flex-col">
        <AppShell locale={locale} user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
