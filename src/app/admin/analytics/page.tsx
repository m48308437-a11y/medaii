"use client";

import { useState } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, Users, Activity, AlertTriangle, Clock, Calendar } from "lucide-react";

const userGrowth = [
  { day: "شنبه", users: 2410 }, { day: "یک‌شنبه", users: 2480 }, { day: "دوشنبه", users: 2560 },
  { day: "سه‌شنبه", users: 2620 }, { day: "چهارشنبه", users: 2710 }, { day: "پنج‌شنبه", users: 2790 },
  { day: "جمعه", users: 2847 },
];

const dau = [
  { day: "ش", value: 612 }, { day: "ی", value: 705 }, { day: "د", value: 668 },
  { day: "س", value: 742 }, { day: "چ", value: 810 }, { day: "پ", value: 855 }, { day: "ج", value: 892 },
];

const aiUsage = [
  { day: "ش", requests: 9800 }, { day: "ی", requests: 11200 }, { day: "د", requests: 10500 },
  { day: "س", requests: 12800 }, { day: "چ", requests: 13600 }, { day: "پ", requests: 14900 }, { day: "ج", requests: 16800 },
];

const safetyBreakdown = [
  { name: "کم", value: 62, color: "#32D583" },
  { name: "متوسط", value: 21, color: "#5B8CFF" },
  { name: "بالا", value: 13, color: "#FFB547" },
  { name: "بحرانی", value: 4, color: "#FF4D5F" },
];

const latency = [
  { day: "ش", ms: 260 }, { day: "ی", ms: 245 }, { day: "د", ms: 270 },
  { day: "س", ms: 230 }, { day: "چ", ms: 220 }, { day: "پ", ms: 238 }, { day: "ج", ms: 224 },
];

function ChartCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        {title}
      </h2>
      <div className="h-56">{children}</div>
    </div>
  );
}

const tooltipStyle = {
  background: "#0D141B",
  border: "1px solid #1B2833",
  borderRadius: "10px",
  fontSize: "12px",
  color: "#fff",
};

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState("7d");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">تحلیل‌ها</h1>
          <p className="text-text-secondary text-sm">آمار رشد کاربران، مصرف AI و رویدادهای ایمنی.</p>
        </div>
        <div className="flex items-center gap-1 glass rounded-lg p-1">
          {["7d", "30d", "90d"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs transition ${range === r ? "bg-primary/10 text-primary" : "text-text-secondary hover:text-white"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "رشد کاربران", value: "+18.1%", icon: Users, color: "text-primary" },
          { label: "کاربران فعال روزانه", value: "892", icon: Activity, color: "text-secondary" },
          { label: "میانگین تأخیر", value: "238ms", icon: Clock, color: "text-success" },
          { label: "نرخ رویداد ایمنی", value: "1.4%", icon: AlertTriangle, color: "text-warning" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass rounded-2xl p-5">
              <div className={`w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center mb-3 ${s.color}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-text-secondary">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="رشد کاربران" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userGrowth}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#18E0C4" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#18E0C4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1B2833" vertical={false} />
              <XAxis dataKey="day" stroke="#66727D" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#66727D" fontSize={11} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="users" stroke="#18E0C4" strokeWidth={2} fill="url(#userGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="کاربران فعال روزانه" icon={Users}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dau}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1B2833" vertical={false} />
              <XAxis dataKey="day" stroke="#66727D" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#66727D" fontSize={11} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="value" fill="#5B8CFF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="درخواست‌های AI" icon={Activity}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aiUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1B2833" vertical={false} />
              <XAxis dataKey="day" stroke="#66727D" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#66727D" fontSize={11} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="requests" stroke="#2FFFF0" strokeWidth={2.5} dot={{ r: 3, fill: "#2FFFF0" }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="تأخیر پاسخ (ms)" icon={Clock}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1B2833" vertical={false} />
              <XAxis dataKey="day" stroke="#66727D" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#66727D" fontSize={11} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="ms" stroke="#FFB547" strokeWidth={2.5} dot={{ r: 3, fill: "#FFB547" }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          توزیع سطح ریسک رویدادهای ایمنی
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="w-48 h-48 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={safetyBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {safetyBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3 w-full">
            {safetyBreakdown.map((s) => (
              <div key={s.name} className="flex items-center gap-2 p-3 rounded-xl bg-bg-secondary border border-border">
                <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                <div>
                  <p className="text-sm font-semibold text-white">{s.value}%</p>
                  <p className="text-xs text-muted">{s.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
