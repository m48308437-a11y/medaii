"use client";
import { Shield, AlertTriangle, CheckCircle2, Eye } from "lucide-react";

const events = [
  { id: 1, type: "urgent_referral", severity: "critical", trigger: "درد قفسه سینه", user: "u_a3f2...", date: "۱۴۰۴/۱۰/۲۸ ۱۴:۳۲", reviewed: false },
  { id: 2, type: "risk_detected", severity: "high", trigger: "تب بالای ۳۹ نوزاد", user: "u_b9c1...", date: "۱۴۰۴/۱۰/۲۸ ۱۰:۱۵", reviewed: true },
  { id: 3, type: "risk_detected", severity: "high", trigger: "سرفه خونی", user: "u_d4e5...", date: "۱۴۰۴/۱۰/۲۷ ۲۲:۰۸", reviewed: false },
  { id: 4, type: "blocked_response", severity: "medium", trigger: "درخواست تشخیص قطعی", user: "u_f8a1...", date: "۱۴۰۴/۱۰/۲۷ ۱۸:۴۱", reviewed: true },
  { id: 5, type: "risk_detected", severity: "high", trigger: "بارداری + درد شکم", user: "u_12ab...", date: "۱۴۰۴/۱۰/۲۷ ۱۱:۲۲", reviewed: true },
];

const sevStyle: Record<string, string> = {
  critical: "text-danger bg-danger/10 border-danger/30",
  high: "text-warning bg-warning/10 border-warning/30",
  medium: "text-secondary bg-secondary/10 border-secondary/30",
  low: "text-success bg-success/10 border-success/30",
};

export default function AdminSafetyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">رویدادهای ایمنی</h1>
        <p className="text-text-secondary text-sm">بررسی و مدیریت سیگنال‌های تشخیص داده شده توسط Safety Layer.</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: "کل (۲۴ ساعته)", value: 27, icon: Shield, color: "text-primary" },
          { label: "بحرانی", value: 3, icon: AlertTriangle, color: "text-danger" },
          { label: "بالا", value: 12, icon: AlertTriangle, color: "text-warning" },
          { label: "بررسی شده", value: 18, icon: CheckCircle2, color: "text-success" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-text-secondary">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted uppercase border-b border-border">
              <th className="text-right p-4">نوع</th>
              <th className="text-right p-4">سطح</th>
              <th className="text-right p-4 hidden sm:table-cell">علت</th>
              <th className="text-right p-4 hidden md:table-cell">کاربر</th>
              <th className="text-right p-4 hidden lg:table-cell">زمان</th>
              <th className="text-right p-4">وضعیت</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-b border-border last:border-b-0 hover:bg-white/[0.02]">
                <td className="p-4 text-white font-medium text-xs">{e.type}</td>
                <td className="p-4">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${sevStyle[e.severity]}`}>
                    {e.severity.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-text-secondary text-xs hidden sm:table-cell">{e.trigger}</td>
                <td className="p-4 text-muted text-xs hidden md:table-cell font-mono">{e.user}</td>
                <td className="p-4 text-muted text-xs hidden lg:table-cell">{e.date}</td>
                <td className="p-4">
                  {e.reviewed ? (
                    <span className="text-success text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> بررسی شده</span>
                  ) : (
                    <span className="text-warning text-xs">در انتظار</span>
                  )}
                </td>
                <td className="p-4">
                  <button className="w-8 h-8 rounded-lg text-muted hover:text-primary hover:bg-primary/10">
                    <Eye className="w-4 h-4 mx-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
