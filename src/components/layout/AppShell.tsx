"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import type { Locale } from "@/lib/i18n";

interface AppShellProps {
  children: ReactNode;
  locale: Locale;
  user: { name: string | null; email: string; roleName?: string } | null;
}

export function AppShell({ children, locale, user }: AppShellProps) {
  const pathname = usePathname();
  const isFullBleed = pathname?.startsWith("/ai") || pathname?.startsWith("/admin");
  const hideBottomNav = pathname?.startsWith("/ai") || pathname?.startsWith("/admin");
  const hideFooter = pathname?.startsWith("/ai") || pathname?.startsWith("/admin");

  return (
    <>
      <Navbar locale={locale} user={user} />
      <main className={`flex-1 ${hideBottomNav ? "" : "pb-16 sm:pb-0"}`}>{children}</main>
      {!hideFooter && <Footer locale={locale} />}
      {!hideBottomNav && <MobileBottomNav />}
    </>
  );
}
