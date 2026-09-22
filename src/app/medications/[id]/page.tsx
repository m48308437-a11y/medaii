"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Pill, ChevronRight, AlertTriangle, Info, FileWarning, Sparkles, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MEDICATIONS_MOCK } from "@/lib/ai/service";

export default function MedicationDetailPage({ params }: { params: { id: string } }) {
  const med = MEDICATIONS_MOCK.find((m) => m.id === params.id);
  if (!med) notFound();

  const m = {
    name: med!.name.fa,
    genericName: med!.genericName,
    drugClass: med!.drugClass,
    uses: med!.uses.fa,
    forms: med!.forms.fa,
    warnings: med!.warnings.fa,
    sideEffects: med!.sideEffects.fa,
    interactions: med!.interactions.fa,
    whenToTalk: med!.whenToTalk.fa,
  };

  const sections = [
    { icon: Info, title: "کاربردها", color: "text-primary", items: m.uses },
    { icon: Pill, title: "اشکال دارویی", color: "text-secondary", items: m.forms },
    { icon: AlertTriangle, title: "هشدارها", color: "text-warning", items: m.warnings },
    { icon: FileWarning, title: "عوارض جانبی", color: "text-danger", items: m.sideEffects },
    { icon: Sparkles, title: "تداخلات احتمالی", color: "text-primary-bright", items: m.interactions },
    { icon: Stethoscope, title: "چه زمانی با پزشک/داروساز صحبت کنید", color: "text-success", items: m.whenToTalk },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/medications" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary mb-6 transition">
          <ChevronRight className="w-4 h-4" />
          بازگشت به لیست داروها
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 sm:p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-warning/10 border border-warning/30 flex items-center justify-center flex-shrink-0">
              <Pill className="w-8 h-8 text-warning" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{m.name}</h1>
              <p className="text-text-secondary mb-2">{m.genericName}</p>
              <span className="inline-block text-xs px-2 py-1 rounded-full bg-white/5 border border-border text-muted">{m.drugClass}</span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          {sections.map((sec, i) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={sec.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-5 sm:p-6"
              >
                <h2 className={`flex items-center gap-2 font-semibold text-white mb-3 ${sec.color}`}>
                  <Icon className="w-5 h-5" />
                  {sec.title}
                </h2>
                <ul className="space-y-2">
                  {sec.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 p-4 rounded-2xl bg-danger/5 border border-danger/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary leading-relaxed">
            <strong className="text-danger">هشدار مهم:</strong> این اطلاعات صرفاً جنبه اطلاع‌رسانی عمومی دارد و جایگزین مشاوره با پزشک یا داروساز نیست.
            برای تشخیص، تجویز یا تغییر در روند درمان با پزشک متخصص مشورت کنید.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/ai">
            <Button>گفت‌وگو در مورد این دارو با AI</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
