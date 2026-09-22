"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User as UserIcon, Mail, Calendar, Globe, Bell, Lock, Shield,
  Activity, Heart, Edit3, Check, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("کاربر مد‌ای‌آی");
  const [age, setAge] = useState("");
  const [language, setLanguage] = useState("fa");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  }

  const tabs = [
    { id: "personal", label: "اطلاعات شخصی", icon: UserIcon },
    { id: "health", label: "اطلاعات سلامت", icon: Heart },
    { id: "notif", label: "اعلان‌ها", icon: Bell },
    { id: "privacy", label: "حریم خصوصی", icon: Lock },
    { id: "security", label: "امنیت", icon: Shield },
  ];

  const [active, setActive] = useState("personal");

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">پروفایل</h1>
          <p className="text-text-secondary text-sm">مدیریت حساب و تنظیمات شخصی.</p>
        </div>

        <div className="grid md:grid-cols-[240px_1fr] gap-6">
          <aside className="glass rounded-2xl p-3 h-fit">
            <div className="p-4 border-b border-border mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-black font-bold text-lg">
                  {name[0]?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{name}</p>
                  <p className="text-xs text-muted">حساب کاربری</p>
                </div>
              </div>
            </div>
            <nav className="space-y-1">
              {tabs.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActive(t.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                      active === t.id
                        ? "bg-primary/10 text-primary"
                        : "text-text-secondary hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </button>
                );
              })}
            </nav>
            <div className="mt-4 pt-4 border-t border-border">
              <Link href="/api/auth/logout" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-danger hover:bg-danger/10 transition">
                خروج از حساب
              </Link>
            </div>
          </aside>

          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 sm:p-8"
          >
            {active === "personal" && (
              <form onSubmit={handleSave} className="space-y-5">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-primary" />
                  اطلاعات شخصی
                </h2>

                <div>
                  <label className="block text-sm text-text-secondary mb-2">نام کامل</label>
                  <div className="relative">
                    <Edit3 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-primary/50 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-2">ایمیل</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    <input
                      type="email"
                      value="user@example.com"
                      disabled
                      className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 pr-10 text-muted cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">سن</label>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="سن شما"
                        className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-primary/50 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary mb-2">زبان</label>
                    <div className="relative">
                      <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-primary/50 transition appearance-none"
                      >
                        <option value="fa">فارسی</option>
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button type="submit" loading={loading} disabled={loading} className="gap-2">
                  {saved ? (
                    <>
                      <Check className="w-4 h-4" />
                      ذخیره شد
                    </>
                  ) : loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "ذخیره تغییرات"
                  )}
                </Button>
              </form>
            )}

            {active === "health" && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-danger" />
                  اطلاعات سلامت
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  شما می‌توانید اطلاعات کلی سلامت خود را وارد کنید تا پاسخ‌های دقیق‌تری دریافت کنید.
                  این اطلاعات رمزگذاری شده و فقط شما به آن دسترسی دارید.
                </p>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">سوابق پزشکی مهم</label>
                  <textarea
                    rows={4}
                    placeholder="مثلاً: دیابت نوع ۲، فشار خون بالا، سابقه جراحی قلب..."
                    className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">داروهای مصرفی منظم</label>
                  <textarea
                    rows={3}
                    placeholder="نام دارو، دوز و دفعات مصرف..."
                    className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition resize-none"
                  />
                </div>
                <Button>ذخیره اطلاعات سلامت</Button>
              </div>
            )}

            {active === "notif" && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-secondary" />
                  تنظیمات اعلان‌ها
                </h2>
                {[
                  { label: "یادآوری پیگیری گفت‌وگوها", desc: "اگر به پزشک ارجاع داده شده‌اید یادآوری دریافت کنید." },
                  { label: "به‌روزرسانی ویژگی‌ها", desc: "از قابلیت‌های جدید مد‌ای‌آی مطلع شوید." },
                  { label: "نکات سلامتی هفتگی", desc: "نکات کلی سلامت را هر هفته دریافت کنید." },
                ].map((n, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                    <div>
                      <p className="font-medium text-white text-sm">{n.label}</p>
                      <p className="text-xs text-text-secondary">{n.desc}</p>
                    </div>
                    <Toggle defaultOn={i === 0} />
                  </div>
                ))}
              </div>
            )}

            {active === "privacy" && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-warning" />
                  حریم خصوصی
                </h2>
                {[
                  { label: "ذخیره تاریخچه گفت‌وگوها", desc: "گفت‌وگوهای شما در حساب شما ذخیره شوند." },
                  { label: "اشتراک‌گذاری ناشناس برای بهبود", desc: "استفاده از داده‌های ناشناس برای بهبود کیفیت AI." },
                ].map((n, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                    <div>
                      <p className="font-medium text-white text-sm">{n.label}</p>
                      <p className="text-xs text-text-secondary">{n.desc}</p>
                    </div>
                    <Toggle defaultOn={true} />
                  </div>
                ))}
                <div className="p-4 rounded-xl bg-danger/5 border border-danger/20">
                  <p className="font-medium text-danger text-sm mb-1">منطقه خطر</p>
                  <p className="text-xs text-text-secondary mb-3">با حذف حساب، تمام داده‌های شما برای همیشه پاک می‌شود.</p>
                  <Button variant="danger" size="sm">حذف حساب کاربری</Button>
                </div>
              </div>
            )}

            {active === "security" && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-success" />
                  امنیت
                </h2>
                <div className="space-y-3">
                  <Button variant="outline" fullWidth className="justify-start">تغییر رمز عبور</Button>
                  <Button variant="outline" fullWidth className="justify-start">مدیریت دستگاه‌های متصل</Button>
                  <Button variant="outline" fullWidth className="justify-start">فعال‌سازی احراز هویت دو مرحله‌ای</Button>
                  <Button variant="outline" fullWidth className="justify-start">دانلود داده‌های من</Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      onClick={() => setOn(!on)}
      className={`w-11 h-6 rounded-full transition-colors relative ${on ? "bg-primary" : "bg-border"}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${on ? "left-0.5" : "left-[calc(100%-1.375rem)]"}`}
        style={{
          transform: on ? "translateX(0)" : "translateX(-0)",
          right: on ? "auto" : "2px",
          left: on ? "2px" : "auto",
        }}
      />
    </button>
  );
}
