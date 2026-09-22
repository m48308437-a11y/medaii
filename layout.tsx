"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, MessageSquare, Activity as ActivityIcon,
  Shield, Database, FileText, Settings, ScrollText, Lock, ChevronRight,
  TrendingUp, Bell
} from "lucide-react";
import type { ReactNode } from "react";

const adminNav = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { href: "/admin/analytics", label: "تحلیل‌ها", icon: TrendingUp },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/consultations", label: "گفت‌وگوها", icon: MessageSquare },
  { href: "/admin/ai", label: "نظارت AI", icon: ActivityIcon },
  { href: "/admin/safety", label: "ایمنی", icon: Shield },
  { href: "/admin/medical-sources", label: "منابع پزشکی", icon: Database },
  { href: "/admin/content", label: "محتوا", icon: FileText },
  { href: "/admin/notifications", label: "اعلان‌ها", icon: Bell },
  { href: "/admin/system", label: "سیستم", icon: Settings },
  { href: "/admin/audit-logs", label: "لاگ‌های حسابرسی", icon: ScrollText },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col lg:flex-row bg-bg-secondary/30">
      {/* Sidebar */}
      <aside className="lg:w-64 border-b lg:border-b-0 lg:border-l border-border bg-bg">
        <div className="p-5 border-b border-border hidden lg:block">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Lock className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">پنل مدیریت</h2>
              <p className="text-xs text-muted">MedAI Admin</p>
            </div>
          </div>
        </div>
        <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm whitespace-nowrap transition ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-text-secondary hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}
