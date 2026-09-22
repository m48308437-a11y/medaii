"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Plus, Calendar, Pill, Stethoscope, FlaskConical, X, Loader2,
  CheckCircle2, Circle, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

interface Reminder {
  id: string;
  type: "appointment" | "medication" | "lab_followup" | "general";
  title: string;
  notes: string | null;
  dueAt: string;
  recurring: string;
  isCompleted: boolean;
}

const typeConfig = {
  appointment: { icon: Calendar, label: "قرار ملاقات", color: "text-secondary bg-secondary/10 border-secondary/30" },
  medication: { icon: Pill, label: "دارو", color: "text-warning bg-warning/10 border-warning/30" },
  lab_followup: { icon: FlaskConical, label: "پیگیری آزمایش", color: "text-primary bg-primary/10 border-primary/30" },
  general: { icon: Bell, label: "عمومی", color: "text-success bg-success/10 border-success/30" },
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [type, setType] = useState<Reminder["type"]>("general");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [dueAt, setDueAt] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/reminders");
      const data = await res.json();
      setReminders(data.reminders || []);
    } catch {
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !dueAt) return;
    setSaving(true);
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, notes, dueAt: new Date(dueAt).toISOString() }),
      });
      if (res.ok) {
        await load();
        setShowForm(false);
        setTitle(""); setNotes(""); setDueAt("");
      }
    } finally {
      setSaving(false);
    }
  }

  async function toggleComplete(r: Reminder) {
    setReminders((prev) => prev.map((x) => x.id === r.id ? { ...x, isCompleted: !x.isCompleted } : x));
    await fetch("/api/reminders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r.id, isCompleted: !r.isCompleted }),
    });
  }

  async function handleDelete(id: string) {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    await fetch(`/api/reminders?id=${id}`, { method: "DELETE" });
  }

  const upcoming = reminders.filter((r) => !r.isCompleted);
  const completed = reminders.filter((r) => r.isCompleted);

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-warning/20 mb-3">
              <Bell className="w-4 h-4 text-warning" />
              <span className="text-xs text-text-secondary">یادآوری‌های سلامت</span>
            </div>
            <h1 className="text-3xl font-bold text-white">یادآوری‌های <span className="gradient-text">شما</span></h1>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2 self-start sm:self-auto">
            <Plus className="w-4 h-4" /> یادآوری جدید
          </Button>
        </div>

        {!authed ? (
          <EmptyState icon={Bell} title="برای مدیریت یادآوری‌ها وارد شوید" actionLabel="ورود به حساب" actionHref="/login" />
        ) : loading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-2xl glass shimmer" />)}</div>
        ) : reminders.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="یادآوری‌ای ثبت نشده"
            description="برای قرار ملاقات، مصرف دارو یا پیگیری آزمایش یادآوری بسازید."
            actionLabel="ساخت یادآوری"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="space-y-6">
            {upcoming.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-text-secondary mb-2">در پیش رو</h2>
                {upcoming.map((r) => <ReminderCard key={r.id} r={r} onToggle={toggleComplete} onDelete={handleDelete} />)}
              </div>
            )}
            {completed.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-muted mb-2">انجام‌شده</h2>
                {completed.map((r) => <ReminderCard key={r.id} r={r} onToggle={toggleComplete} onDelete={handleDelete} done />)}
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                <h2 className="text-lg font-semibold text-white">یادآوری جدید</h2>
                <button type="button" onClick={() => setShowForm(false)} className="text-muted hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {(Object.keys(typeConfig) as Array<keyof typeof typeConfig>).map((t) => {
                  const cfg = typeConfig[t];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs transition ${type === t ? "bg-primary/10 border-primary/40 text-white" : "border-border text-text-secondary"}`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {cfg.label}
                    </button>
                  );
                })}
              </div>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="عنوان یادآوری"
                className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-2.5 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 mb-3 text-sm"
              />
              <input
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                required
                className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 mb-3 text-sm"
                dir="ltr"
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="یادداشت (اختیاری)"
                className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 resize-none text-sm mb-4"
              />
              <Button type="submit" fullWidth loading={saving} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "ذخیره یادآوری"}
              </Button>
              <p className="text-[11px] text-muted text-center mt-3">
                یادآوری‌های دارویی صرفاً اطلاعاتی هستند و دوز یا برنامه دارو را تغییر نمی‌دهند.
              </p>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReminderCard({ r, onToggle, onDelete, done }: { r: Reminder; onToggle: (r: Reminder) => void; onDelete: (id: string) => void; done?: boolean }) {
  const cfg = typeConfig[r.type];
  const Icon = cfg.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`glass rounded-2xl p-4 flex items-center gap-4 group ${done ? "opacity-60" : "card-hover"}`}
    >
      <button onClick={() => onToggle(r)} className="flex-shrink-0">
        {r.isCompleted ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Circle className="w-5 h-5 text-muted" />}
      </button>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${cfg.color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium text-white ${done ? "line-through" : ""}`}>{r.title}</p>
        <p className="text-xs text-muted">
          {new Date(r.dueAt).toLocaleString("fa-IR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          {r.notes ? ` • ${r.notes}` : ""}
        </p>
      </div>
      <button onClick={() => onDelete(r.id)} className="opacity-0 group-hover:opacity-100 transition w-8 h-8 rounded-lg text-muted hover:text-danger hover:bg-danger/10 flex-shrink-0">
        <Trash2 className="w-4 h-4 mx-auto" />
      </button>
    </motion.div>
  );
}
