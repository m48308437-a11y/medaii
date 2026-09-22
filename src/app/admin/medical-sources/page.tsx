"use client";
import { Database, Plus, Check, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const sources = [
  { title: "WHO - Headache Disorders", type: "guideline", author: "World Health Organization", status: "indexed", version: "2024.1", docs: 42 },
  { title: "CDC - Sore Throat Guidelines", type: "guideline", author: "CDC", status: "indexed", version: "2024.3", docs: 28 },
  { title: "NHS - Fever Management", type: "guideline", author: "NHS UK", status: "indexed", version: "2024.2", docs: 35 },
  { title: "Mayo Clinic - Common Conditions", type: "textbook", author: "Mayo Clinic", status: "indexing", version: "2025.0", docs: 0 },
  { title: "Johns Hopkins - Abdominal Pain", type: "article", author: "Johns Hopkins", status: "pending", version: "—", docs: 0 },
];

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  indexed: { label: "ایندکس شده", color: "text-success bg-success/10 border-success/30", icon: Check },
  indexing: { label: "در حال ایندکس", color: "text-secondary bg-secondary/10 border-secondary/30", icon: Clock },
  pending: { label: "در انتظار", color: "text-warning bg-warning/10 border-warning/30", icon: AlertTriangle },
};

export default function MedicalSourcesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">منابع پزشکی</h1>
          <p className="text-text-secondary text-sm">مدیریت پایگاه دانش RAG و منابع معتبر.</p>
        </div>
        <Button size="sm" className="gap-2"><Plus className="w-4 h-4" />افزودن منبع</Button>
      </div>

      <div className="glass rounded-2xl divide-y divide-border overflow-hidden">
        {sources.map((s, i) => {
          const st = statusMap[s.status];
          const StatusIcon = st.icon;
          return (
            <div key={i} className="p-5 flex items-center gap-4 hover:bg-white/[0.02] transition">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-medium text-white text-sm">{s.title}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-border text-muted">{s.type}</span>
                </div>
                <p className="text-xs text-muted">{s.author} • نسخه {s.version} • {s.docs} سند</p>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full border flex items-center gap-1 ${st.color}`}>
                <StatusIcon className="w-3 h-3" />{st.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
