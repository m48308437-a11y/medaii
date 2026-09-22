"use client";
import { MessageSquare, Search } from "lucide-react";

const mockConsults = [
  { id: "c1", user: "علی رضایی", topic: "سردرد و سرگیجه", risk: "low", msgs: 8, date: "۱۴۰۴/۱۰/۲۸" },
  { id: "c2", user: "مریم احمدی", topic: "تفسیر آزمایش خون", risk: "low", msgs: 4, date: "۱۴۰۴/۱۰/۲۷" },
  { id: "c3", user: "حسین کریمی", topic: "درد قفسه سینه", risk: "critical", msgs: 3, date: "۱۴۰۴/۱۰/۲۶" },
  { id: "c4", user: "کاربر میهمان", topic: "گلودرد", risk: "low", msgs: 6, date: "۱۴۰۴/۱۰/۲۵" },
  { id: "c5", user: "ناشناس", topic: "تب و لرز", risk: "medium", msgs: 10, date: "۱۴۰۴/۱۰/۲۴" },
];

const riskColors: Record<string, string> = {
  low: "bg-success/10 text-success border-success/30",
  medium: "bg-warning/10 text-warning border-warning/30",
  high: "bg-danger/10 text-danger border-danger/30",
  critical: "bg-danger/20 text-danger border-danger/40",
};

export default function AdminConsultationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">گفت‌وگوها</h1>
        <p className="text-text-secondary text-sm">لیست همه مشاوره‌های انجام شده در پلتفرم.</p>
      </div>

      <div className="glass rounded-2xl">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              placeholder="جستجو در گفت‌وگوها..."
              className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-2.5 pr-10 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 text-sm"
            />
          </div>
        </div>
        <div className="divide-y divide-border">
          {mockConsults.map((c) => (
            <div key={c.id} className="p-4 hover:bg-white/[0.02] transition flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-medium text-white text-sm truncate">{c.topic}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${riskColors[c.risk]}`}>{c.risk}</span>
                </div>
                <p className="text-xs text-muted">کاربر: {c.user} • {c.msgs} پیام • {c.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
