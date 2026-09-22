import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { consultations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { History as HistoryIcon, MessageSquare, Clock, ChevronLeft, Trash2, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  let user = null;
  try {
    user = await getCurrentUser();
  } catch {}
  if (!user) redirect("/login");

  const consults = await db
    .select()
    .from(consultations)
    .where(eq(consultations.userId, user.id))
    .orderBy(desc(consultations.updatedAt));

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
    <div className="min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
            <HistoryIcon className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">تاریخچه گفت‌وگوها</h1>
        </div>
        <p className="text-text-secondary text-sm mb-8">همه گفت‌وگوهای قبلی شما در یک نگاه.</p>

        {consults.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">هنوز گفت‌وگویی نداشته‌اید</h2>
            <p className="text-text-secondary text-sm mb-6">با شروع اولین گفت‌وگو، تاریخچه شما اینجا نمایش داده می‌شود.</p>
            <Link href="/ai" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-black font-semibold text-sm">
              شروع گفت‌وگوی جدید
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {consults.map((c) => (
              <div key={c.id} className="glass rounded-2xl p-5 card-hover group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm">{c.title || "گفت‌وگو"}</h3>
                      {c.riskLevel && c.riskLevel !== "low" && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 ${riskColors[c.riskLevel]}`}>
                          {c.riskLevel === "high" || c.riskLevel === "critical" ? <AlertTriangle className="w-2.5 h-2.5 inline mr-0.5" /> : null}
                          {riskLabels[c.riskLevel]}
                        </span>
                      )}
                    </div>
                    {c.summary && <p className="text-xs text-text-secondary line-clamp-2 mb-2">{c.summary}</p>}
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(c.updatedAt || c.createdAt).toLocaleDateString("fa-IR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <form>
                          <button type="button" className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition" aria-label="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                  <Link href={`/ai`} className="self-center">
                    <ChevronLeft className="w-5 h-5 text-muted hover:text-primary transition" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
