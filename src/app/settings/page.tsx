import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Settings as SettingsIcon, Bell, Globe, Shield, Lock, Palette } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  let user = null;
  try { user = await getCurrentUser(); } catch {}
  if (!user) redirect("/login");

  const sections = [
    { icon: Globe, title: "زبان و منطقه", desc: "تغییر زبان رابط و منطقه زمانی", href: "/profile" },
    { icon: Bell, title: "اعلان‌ها", desc: "مدیریت اعلان‌های ایمیلی و داخل اپ", href: "/profile" },
    { icon: Palette, title: "ظاهر", desc: "حالت تاریک و روشن، فونت", href: "/profile" },
    { icon: Shield, title: "حریم خصوصی", desc: "کنترل دسترسی‌ها و داده‌ها", href: "/profile" },
    { icon: Lock, title: "امنیت", desc: "رمز عبور، ورود دو مرحله‌ای، دستگاه‌ها", href: "/profile" },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">تنظیمات</h1>
        </div>
        <p className="text-text-secondary text-sm mb-8">تنظیمات حساب، ظاهر، و حریم خصوصی.</p>

        <div className="space-y-3">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.title} href={s.href} className="flex items-center gap-4 p-5 glass rounded-2xl card-hover">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm mb-0.5">{s.title}</h3>
                  <p className="text-xs text-text-secondary">{s.desc}</p>
                </div>
                <span className="text-muted text-sm">←</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
