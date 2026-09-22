"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Stethoscope, Plus, X, Loader2, FileText, CheckCircle2, Printer, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Summary {
  mainConcern: string;
  symptoms: string[];
  duration?: string;
  changesOverTime?: string;
  relevantNotes?: string;
  questionsForDoctor: string[];
  createdAt: string;
}

export default function DoctorPreparationPage() {
  const [mainConcern, setMainConcern] = useState("");
  const [symptomInput, setSymptomInput] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState("");
  const [changesOverTime, setChangesOverTime] = useState("");
  const [relevantNotes, setRelevantNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [copied, setCopied] = useState(false);

  function addSymptom() {
    if (symptomInput.trim() && !symptoms.includes(symptomInput.trim())) {
      setSymptoms((s) => [...s, symptomInput.trim()]);
      setSymptomInput("");
    }
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!mainConcern.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/doctor-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mainConcern, symptoms, duration, changesOverTime, relevantNotes }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!summary) return;
    const text = `خلاصه سلامت برای ویزیت پزشک\n\nنگرانی اصلی: ${summary.mainConcern}\nعلائم: ${summary.symptoms.join("، ") || "—"}\nمدت زمان: ${summary.duration || "—"}\nتغییرات: ${summary.changesOverTime || "—"}\nیادداشت‌های مرتبط: ${summary.relevantNotes || "—"}\n\nسؤالات برای پزشک:\n${summary.questionsForDoctor.map((q, i) => `${i + 1}. ${q}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setSummary(null);
    setMainConcern("");
    setSymptoms([]);
    setDuration("");
    setChangesOverTime("");
    setRelevantNotes("");
  }

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-secondary/20 mb-4">
            <Stethoscope className="w-4 h-4 text-secondary" />
            <span className="text-xs text-text-secondary">آماده‌سازی برای پزشک</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            برای <span className="gradient-text">ویزیت پزشک</span> آماده شوید
          </h1>
          <p className="text-text-secondary text-sm max-w-xl mx-auto">
            یک خلاصه مرتب از نگرانی‌ها، علائم و سؤالات خود بسازید تا ارتباط بهتری با پزشک داشته باشید.
          </p>
        </div>

        {!summary ? (
          <form onSubmit={handleGenerate} className="glass rounded-3xl p-6 sm:p-8 space-y-5">
            <div>
              <label className="block text-sm text-text-secondary mb-2">نگرانی اصلی شما چیست؟</label>
              <textarea
                value={mainConcern}
                onChange={(e) => setMainConcern(e.target.value)}
                required
                rows={3}
                placeholder="مثلاً: سردردهای مکرر در دو هفته اخیر"
                className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 resize-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">علائم مرتبط</label>
              <div className="flex gap-2 mb-2">
                <input
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSymptom(); } }}
                  placeholder="یک علامت بنویسید و Enter بزنید"
                  className="flex-1 bg-bg-secondary border border-border rounded-xl px-4 py-2.5 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 text-sm"
                />
                <Button type="button" variant="outline" size="sm" onClick={addSymptom}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs text-white">
                    {s}
                    <button type="button" onClick={() => setSymptoms((arr) => arr.filter((x) => x !== s))}>
                      <X className="w-3 h-3 text-muted hover:text-danger" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">مدت زمان</label>
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="مثلاً: دو هفته"
                className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-2.5 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">تغییرات طی زمان (اختیاری)</label>
              <textarea
                value={changesOverTime}
                onChange={(e) => setChangesOverTime(e.target.value)}
                rows={2}
                placeholder="آیا بهتر یا بدتر شده؟"
                className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 resize-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">یادداشت‌های مرتبط دیگر (اختیاری)</label>
              <textarea
                value={relevantNotes}
                onChange={(e) => setRelevantNotes(e.target.value)}
                rows={2}
                placeholder="سابقه بیماری، داروهای مصرفی، آلرژی..."
                className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 resize-none text-sm"
              />
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
              ساخت خلاصه سلامت
            </Button>
          </form>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass rounded-3xl p-6 sm:p-8 glow-secondary">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  خلاصه سلامت شما آماده است
                </h2>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="w-9 h-9 rounded-lg glass flex items-center justify-center text-text-secondary hover:text-primary transition">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={() => window.print()} className="w-9 h-9 rounded-lg glass flex items-center justify-center text-text-secondary hover:text-primary transition">
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {copied && <p className="text-xs text-success mb-3">✓ در کلیپ‌بورد کپی شد</p>}

              <div className="space-y-4">
                <SummaryField label="نگرانی اصلی" value={summary.mainConcern} />
                {summary.symptoms.length > 0 && (
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider mb-2">علائم</p>
                    <div className="flex flex-wrap gap-2">
                      {summary.symptoms.map((s) => (
                        <span key={s} className="px-3 py-1 rounded-full bg-white/5 border border-border text-xs text-white">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {summary.duration && <SummaryField label="مدت زمان" value={summary.duration} />}
                {summary.changesOverTime && <SummaryField label="تغییرات طی زمان" value={summary.changesOverTime} />}
                {summary.relevantNotes && <SummaryField label="یادداشت‌های مرتبط" value={summary.relevantNotes} />}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-secondary" />
                سؤالاتی که می‌توانید از پزشک بپرسید
              </h3>
              <ul className="space-y-2">
                {summary.questionsForDoctor.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="w-5 h-5 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] text-secondary font-bold">
                      {i + 1}
                    </span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-bg-secondary border border-border text-xs text-muted leading-relaxed">
              این خلاصه فقط برای کمک به ارتباط بهتر شما با پزشک است و جایگزین معاینه یا تشخیص پزشکی نیست.
            </div>

            <Button variant="outline" fullWidth onClick={reset}>ساخت خلاصه جدید</Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-white leading-relaxed">{value}</p>
    </div>
  );
}
