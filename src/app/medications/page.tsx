"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Pill, Search, AlertTriangle, ChevronLeft, Info, FileWarning, Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MEDICATIONS_MOCK } from "@/lib/ai/service";

export default function MedicationsPage() {
  const [query, setQuery] = useState("");

  const localized = MEDICATIONS_MOCK.map((m) => ({
    ...m,
    name: m.name.fa,
    uses: m.uses.fa,
    forms: m.forms.fa,
    warnings: m.warnings.fa,
    sideEffects: m.sideEffects.fa,
    interactions: m.interactions.fa,
    whenToTalk: m.whenToTalk.fa,
  }));

  const filtered = localized.filter(
    (m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.drugClass.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-warning/20 mb-4">
            <Pill className="w-4 h-4 text-warning" />
            <span className="text-xs text-text-secondary">اطلاعات داروها</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            بانک <span className="gradient-text">اطلاعات دارویی</span>
          </h1>
          <p className="text-text-secondary text-sm">اطلاعات عمومی داروها، کاربردها، عوارض و هشدارها.</p>
        </div>

        <div className="glass rounded-2xl p-4 mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="نام دارو یا دسته دارویی را جستجو کنید..."
              className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 pr-11 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Pill className="w-10 h-10 text-muted mx-auto mb-3" />
            <p className="text-text-secondary">دارویی یافت نشد.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((med, i) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5 card-hover"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">{med.name}</h3>
                    <p className="text-xs text-muted">{med.drugClass}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-warning/10 border border-warning/30 flex items-center justify-center flex-shrink-0">
                    <Pill className="w-5 h-5 text-warning" />
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-xs text-muted font-semibold uppercase tracking-wider mb-2">کاربردهای رایج</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {med.uses.slice(0, 3).map((u) => (
                      <span key={u} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-border text-text-secondary">
                        {u}
                      </span>
                    ))}
                    {med.uses.length > 3 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-muted">
                        +{med.uses.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <Link href={`/medications/${med.id}`}>
                  <Button variant="outline" size="sm" fullWidth className="gap-1">
                    <Info className="w-3.5 h-3.5" />
                    مشاهده جزئیات
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 rounded-2xl bg-danger/5 border border-danger/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary leading-relaxed">
            <strong className="text-danger">هشدار:</strong> اطلاعات ارائه شده صرفاً جنبه اطلاع‌رسانی دارد و نباید به عنوان توصیه پزشکی در نظر گرفته شود.
            همیشه قبل از شروع یا قطع هر دارویی با پزشک یا داروساز مشورت کنید. هرگز خودسرانه دارو مصرف نکنید.
          </p>
        </div>
      </div>
    </div>
  );
}
