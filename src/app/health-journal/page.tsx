"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookHeart, Plus, Calendar as CalendarIcon, List, Smile, Meh, Frown,
  Trash2, X, Loader2, ChevronLeft, ChevronRight as ChevronRightIcon
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

interface Entry {
  id: string;
  type: "note" | "symptom" | "mood";
  title: string | null;
  content: string | null;
  mood: string | null;
  symptomTags: string[];
  severity: number | null;
  entryDate: string;
}

const moods = [
  { value: "great", icon: Smile, label: "عالی", color: "text-success" },
  { value: "okay", icon: Meh, label: "معمولی", color: "text-warning" },
  { value: "bad", icon: Frown, label: "بد", color: "text-danger" },
];

export default function HealthJournalPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"timeline" | "calendar">("timeline");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [authed, setAuthed] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("okay");
  const [type, setType] = useState<"note" | "symptom" | "mood">("note");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/health-journal");
      const data = await res.json();
      setEntries(data.entries || []);
      setAuthed(true);
    } catch {
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/health-journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, content, mood: type === "mood" ? mood : undefined, symptomTags: [] }),
      });
      if (res.ok) {
        await load();
        setShowForm(false);
        setTitle("");
        setContent("");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/health-journal?id=${id}`, { method: "DELETE" });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/20 mb-3">
              <BookHeart className="w-4 h-4 text-primary" />
              <span className="text-xs text-text-secondary">دفترچه سلامت</span>
            </div>
            <h1 className="text-3xl font-bold text-white">یادداشت‌های <span className="gradient-text">سلامت شما</span></h1>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2 self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            یادداشت جدید
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setView("timeline")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition ${view === "timeline" ? "bg-primary/10 text-primary border border-primary/30" : "text-text-secondary border border-transparent hover:bg-white/5"}`}
          >
            <List className="w-3.5 h-3.5" /> جدول زمانی
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition ${view === "calendar" ? "bg-primary/10 text-primary border border-primary/30" : "text-text-secondary border border-transparent hover:bg-white/5"}`}
          >
            <CalendarIcon className="w-3.5 h-3.5" /> تقویم
          </button>
        </div>

        {!authed ? (
          <EmptyState
            icon={BookHeart}
            title="برای استفاده از دفترچه سلامت وارد شوید"
            description="یادداشت‌های سلامت شما به صورت خصوصی ذخیره می‌شوند."
            actionLabel="ورود به حساب"
            actionHref="/login"
          />
        ) : loading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl glass shimmer" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <EmptyState
            icon={BookHeart}
            title="هنوز یادداشتی ثبت نکرده‌اید"
            description="با ثبت یادداشت‌های روزانه، روند سلامت خود را بهتر دنبال کنید."
            actionLabel="ثبت اولین یادداشت"
            onAction={() => setShowForm(true)}
          />
        ) : view === "timeline" ? (
          <div className="space-y-3">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5 flex items-start gap-4 card-hover group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  {entry.type === "mood" ? (
                    (() => {
                      const m = moods.find((mm) => mm.value === entry.mood) || moods[1];
                      const MIcon = m.icon;
                      return <MIcon className={`w-5 h-5 ${m.color}`} />;
                    })()
                  ) : (
                    <BookHeart className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-white text-sm">{entry.title || "یادداشت بدون عنوان"}</h3>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="opacity-0 group-hover:opacity-100 transition w-7 h-7 rounded-lg text-muted hover:text-danger hover:bg-danger/10 flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  </div>
                  {entry.content && <p className="text-sm text-text-secondary mt-1 leading-relaxed">{entry.content}</p>}
                  <p className="text-[11px] text-muted mt-2">
                    {new Date(entry.entryDate).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <CalendarView entries={entries} />
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSave}
              className="w-full max-w-md glass-strong rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white">یادداشت جدید</h2>
                <button type="button" onClick={() => setShowForm(false)} className="text-muted hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                {[
                  { v: "note", label: "یادداشت" },
                  { v: "symptom", label: "علامت" },
                  { v: "mood", label: "حال‌وهوا" },
                ].map((t) => (
                  <button
                    key={t.v}
                    type="button"
                    onClick={() => setType(t.v as any)}
                    className={`flex-1 py-2 rounded-lg text-sm border transition ${type === t.v ? "bg-primary/10 border-primary/40 text-white" : "border-border text-text-secondary"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {type === "mood" ? (
                <div className="flex gap-3 mb-4 justify-center">
                  {moods.map((m) => {
                    const MIcon = m.icon;
                    return (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setMood(m.value)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition ${mood === m.value ? "border-primary/40 bg-primary/10" : "border-border"}`}
                      >
                        <MIcon className={`w-6 h-6 ${m.color}`} />
                        <span className="text-xs text-text-secondary">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="عنوان (اختیاری)"
                  className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-2.5 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 mb-3 text-sm"
                />
              )}

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="جزئیات را بنویسید..."
                className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 resize-none text-sm mb-4"
              />

              <Button type="submit" fullWidth loading={saving} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "ذخیره یادداشت"}
              </Button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CalendarView({ entries }: { entries: Entry[] }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const year = target.getFullYear();
  const month = target.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const entriesByDay: Record<number, Entry[]> = {};
  entries.forEach((e) => {
    const d = new Date(e.entryDate);
    if (d.getFullYear() === year && d.getMonth() === month) {
      entriesByDay[d.getDate()] = entriesByDay[d.getDate()] || [];
      entriesByDay[d.getDate()].push(e);
    }
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setMonthOffset((m) => m - 1)} className="w-8 h-8 rounded-lg hover:bg-white/5 text-text-secondary">
          <ChevronRightIcon className="w-4 h-4 mx-auto" />
        </button>
        <span className="text-sm font-semibold text-white">
          {target.toLocaleDateString("fa-IR", { year: "numeric", month: "long" })}
        </span>
        <button onClick={() => setMonthOffset((m) => m + 1)} className="w-8 h-8 rounded-lg hover:bg-white/5 text-text-secondary">
          <ChevronLeft className="w-4 h-4 mx-auto" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((d) => (
          <div key={d} className="text-xs text-muted py-1">{d}</div>
        ))}
        {cells.map((d, i) => (
          <div
            key={i}
            className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative ${
              d ? "border border-border hover:border-primary/30 cursor-default" : ""
            } ${d === now.getDate() && monthOffset === 0 ? "bg-primary/10 border-primary/40" : ""}`}
          >
            {d && (
              <>
                <span className="text-text-secondary">{d}</span>
                {entriesByDay[d] && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5" />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
