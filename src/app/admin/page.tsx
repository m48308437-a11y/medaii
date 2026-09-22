"use client";

import { motion } from "framer-motion";
import {
  Users, MessageSquare, Activity, AlertTriangle, Database, Shield,
  TrendingUp, Clock, Server, CheckCircle2, ArrowUpRight
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "کل کاربران", value: "2,847", delta: "+12.4%", icon: Users, color: "text-primary", up: true },
  { label: "کاربران فعال (۷ روز)", value: "892", delta: "+8.1%", icon: Users, color: "text-secondary", up: true },
  { label: "کل گفت‌وگوها", value: "14,203", delta: "+23.7%", icon: MessageSquare, color: "text-primary-bright", up: true },
  { label: "درخواست‌های AI", value: "89,421", delta: "+18.2%", icon: Activity, color: "text-success", up: true },
  { label: "رویدادهای ایمنی", value: "127", delta: "-5.3%", icon: AlertTriangle, color: "text-warning", up: false },
  { label: "هشدارهای بحرانی", value: "3", delta: "-", icon: Shield, color: "text-danger", up: false },
];

const systemStats = [
  { label: "API Latency (p95)", value: "243 ms", icon: Clock, status: "ok" },
  { label: "AI Provider", value: "Online", icon: Server, status: "ok" },
  { label: "Database", value: "Healthy", icon: Database, status: "ok" },
  { label: "Vector Index", value: "Synced", icon: CheckCircle2, status: "ok" },
];

const recentSafetyEvents = [
  { type: "urgent_referral", severity: "critical", user: "u_a3f2...", time: "۲ دقیقه پیش", input: "درد قفسه سینه و تنگی نفس" },
  { type: "risk_detected", severity: "high", user: "u_b9c1...", time: "۱۵ دقیقه پیش", input: "تب بالای ۳۹ در نوزاد" },
  { type: "risk_detected", severity: "high", user: "u_d4e5...", time: "۴۲ دقیقه پیش", input: "سرفه خونی" },
  { type: "risk_detected", severity: "high", user: "u_f8a1...", time: "۱ ساعت پیش", input: "باردار با درد شکم" },
];

const severityColors: Record<string, string> = {
  critical: "text-danger bg-danger/10 border-danger/30",
  high: "text-warning bg-warning/10 border-warning/30",
  medium: "text-secondary bg-secondary/10 border-secondary/30",
  low: "text-success bg-success/10 border-success/30",
};

export default function AdminDashboardPage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "صبح بخیر" : hour < 17 ? "عصر بخیر" : "شب بخیر";

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl glass p-6 glow-primary">
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-primary/10 rounded-full blur-3xl" />
        <p className="text-primary text-xs font-semibold tracking-widest uppercase mb-2">MedAI Command Center</p>
        <h1 className="text-2xl font-bold text-white mb-1">{greeting}، مدیر 👋</h1>
        <p className="text-text-secondary text-sm">این خلاصه‌ای از آنچه در حال حاضر در سراسر مد‌ای‌آی می‌گذرد است.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {s.up !== undefined && (
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${s.up ? "text-success" : "text-danger"}`}>
                    <TrendingUp className={`w-3 h-3 ${!s.up ? "rotate-180" : ""}`} />
                    {s.delta}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-white mb-0.5">{s.value}</div>
              <div className="text-xs text-text-secondary">{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* System health */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            وضعیت سیستم
          </h2>
          <div className="space-y-3">
            {systemStats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary border border-border">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-success" />
                    <span className="text-sm text-white">{s.label}</span>
                  </div>
                  <span className="text-xs text-success font-medium">{s.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety events */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              رویدادهای اخیر ایمنی
            </h2>
            <Link href="/admin/safety" className="text-xs text-primary flex items-center gap-1 hover:underline">
              مشاهده همه <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentSafetyEvents.map((e, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-bg-secondary border border-border">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase ${severityColors[e.severity]}`}>
                  {e.severity === "critical" ? "CRIT" : e.severity === "high" ? "HIGH" : e.severity}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{e.input}</p>
                  <p className="text-[11px] text-muted">کاربر: {e.user} • {e.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI usage chart placeholder */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          درخواست‌های AI (۷ روز گذشته)
        </h2>
        <div className="h-40 flex items-end gap-2">
          {[60, 85, 72, 90, 78, 95, 88].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="w-full rounded-t-lg bg-gradient-to-t from-primary/40 to-primary/80"
              />
              <span className="text-[10px] text-muted">
                {["ش", "ی", "د", "س", "چ", "پ", "ج"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
