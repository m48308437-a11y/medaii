"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Upload, FileText, AlertTriangle, CheckCircle2, ArrowUp, ArrowDown, Minus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { analyzeLabText } from "@/lib/ai/service";

interface LabItem {
  name: string;
  value: string;
  unit: string;
  status: "normal" | "high" | "low";
  note: string;
  refRange: string;
}

interface LabResult {
  title: string;
  items: LabItem[];
  summary: string;
  questions: string[];
}

export default function LabAnalyzerPage() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<LabResult | null>(null);

  async function handleAnalyze() {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 900));
    const res = analyzeLabText(text, "fa");
    setResult(res);
    setIsAnalyzing(false);
  }

  function reset() {
    setResult(null);
    setText("");
  }

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-secondary/20 mb-4">
            <FlaskConical className="w-4 h-4 text-secondary" />
            <span className="text-xs text-text-secondary">تحلیل‌گر آزمایش</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            <span className="gradient-text">آزمایش</span> خود را بفهمید
          </h1>
          <p className="text-text-secondary text-sm">
            مقادیر آزمایش خود را وارد کنید تا به زبان ساده برای شما توضیح دهیم.
          </p>
        </div>

        {!result ? (
          <div className="glass rounded-3xl p-6 sm:p-8">
            <div className="border-2 border-dashed border-border rounded-2xl p-6 sm:p-8 text-center mb-6 hover:border-primary/30 transition">
              <Upload className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="text-text-secondary text-sm mb-3">
                فایل آزمایش را بکشید و رها کنید یا متن آزمایش را در کادر زیر پیست کنید
              </p>
              <p className="text-xs text-muted mb-4">
                پشتیبانی از فایل‌ها و تصاویر در نسخه‌های آینده — در حال حاضر متن را وارد کنید
              </p>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              placeholder={`مثال:\nHemoglobin 12.8 g/dL\nGlucose (Fasting) 110 mg/dL\nTotal Cholesterol 210 mg/dL\nWBC 7.2 ×10³/µL\n\nیا متن آزمایش فارسی...`}
              className="w-full bg-bg-secondary border border-border rounded-2xl px-4 py-4 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition resize-none text-sm leading-relaxed font-mono"
              dir="ltr"
            />

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button onClick={handleAnalyze} disabled={!text.trim() || isAnalyzing} fullWidth size="lg" className="gap-2">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    در حال تحلیل...
                  </>
                ) : (
                  <>
                    <FlaskConical className="w-5 h-5" />
                    تحلیل نتایج
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted text-center mt-4 leading-relaxed">
              ⚠️ این تحلیل جنبه اطلاع‌رسانی دارد و جایگزین تفسیر پزشک نیست.
            </p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {result.title}
              </h2>
              <Button variant="ghost" size="sm" onClick={reset}>تحلیل جدید</Button>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border grid grid-cols-12 gap-2 text-xs text-muted font-semibold uppercase tracking-wider">
                <div className="col-span-4 sm:col-span-3">نام آزمایش</div>
                <div className="col-span-3 sm:col-span-2 text-right sm:text-center">مقدار</div>
                <div className="hidden sm:block sm:col-span-2 text-center">واحد</div>
                <div className="hidden sm:block sm:col-span-2 text-center">مرجع</div>
                <div className="col-span-5 sm:col-span-3 text-start sm:text-center">وضعیت</div>
              </div>
              {result.items.map((item, i) => {
                const statusMap = {
                  normal: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "طبیعی", border: "border-success/20" },
                  high: { icon: ArrowUp, color: "text-danger", bg: "bg-danger/10", label: "بالا", border: "border-danger/20" },
                  low: { icon: ArrowDown, color: "text-warning", bg: "bg-warning/10", label: "پایین", border: "border-warning/20" },
                };
                const s = statusMap[item.status];
                const Icon = s.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`p-4 border-b border-border last:border-b-0 grid grid-cols-12 gap-2 items-center hover:bg-white/5 transition`}
                  >
                    <div className="col-span-4 sm:col-span-3 text-sm font-medium text-white">{item.name}</div>
                    <div className={`col-span-3 sm:col-span-2 text-right sm:text-center font-bold ${s.color}`}>{item.value}</div>
                    <div className="hidden sm:block sm:col-span-2 text-center text-xs text-text-secondary">{item.unit}</div>
                    <div className="hidden sm:block sm:col-span-2 text-center text-xs text-muted">{item.refRange || "—"}</div>
                    <div className="col-span-5 sm:col-span-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${s.bg} ${s.color} ${s.border}`}>
                        <Icon className="w-3 h-3" />
                        {s.label}
                      </span>
                    </div>
                    {item.note && (
                      <div className="col-span-12 mt-2 text-xs text-text-secondary leading-relaxed pt-2 border-t border-border/50">
                        {item.note}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20">
              <h3 className="font-semibold text-white text-sm mb-2">خلاصه تحلیل</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{result.summary}</p>
            </div>

            <div className="p-5 rounded-2xl glass border border-border">
              <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                سؤالاتی که بهتر است از پزشک خود بپرسید
              </h3>
              <ul className="space-y-2">
                {result.questions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="w-5 h-5 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-secondary font-bold">{i + 1}</span>
                    </span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
