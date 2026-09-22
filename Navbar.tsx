"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Activity, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { localeConfig } from "@/lib/i18n";
import { GlobalSearch } from "@/components/layout/GlobalSearch";

interface NavItem {
  href: string;
  labelFa: string;
  labelEn: string;
  protected?: boolean;
  adminOnly?: boolean;
}

const publicNav: NavItem[] = [
  { href: "/ai", labelFa: "دستیار AI", labelEn: "AI Assistant" },
  { href: "/symptom-checker", labelFa: "علائم", labelEn: "Symptoms" },
  { href: "/lab-analyzer", labelFa: "آزمایش", labelEn: "Lab Analyzer" },
  { href: "/medications", labelFa: "داروها", labelEn: "Medications" },
  { href: "/health-journal", labelFa: "سلامت", labelEn: "Health" },
  { href: "/about", labelFa: "درباره", labelEn: "About" },
];

const protectedNav: NavItem[] = [
  { href: "/dashboard", labelFa: "داشبورد", labelEn: "Dashboard", protected: true },
  { href: "/history", labelFa: "تاریخچه", labelEn: "History", protected: true },
];

export function Navbar({
  locale,
  user,
}: {
  locale: Locale;
  user?: { name: string | null; email: string; roleName?: string } | null;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isFa = locale === "fa";
  const t = (nav: NavItem) => (isFa ? nav.labelFa : nav.labelEn);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-strong py-2" : "py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Activity className="w-5 h-5 text-black" strokeWidth={2.5} />
                <div className="absolute inset-0 rounded-xl gradient-primary blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                Med<span className="gradient-text">AI</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {publicNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    pathname === item.href
                      ? "text-white bg-white/5"
                      : "text-text-secondary hover:text-white hover:bg-white/5"
                  }`}
                >
                  {t(item)}
                </Link>
              ))}
              {user && (
                <>
                  {protectedNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        pathname?.startsWith(item.href)
                          ? "text-white bg-white/5"
                          : "text-text-secondary hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {t(item)}
                    </Link>
                  ))}
                  {user.roleName && ["super_admin", "admin", "medical_content_manager", "support", "analyst"].includes(user.roleName) && (
                    <Link
                      href="/admin"
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        isAdminRoute ? "text-primary bg-primary/10" : "text-text-secondary hover:text-primary"
                      }`}
                    >
                      {isFa ? "مدیریت" : "Admin"}
                    </Link>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <GlobalSearch />
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-text-secondary border border-border">
                <span>{localeConfig[locale].flag}</span>
                <span className="uppercase">{locale}</span>
              </div>

              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/profile">
                    <div className="w-9 h-9 rounded-full gradient-primary/20 border border-primary/30 flex items-center justify-center text-primary font-semibold text-sm cursor-pointer hover:border-primary/60 transition">
                      {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </div>
                  </Link>
                </div>
              ) : (
                <Link href="/login" className="hidden sm:block">
                  <Button size="sm" variant="primary">
                    <LogIn className="w-4 h-4" />
                    {isFa ? "ورود" : "Login"}
                  </Button>
                </Link>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 transition"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[64px] z-40 lg:hidden glass-strong border-t border-border"
          >
            <div className="px-4 py-4 space-y-1">
              {publicNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-sm ${
                    pathname === item.href ? "text-white bg-primary/10" : "text-text-secondary hover:text-white hover:bg-white/5"
                  }`}
                >
                  {t(item)}
                </Link>
              ))}
              {user && protectedNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5"
                >
                  {t(item)}
                </Link>
              ))}
              <div className="pt-2 border-t border-border">
                {user ? (
                  <>
                    <Link href="/profile" className="block px-4 py-3 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5">
                      {isFa ? "پروفایل" : "Profile"}
                    </Link>
                    <Link href="/api/auth/logout" className="block px-4 py-3 rounded-lg text-sm text-danger hover:bg-danger/10">
                      {isFa ? "خروج" : "Logout"}
                    </Link>
                  </>
                ) : (
                  <Link href="/login" className="block px-4 py-3 rounded-lg text-sm gradient-primary text-black font-semibold text-center mt-2">
                    {isFa ? "ورود / ثبت‌نام" : "Login / Sign Up"}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
