"use client";

import { motion } from "framer-motion";
import { MessageSquare, Search, FlaskConical, Pill, LayoutDashboard, Stethoscope } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const featuresList = [
  {
    icon: MessageSquare,
    id: "chat",
    color: "from-primary/20 to-primary/5 border-primary/30",
    iconColor: "text-primary",
  },
  {
    icon: Search,
    id: "symptom",
    color: "from-secondary/20 to-secondary/5 border-secondary/30",
    iconColor: "text-secondary",
  },
  {
    icon: FlaskConical,
    id: "lab",
    color: "from-primary-bright/15 to-primary-bright/5 border-primary-bright/30",
    iconColor: "text-primary-bright",
  },
  {
    icon: Pill,
    id: "med",
    color: "from-warning/15 to-warning/5 border-warning/30",
    iconColor: "text-warning",
  },
  {
    icon: LayoutDashboard,
    id: "dash",
    color: "from-success/15 to-success/5 border-success/30",
    iconColor: "text-success",
  },
  {
    icon: Stethoscope,
    id: "doctor",
    color: "from-muted/20 to-muted/5 border-muted/30",
    iconColor: "text-text-secondary",
    disabled: true,
  },
];

const titles: Record<Locale, { heading: string; sub: string; items: Array<{ title: string; desc: string }> }> = {
  fa: {
    heading: "ویژگی‌های مد‌ای‌آی",
    sub: "هر آنچه برای درک بهتر سلامت خود نیاز دارید",
    items: [
      { title: "گفت‌وگو با AI", desc: "با دستیار هوشمند سلامت گفت‌وگو کنید و پاسخ سؤالات خود را دریافت کنید." },
      { title: "بررسی علائم", desc: "علائم خود را مرحله به مرحله بررسی کنید و اطلاعات مرتبط دریافت کنید." },
      { title: "تحلیل آزمایش", desc: "نتایج آزمایش خود را به زبان ساده و قابل فهم دریافت کنید." },
      { title: "اطلاعات داروها", desc: "اطلاعات عمومی داروها، کاربردها، عوارض و هشدارها را ببینید." },
      { title: "داشبورد سلامت", desc: "همه اطلاعات سلامت شما در یک مکان، مرتب و قابل دسترس." },
      { title: "اتصال به پزشک", desc: "به‌زودی: امکان ارتباط مستقیم با پزشکان متخصص." },
    ],
  },
  en: {
    heading: "MedAI Features",
    sub: "Everything you need to better understand your health",
    items: [
      { title: "AI Consultation", desc: "Chat with our intelligent health assistant and get answers." },
      { title: "Symptom Checker", desc: "Walk through your symptoms step by step." },
      { title: "Lab Analyzer", desc: "Understand your lab results in plain, simple language." },
      { title: "Medication Info", desc: "Look up medication information, uses, side effects, and warnings." },
      { title: "Health Dashboard", desc: "All your health information in one organized place." },
      { title: "Doctor Connection", desc: "Coming soon: direct messaging with certified doctors." },
    ],
  },
  de: {
    heading: "MedAI-Funktionen",
    sub: "Alles, was Sie brauchen, um Ihre Gesundheit besser zu verstehen",
    items: [
      { title: "KI-Beratung", desc: "Chatten Sie mit dem intelligenten Gesundheitsassistenten." },
      { title: "Symptomprüfung", desc: "Gehen Sie Ihre Symptome Schritt für Schritt durch." },
      { title: "Laboranalyse", desc: "Verstehen Sie Ihre Laborergebnisse in einfacher Sprache." },
      { title: "Medikamenteninfos", desc: "Allgemeine Infos zu Medikamenten, Anwendung, Nebenwirkungen." },
      { title: "Gesundheitsdashboard", desc: "Alle Gesundheitsinformationen an einem Ort." },
      { title: "Arztanbindung", desc: "Demnächst: Direkter Kontakt zu zertifizierten Ärzten." },
    ],
  },
};

export function Features({ locale }: { locale: Locale }) {
  const t = titles[locale];

  return (
    <section id="features" className="relative py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(91,140,255,0.04)_0%,transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">{t.heading}</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">{t.sub}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuresList.map((feat, i) => {
            const item = t.items[i];
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`relative group p-6 rounded-2xl border bg-gradient-to-br ${feat.color} card-hover ${feat.disabled ? "opacity-60" : ""}`}
              >
                <div className={`w-12 h-12 rounded-xl glass flex items-center justify-center mb-5 ${feat.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  {item.title}
                  {feat.disabled && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/20 text-muted border border-muted/30">
                      {locale === "fa" ? "به‌زودی" : locale === "de" ? "Bald" : "Soon"}
                    </span>
                  )}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
