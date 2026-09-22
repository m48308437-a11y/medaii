import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { consultations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  MessageSquare, FileText, Pill, FlaskConical, StickyNote, ChevronRight,
  Activity, Calendar, AlertTriangle, CheckCircle2, Clock, ArrowRight,
  BookHeart, Bell, Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let user = null;
  try {
    user = await getCurrentUser();
  } catch {}
  if (!user) redirect("/login");

  const recentConsults = await db
    .select({
      id: consultations.id,
      title: consultations.title,
      summary: consultations.summary,
      riskLevel: consultations.riskLevel,
      createdAt: consultations.createdAt,
      updatedAt: consultations.updatedAt,
    })
    .from(consultations)
    .where(eq(consultations.userId, user.id))
    .orderBy(desc(consultations.updatedAt))
    .limit(5);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "صبح بخیر" : hour < 17 ? "بعد از ظهر بخیر" : "عصر بخیر";

  const stats = [
    { label: "گفت‌وگوها", value: recentConsults.length, icon: MessageSquare, color: "text-primary", href: "/history" },
    { label: "آزمایش‌ها", value: 0, icon: FlaskConical, color: "text-secondary", href: "/lab-analyzer" },
    { label: "داروها", value: 0, icon: Pill, color: "text-warning", href: "/medications" },
    { label: "یادداشت‌ها", value: 0, icon: StickyNote, color: "text-success", href: "/health-journal" },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {greeting} <span className="gradient-text">{user.name || user.email}</span> 👋
          </h1>
          <p className="text-text-secondary">امروز چطور احساس می‌کنید؟</p>
        </div>

        {/* Main CTA card */}
        <Link href="/ai" className="block group">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/10 border border-primary/30 p-6 sm:p-8 glow-primary card-hover">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span className="text-primary font-semibold text-sm">دستیار هوشمند</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">گفت‌وگوی جدید شروع کنید</h2>
                <p className="text-text-secondary text-sm">علائم، سؤالات یا نتایج آزمایش خود را بپرسید.</p>
              </div>
              <Button className="gap-2">
                شروع گفت‌وگو
                <ArrowRight className="w-4 h-4 rotate-180" />
              </Button>
            </div>
          </div>
        </Link>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.label}
                href={s.href}
                className="p-5 rounded-2xl glass card-hover"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${s.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted rotate-180" />
                </div>
                <div className="text-2xl font-bold text-white mb-0.5">{s.value}</div>
                <div className="text-sm text-text-secondary">{s.label}</div>
              </Link>
            );
          })}
        </div>

        {/* Recent Consultations */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">گفت‌وگوهای اخیر</h2>
            <Link href="/history" className="text-sm text-primary hover:underline flex items-center gap-1">
              مشاهده همه
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>

          {recentConsults.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="text-text-secondary mb-4">هنوز گفت‌وگویی نداشته‌اید</p>
              <Link href="/ai">
                <Button size="sm">شروع اولین گفت‌وگو</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentConsults.map((c) => {
                const riskColors: Record<string, string> = {
                  low: "text-success bg-success/10 border-success/20",
                  medium: "text-warning bg-warning/10 border-warning/20",
                  high: "text-danger bg-danger/10 border-danger/20",
                  critical: "text-danger bg-danger/20 border-danger/40",
                };
                const riskLabels: Record<string, string> = {
                  low: "کم",
                  medium: "متوسط",
                  high: "بالا",
                  critical: "فوری",
                };
                return (
                  <Link
                    key={c.id}
                    href={`/ai`}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white text-sm truncate">
                          {c.title || "گفت‌وگو"}
                        </h3>
                        {c.riskLevel && c.riskLevel !== "low" && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${riskColors[c.riskLevel]}`}>
                            {riskLabels[c.riskLevel]}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-2">
                        {c.summary || "بدون خلاصه"}
                      </p>
                      <p className="text-[11px] text-muted mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(c.updatedAt || c.createdAt).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition flex-shrink-0 mt-1 rotate-180" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: FileText, title: "بررسی علائم", desc: "جادوگر چندمرحله‌ای بررسی علائم", href: "/symptom-checker", color: "from-primary/20 to-primary/5" },
            { icon: FlaskConical, title: "تحلیل آزمایش", desc: "نتایج آزمایش را ساده بفهمید", href: "/lab-analyzer", color: "from-secondary/20 to-secondary/5" },
            { icon: Pill, title: "اطلاعات دارو", desc: "داروها، عوارض و هشدارها", href: "/medications", color: "from-warning/20 to-warning/5" },
            { icon: BookHeart, title: "دفترچه سلامت", desc: "ثبت یادداشت‌های روزانه", href: "/health-journal", color: "from-success/20 to-success/5" },
            { icon: Stethoscope, title: "آماده‌سازی ویزیت", desc: "خلاصه سلامت برای پزشک بسازید", href: "/doctor-preparation", color: "from-secondary/20 to-secondary/5" },
            { icon: Bell, title: "یادآوری‌ها", desc: "قرار، دارو و پیگیری آزمایش", href: "/reminders", color: "from-primary/20 to-primary/5" },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.title} href={a.href} className={`group relative p-5 rounded-2xl border border-border bg-gradient-to-br ${a.color} card-hover`}>
                <div className={`w-10 h-10 rounded-xl glass flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1">{a.title}</h3>
                <p className="text-sm text-text-secondary mb-3">{a.desc}</p>
                <span className="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                  شروع <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
