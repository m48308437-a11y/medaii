"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles, Shield, HeartPulse, Activity, FlaskConical, Pill } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export function Hero({ locale }: { locale: "fa" | "en" | "de" }) {
  const isFa = locale === "fa";
  const isDe = locale === "de";

  const title1 = isFa ? "سلامت شما." : isDe ? "Deine Gesundheit." : "Your Health.";
  const title2 = isFa ? "بازتعریف شده." : isDe ? "Neu gedacht." : "Reimagined.";
  const subtitle = isFa
    ? "با مد‌ای‌آی آشنا شوید — دستیار هوشمند سلامتی که به شما کمک می‌کند سلامت خود را با شفافیت و اطمینان درک کنید."
    : isDe
      ? "Treffen Sie MedAI – ein intelligenter Gesundheitsassistent, der Ihnen hilft, Ihre Gesundheit mit Klarheit zu verstehen."
      : "Meet MedAI — an intelligent health assistant designed to help you understand your health with clarity.";
  const ctaPrimary = isFa ? "شروع گفت‌وگو با AI" : isDe ? "KI-Beratung starten" : "Start AI Consultation";
  const ctaSecondary = isFa ? "کاوش مد‌ای‌آی" : isDe ? "MedAI entdecken" : "Explore MedAI";
  const badge = isFa ? "دستیار سلامت مبتنی بر هوش مصنوعی" : isDe ? "KI-gestützter Gesundheitsassistent" : "AI-Powered Health Assistant";
  const disclaimer = isFa
    ? "مد‌ای‌آی جایگزین پزشک نیست. پاسخ‌ها جنبه اطلاع‌رسانی دارند."
    : isDe
      ? "MedAI ist kein Ersatz für einen Arzt. Antworten dienen der Information."
      : "MedAI is not a replacement for a doctor. Responses are for informational purposes.";

  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12"
      onMouseMove={handleMouseMove}
    >
      {/* Cinematic background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(24,224,196,0.09)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(91,140,255,0.07)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-grid opacity-[0.025]" />
      <motion.div
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-text-secondary">{badge}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
            >
              <span className="text-white">{title1}</span>
              <br />
              <span className="gradient-text">{title2}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="text-text-secondary text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.36 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8"
            >
              <Link href="/ai">
                <Button size="lg" className="gap-2 group">
                  {ctaPrimary}
                  <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-0.5 ${isFa ? "rotate-180 group-hover:-translate-x-0.5" : ""}`} />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  {ctaSecondary}
                </Button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="flex items-center gap-2 justify-center lg:justify-start text-xs text-muted"
            >
              <Shield className="w-3.5 h-3.5" />
              {disclaimer}
            </motion.p>
          </div>

          {/* Right: AI Health Core */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ perspective: 1000 }}
            className="relative h-[420px] sm:h-[480px] flex items-center justify-center"
          >
            <motion.div style={{ rotateX, rotateY }} className="relative w-full h-full flex items-center justify-center">
              <AIHealthCore isFa={isFa} isDe={isDe} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AIHealthCore({ isFa, isDe }: { isFa: boolean; isDe: boolean }) {
  const floatingCards = [
    {
      icon: HeartPulse,
      title: isFa ? "ضربان قلب" : isDe ? "Herzfrequenz" : "Heart Rate",
      value: "72 BPM",
      color: "text-danger",
      pos: "top-2 -left-2 sm:-left-8",
      delay: 0,
    },
    {
      icon: Activity,
      title: isFa ? "وضعیت AI" : isDe ? "KI-Status" : "AI Status",
      value: isFa ? "در حال تحلیل..." : isDe ? "Analysiert..." : "Analyzing...",
      color: "text-primary",
      pos: "top-6 -right-2 sm:-right-10",
      delay: 0.6,
    },
    {
      icon: Sparkles,
      title: isFa ? "نمای سلامت" : isDe ? "Gesundheitsübersicht" : "Health Overview",
      value: isFa ? "پایدار" : isDe ? "Stabil" : "Stable",
      color: "text-success",
      pos: "bottom-4 -left-4 sm:-left-12",
      delay: 1.2,
    },
  ];

  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
      {/* Ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 orb rounded-full"
      />

      {/* Translucent rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [0.75 + i * 0.1, 1.2 + i * 0.15, 0.75 + i * 0.1], opacity: [0.25, 0, 0.25] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: i % 2 === 0 ? "rgba(24,224,196,0.25)" : "rgba(91,140,255,0.2)" }}
        />
      ))}

      {/* Core orb with ECG */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full glass-strong flex items-center justify-center glow-primary-strong"
      >
        <svg viewBox="0 0 200 60" className="w-28 sm:w-32 opacity-90" fill="none">
          <path
            d="M0 30 L40 30 L52 8 L64 52 L76 30 L88 18 L96 30 L200 30"
            stroke="url(#ecgGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ecg-line"
          />
          <defs>
            <linearGradient id="ecgGradient" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#18E0C4" />
              <stop offset="1" stopColor="#5B8CFF" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute w-2.5 h-2.5 rounded-full bg-primary-bright shadow-[0_0_12px_4px_rgba(47,255,240,0.6)]" />
      </motion.div>

      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/60"
          style={{
            left: `${20 + i * 12}%`,
            top: `${15 + (i % 3) * 30}%`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [0, -20, -40],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Floating health cards */}
      {floatingCards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
            transition={{
              opacity: { delay: card.delay + 0.6, duration: 0.5 },
              scale: { delay: card.delay + 0.6, duration: 0.5 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: card.delay },
            }}
            className={`absolute ${card.pos} glass rounded-xl px-3 py-2.5 hidden sm:flex items-center gap-2.5 shadow-lg`}
          >
            <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${card.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-muted leading-none mb-1">{card.title}</p>
              <p className="text-xs font-semibold text-white leading-none">{card.value}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
