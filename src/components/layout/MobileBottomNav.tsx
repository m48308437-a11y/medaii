"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Activity, BookHeart, User } from "lucide-react";

const items = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/ai", label: "AI", icon: MessageSquare },
  { href: "/symptom-checker", label: "علائم", icon: Activity },
  { href: "/health-journal", label: "سلامت", icon: BookHeart },
  { href: "/profile", label: "پروفایل", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 glass-strong border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl min-w-[56px] transition ${
                active ? "text-primary" : "text-muted"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "scale-110" : ""} transition-transform`} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
