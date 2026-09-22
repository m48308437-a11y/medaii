import Link from "next/link";
import { Activity, Heart } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export function Footer({ locale }: { locale: Locale }) {
  const isFa = locale === "fa";
  const isDe = locale === "de";
  const year = new Date().getFullYear();

  const columns = [
    {
      title: isFa ? "محصول" : isDe ? "Produkt" : "Product",
      links: [
        { label: isFa ? "گفت‌وگو" : isDe ? "Chat" : "AI Chat", href: "/ai" },
        { label: isFa ? "بررسی علائم" : isDe ? "Symptomprüfung" : "Symptom Checker", href: "/symptom-checker" },
        { label: isFa ? "تحلیل آزمایش" : isDe ? "Laboranalyse" : "Lab Analyzer", href: "/lab-analyzer" },
        { label: isFa ? "داروها" : isDe ? "Medikamente" : "Medications", href: "/medications" },
        { label: isFa ? "دفترچه سلامت" : isDe ? "Gesundheitstagebuch" : "Health Journal", href: "/health-journal" },
        { label: isFa ? "آماده‌سازی ویزیت" : isDe ? "Arztvorbereitung" : "Doctor Prep", href: "/doctor-preparation" },
      ],
    },
    {
      title: isFa ? "شرکت" : isDe ? "Unternehmen" : "Company",
      links: [
        { label: isFa ? "درباره ما" : isDe ? "Über uns" : "About", href: "/about" },
        { label: isFa ? "حریم خصوصی" : isDe ? "Datenschutz" : "Privacy", href: "/privacy" },
        { label: isFa ? "شرایط استفاده" : isDe ? "Nutzungsbedingungen" : "Terms", href: "/terms" },
      ],
    },
    {
      title: isFa ? "حساب کاربری" : isDe ? "Konto" : "Account",
      links: [
        { label: isFa ? "ورود" : isDe ? "Anmelden" : "Login", href: "/login" },
        { label: isFa ? "ثبت‌نام" : isDe ? "Registrieren" : "Sign Up", href: "/register" },
        { label: isFa ? "داشبورد" : isDe ? "Dashboard" : "Dashboard", href: "/dashboard" },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-border bg-bg-secondary/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Activity className="w-5 h-5 text-black" strokeWidth={2.5} />
              </div>
              <span className="text-white font-bold text-xl">
                Med<span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm mb-4">
              {isFa
                ? "مد‌ای‌آی دستیار هوشمند سلامت شماست. ما به شما کمک می‌کنیم اطلاعات بهتری درباره سلامت خود داشته باشید — با احترام به حریم خصوصی شما."
                : isDe
                  ? "MedAI ist Ihr intelligenter Gesundheitsassistent. Wir helfen Ihnen, bessere Gesundheitsinformationen zu erhalten – unter Wahrung Ihrer Privatsphäre."
                  : "MedAI is your intelligent health assistant. We help you get better health information — with respect for your privacy."}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-muted">
              {isFa ? "ساخته شده با" : isDe ? "Erstellt mit" : "Built with"}
              <Heart className="w-3 h-3 text-danger fill-danger" />
              {isFa ? "برای سلامت همه" : isDe ? "für die Gesundheit aller" : "for universal health"}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            © {year} MedAI. {isFa ? "تمامی حقوق محفوظ است." : isDe ? "Alle Rechte vorbehalten." : "All rights reserved."}
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-muted hover:text-text-secondary transition">{isFa ? "حریم خصوصی" : "Privacy"}</Link>
            <Link href="/terms" className="text-xs text-muted hover:text-text-secondary transition">{isFa ? "شرایط" : "Terms"}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
