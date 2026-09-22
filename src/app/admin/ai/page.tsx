"use client";
import { Activity, Clock, DollarSign, Zap, TrendingUp, Server, AlertCircle } from "lucide-react";

const stats = [
  { label: "درخواست‌های امروز", value: "2,847", icon: Activity, color: "text-primary" },
  { label: "میانگین تأخیر", value: "284 ms", icon: Clock, color: "text-secondary" },
  { label: "مصرف توکن", value: "1.2M", icon: Zap, color: "text-warning" },
  { label: "تخمین هزینه ماهانه", value: "$412", icon: DollarSign, color: "text-success" },
];

const providers = [
  { name: "Primary LLM", status: "operational", latency: "241 ms", requests: 890 },
  { name: "Embedding Model", status: "operational", latency: "42 ms", requests: 342 },
  { name: "Safety Classifier", status: "operational", latency: "12 ms", requests: 2847 },
  { name: "Fallback Model", status: "standby", latency: "—", requests: 0 },
];

export default function AdminAIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">نظارت AI</h1>
        <p className="text-text-secondary text-sm">مشاهده عملکرد مدل‌ها، خطاها و مصرف.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-white mb-0.5">{s.value}</div>
              <div className="text-xs text-text-secondary">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-primary" />
          وضعیت ارائه‌دهندگان
        </h2>
        <div className="space-y-2">
          {providers.map((p) => (
            <div key={p.name} className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary border border-border">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${p.status === "operational" ? "bg-success animate-pulse" : "bg-muted"}`} />
                <span className="text-sm font-medium text-white">{p.name}</span>
              </div>
              <div className="flex items-center gap-6 text-xs text-text-secondary">
                <span>تأخیر: {p.latency}</span>
                <span>درخواست: {p.requests}</span>
                <span className={`${p.status === "operational" ? "text-success" : "text-muted"}`}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-warning" />
          خطاهای اخیر
        </h2>
        <p className="text-sm text-text-secondary">هیچ خطای بحرانی در ۲۴ ساعت گذشته ثبت نشده است.</p>
      </div>
    </div>
  );
}
