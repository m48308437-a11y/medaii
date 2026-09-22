"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search, MessageSquare, Activity, FlaskConical, Pill, BookHeart,
  Stethoscope, LayoutDashboard, User, Settings, Shield, Command, CornerDownLeft,
} from "lucide-react";

interface SearchItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: any;
  group: string;
}

const items: SearchItem[] = [
  { id: "ai", label: "گفت‌وگو با AI", description: "شروع مشاوره هوشمند سلامت", href: "/ai", icon: MessageSquare, group: "ویژگی‌ها" },
  { id: "symptom", label: "بررسی علائم", description: "جادوگر بررسی ساختاریافته علائم", href: "/symptom-checker", icon: Activity, group: "ویژگی‌ها" },
  { id: "lab", label: "تحلیل‌گر آزمایش", description: "فهم نتایج آزمایش", href: "/lab-analyzer", icon: FlaskConical, group: "ویژگی‌ها" },
  { id: "meds", label: "اطلاعات داروها", description: "جستجوی داروها و عوارض", href: "/medications", icon: Pill, group: "ویژگی‌ها" },
  { id: "journal", label: "دفترچه سلامت", description: "ثبت یادداشت‌ها و علائم روزانه", href: "/health-journal", icon: BookHeart, group: "ویژگی‌ها" },
  { id: "prep", label: "آماده‌سازی برای پزشک", description: "ساخت خلاصه سلامت برای ویزیت", href: "/doctor-preparation", icon: Stethoscope, group: "ویژگی‌ها" },
  { id: "dashboard", label: "داشبورد", description: "نمای کلی سلامت شما", href: "/dashboard", icon: LayoutDashboard, group: "حساب کاربری" },
  { id: "profile", label: "پروفایل", description: "مدیریت اطلاعات شخصی", href: "/profile", icon: User, group: "حساب کاربری" },
  { id: "settings", label: "تنظیمات", description: "زبان، اعلان‌ها و حریم خصوصی", href: "/settings", icon: Settings, group: "حساب کاربری" },
  { id: "admin", label: "پنل مدیریت", description: "کنترل کامل سیستم", href: "/admin", icon: Shield, group: "مدیریت" },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((i) => i.label.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
  }, [query]);

  const grouped = useMemo(() => {
    const g: Record<string, SearchItem[]> = {};
    filtered.forEach((i) => {
      g[i.group] = g[i.group] || [];
      g[i.group].push(i);
    });
    return g;
  }, [filtered]);

  const toggle = useCallback(() => {
    setOpen((o) => !o);
    setQuery("");
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function handleSelect(item: SearchItem) {
    router.push(item.href as any);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) handleSelect(filtered[activeIndex]);
    }
  }

  return (
    <>
      <button
        onClick={toggle}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-muted hover:text-white hover:border-primary/30 transition text-xs"
        aria-label="Global search"
      >
        <Search className="w-3.5 h-3.5" />
        <span>جستجو</span>
        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 border border-border text-[10px]">
          <Command className="w-2.5 h-2.5" />K
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl glass-strong rounded-2xl overflow-hidden glow-primary"
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
                <Search className="w-4.5 h-4.5 text-muted flex-shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder="جستجو در گفت‌وگوها، علائم، داروها..."
                  className="flex-1 bg-transparent text-white placeholder:text-muted outline-none text-sm"
                />
                <kbd className="text-[10px] text-muted px-1.5 py-0.5 rounded bg-white/5 border border-border">ESC</kbd>
              </div>

              <div className="max-h-96 overflow-y-auto p-2">
                {Object.keys(grouped).length === 0 && (
                  <p className="text-center text-sm text-muted py-8">نتیجه‌ای یافت نشد.</p>
                )}
                {Object.entries(grouped).map(([group, groupItems]) => (
                  <div key={group} className="mb-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted px-3 py-1.5">{group}</p>
                    {groupItems.map((item) => {
                      const idx = filtered.indexOf(item);
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setActiveIndex(idx)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-start transition ${
                            idx === activeIndex ? "bg-primary/10 text-white" : "text-text-secondary hover:bg-white/5"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.label}</p>
                            <p className="text-xs text-muted truncate">{item.description}</p>
                          </div>
                          {idx === activeIndex && <CornerDownLeft className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
