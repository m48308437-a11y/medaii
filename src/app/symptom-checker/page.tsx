"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronLeft, Activity, Users, Clock, Gauge,
  CheckCircle2, AlertTriangle, ThermometerSnowflake, Loader2, ListChecks
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { generateSymptomResult } from "@/lib/ai/service";

const steps = [
  { id: "age", title: "سن", icon: Users, fa: "محدوده سنی شما چقدر است؟" },
  { id: "symptom", title: "علامت", icon: Activity, fa: "علامت اصلی شما چیست؟" },
  { id: "duration", title: "مدت", icon: Clock, fa: "از چه زمانی شروع شده؟" },
  { id: "severity", title: "شدت", icon: Gauge, fa: "شدت آن چقدر است؟" },
  { id: "associated", title: "علائم همراه", icon: ListChecks, fa: "آیا علائم دیگری هم دارید؟" },
  { id: "context", title: "سوابق", icon: ThermometerSnowflake, fa: "سابقه پزشکی یا داروی مصرفی؟" },
  { id: "result", title: "نتیجه", icon: CheckCircle2, fa: "نتیجه بررسی" },
];

const ageOptions = [
  { value: "0-12", fa: "کودک (۰-۱۲ سال)" },
  { value: "13-17", fa: "نوجوان (۱۳-۱۷)" },
  { value: "18-40", fa: "جوان (۱۸-۴۰)" },
  { value: "41-64", fa: "میان‌سال (۴۱-۶۴)" },
  { value: "65+", fa: "بزرگ‌سال (۶۵+)" },
];

const symptomOptions = [
  { value: "headache", fa: "سردرد" },
  { value: "sore throat", fa: "گلودرد" },
  { value: "cough", fa: "سرفه" },
  { value: "fever", fa: "تب" },
  { value: "fatigue", fa: "خستگی" },
  { value: "stomach pain", fa: "درد معده/شکم" },
  { value: "back pain", fa: "کمردرد" },
  { value: "dizziness", fa: "سرگیجه" },
  { value: "other", fa: "سایر" },
];

const durationOptions = [
  { value: "hours", fa: "چند ساعت اخیر" },
  { value: "1-3 days", fa: "۱-۳ روز" },
  { value: "4-7 days", fa: "۴-۷ روز" },
  { value: "1-2 weeks", fa: "۱-۲ هفته" },
  { value: "1+ month", fa: "بیش از یک ماه" },
];

const associatedOptions = [
  { value: "fever", fa: "تب" },
  { value: "nausea", fa: "حالت تهوع" },
  { value: "vomiting", fa: "استفراغ" },
  { value: "diarrhea", fa: "اسهال" },
  { value: "fatigue", fa: "خستگی" },
  { value: "shortness of breath", fa: "تنگی نفس" },
  { value: "chest pain", fa: "درد قفسه سینه" },
  { value: "rash", fa: "جوش پوستی" },
  { value: "none", fa: "هیچ‌کدام" },
];

export default function SymptomCheckerPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [age, setAge] = useState("");
  const [mainSymptom, setMainSymptom] = useState("");
  const [customSymptom, setCustomSymptom] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState(5);
  const [associated, setAssociated] = useState<string[]>([]);
  const [medicalContext, setMedicalContext] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  function canProceed() {
    switch (currentStep) {
      case 0: return !!age;
      case 1: return !!mainSymptom && (mainSymptom !== "other" || customSymptom.length > 2);
      case 2: return !!duration;
      case 3: return severity >= 1;
      case 4: return true;
      case 5: return true;
      default: return true;
    }
  }

  function toggleAssociated(val: string) {
    setAssociated((prev) => prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]);
  }

  async function handleNext() {
    if (currentStep < steps.length - 2) {
      setCurrentStep((s) => s + 1);
    } else if (currentStep === steps.length - 2) {
      // Calculate result
      setIsCalculating(true);
      await new Promise((r) => setTimeout(r, 1200));
      const sym = mainSymptom === "other" ? customSymptom : symptomOptions.find((s) => s.value === mainSymptom)?.fa || mainSymptom;
      const res = generateSymptomResult({
        ageRange: age,
        mainSymptom: sym,
        duration,
        severity,
        associatedSymptoms: associated,
        medicalContext,
      }, "fa");
      setResult(res);
      setIsCalculating(false);
      setCurrentStep(steps.length - 1);
    }
  }

  function restart() {
    setCurrentStep(0);
    setAge("");
    setMainSymptom("");
    setCustomSymptom("");
    setDuration("");
    setSeverity(5);
    setAssociated([]);
    setMedicalContext("");
    setResult(null);
  }

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/20 mb-4">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs text-text-secondary">بررسی علائم</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            <span className="gradient-text">جادوگر</span> بررسی علائم
          </h1>
          <p className="text-text-secondary text-sm">چند سؤال کوتاه پاسخ دهید تا اطلاعات مرتبط دریافت کنید.</p>
        </div>

        {/* Progress bar */}
        {currentStep < steps.length - 1 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">مرحله {currentStep + 1} از {steps.length - 1}</span>
              <span className="text-sm text-primary font-medium">{Math.round(((currentStep) / (steps.length - 2)) * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-border overflow-hidden">
              <motion.div
                className="h-full gradient-primary"
                animate={{ width: `${((currentStep) / (steps.length - 2)) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="grid grid-cols-7 gap-1 mt-4">
              {steps.slice(0, -1).map((s, i) => {
                const Icon = s.icon;
                const done = i < currentStep;
                const active = i === currentStep;
                return (
                  <div key={s.id} className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all ${
                      done ? "bg-primary text-black" : active ? "bg-primary/20 border border-primary text-primary" : "bg-card border border-border text-muted"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="glass rounded-3xl p-6 sm:p-8">
          {isCalculating ? (
            <div className="text-center py-12">
              <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
              <p className="text-white font-semibold mb-1">در حال تحلیل اطلاعات...</p>
              <p className="text-sm text-text-secondary">لطفاً کمی صبر کنید.</p>
            </div>
          ) : currentStep === steps.length - 1 && result ? (
            <ResultView result={result} onRestart={restart} symptom={mainSymptom} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-white mb-6">
                  {steps[currentStep].fa}
                </h2>

                {currentStep === 0 && (
                  <OptionGrid options={ageOptions} value={age} onChange={setAge} />
                )}

                {currentStep === 1 && (
                  <div className="space-y-3">
                    <OptionGrid options={symptomOptions} value={mainSymptom} onChange={setMainSymptom} />
                    {mainSymptom === "other" && (
                      <input
                        type="text"
                        value={customSymptom}
                        onChange={(e) => setCustomSymptom(e.target.value)}
                        placeholder="علامت خود را بنویسید..."
                        className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition"
                      />
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <OptionGrid options={durationOptions} value={duration} onChange={setDuration} />
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-text-secondary text-sm">شدت: <span className="text-white font-semibold">{severity}</span></span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          severity <= 3 ? "bg-success/10 text-success" : severity <= 6 ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"
                        }`}>
                          {severity <= 3 ? "خفیف" : severity <= 6 ? "متوسط" : "شدید"}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={severity}
                        onChange={(e) => setSeverity(parseInt(e.target.value))}
                        className="w-full accent-primary"
                      />
                      <div className="flex justify-between text-xs text-muted mt-1">
                        <span>۱ (خفیف)</span>
                        <span>۱۰ (غیرقابل تحمل)</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-2">
                    <p className="text-sm text-text-secondary mb-3">هر تعداد که می‌خواهید انتخاب کنید:</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {associatedOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleAssociated(opt.value)}
                          className={`flex items-center gap-2 p-3 rounded-xl border text-right text-sm transition ${
                            associated.includes(opt.value)
                              ? "bg-primary/10 border-primary/40 text-white"
                              : "bg-bg-secondary border-border text-text-secondary hover:border-primary/30"
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            associated.includes(opt.value) ? "bg-primary border-primary text-black" : "border-muted"
                          }`}>
                            {associated.includes(opt.value) && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </span>
                          {opt.fa}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-3">
                    <label className="text-sm text-text-secondary">
                      اگر سابقه بیماری خاصی دارید، داروی خاصی مصرف می‌کنید یا نکته مهمی هست، بنویسید (اختیاری):
                    </label>
                    <textarea
                      value={medicalContext}
                      onChange={(e) => setMedicalContext(e.target.value)}
                      rows={5}
                      placeholder="مثلاً: دیابت نوع ۲، مصرف متفورمین، سابقه فشار خون..."
                      className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition resize-none"
                    />
                  </div>
                )}

                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setCurrentStep((s) => s - 1)}
                    disabled={currentStep === 0}
                    className="gap-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                    بازگشت
                  </Button>
                  <Button type="button" onClick={handleNext} disabled={!canProceed()} className="gap-2">
                    {currentStep === steps.length - 2 ? "مشاهده نتیجه" : "ادامه"}
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <p className="text-xs text-muted text-center mt-6 leading-relaxed">
          ⚠️ این ابزار فقط برای اطلاع‌رسانی است و جایگزین تشخیص پزشکی نیست. در شرایط اورژانسی با ۱۱۵ تماس بگیرید.
        </p>
      </div>
    </div>
  );
}

function OptionGrid({ options, value, onChange }: { options: { value: string; fa: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`p-4 rounded-xl border text-right transition ${
            value === opt.value
              ? "bg-primary/10 border-primary/40 text-white"
              : "bg-bg-secondary border-border text-text-secondary hover:border-primary/30"
          }`}
        >
          <span className="text-sm font-medium">{opt.fa}</span>
        </button>
      ))}
    </div>
  );
}

function ResultView({ result, onRestart, symptom }: { result: any; onRestart: () => void; symptom: string }) {
  const urgencyColor = result.urgency.level === "urgent" ? "danger" : result.urgency.level === "consult" ? "warning" : "success";
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
          urgencyColor === "danger" ? "bg-danger/20" : urgencyColor === "warning" ? "bg-warning/20" : "bg-success/20"
        }`}>
          {urgencyColor === "danger" ? (
            <AlertTriangle className="w-8 h-8 text-danger" />
          ) : (
            <CheckCircle2 className="w-8 h-8 text-success" />
          )}
        </div>
        <h2 className="text-xl font-bold text-white mb-2">نتیجه بررسی</h2>
        <p className="text-text-secondary text-sm">بر اساس اطلاعاتی که وارد کردید:</p>
      </div>

      <div className={`p-4 rounded-2xl border ${
        urgencyColor === "danger" ? "bg-danger/10 border-danger/30" : urgencyColor === "warning" ? "bg-warning/10 border-warning/30" : "bg-success/10 border-success/30"
      }`}>
        <h3 className={`font-semibold mb-1 ${urgencyColor === "danger" ? "text-danger" : urgencyColor === "warning" ? "text-warning" : "text-success"}`}>
          {result.urgency.label}
        </h3>
        <p className="text-sm text-white/90 leading-relaxed">{result.urgency.description}</p>
      </div>

      <div>
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-primary" />
          توضیحات احتمالی
        </h3>
        <div className="space-y-2">
          {result.explanations.map((exp: any, i: number) => (
            <div key={i} className="p-4 rounded-xl bg-card border border-border">
              <h4 className="font-semibold text-white text-sm mb-1">{exp.condition}</h4>
              <p className="text-sm text-text-secondary leading-relaxed">{exp.relevance}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-bg-secondary border border-border">
        <p className="text-xs text-muted leading-relaxed">{result.disclaimer}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onRestart} variant="outline" fullWidth>شروع مجدد</Button>
        <a href="/ai" className="flex-1">
          <Button fullWidth>گفت‌وگو با AI</Button>
        </a>
      </div>
    </div>
  );
}
