import { Activity, Shield, Heart, Zap, Lock, Users } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "درباره مد‌ای‌آی" };

const values = [
  { icon: Shield, title: "ایمنی اول", desc: "هر پاسخ قبل از نمایش از لایه ایمنی مستقل عبور می‌کند. در شرایط هشدار، شما مستقیماً به خدمات پزشکی هدایت می‌شوید." },
  { icon: Lock, title: "حریم خصوصی", desc: "داده‌های سلامت شما با رمزنگاری قوی محافظت می‌شوند. ما اطلاعات شما را نمی‌فروشیم." },
  { icon: Heart, title: "طراحی انسانی", desc: "رابط کاربری ساده، شفاف و بدون استرس — در لحظاتی که به اطلاعات نیاز دارید." },
  { icon: Zap, title: "سریع و دقیق", desc: "پاسخ‌های فوری، مبتنی بر منابع معتبر پزشکی، با ذکر منبع." },
];

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/20 mb-4">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs text-text-secondary">درباره ما</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            درباره <span className="gradient-text">مد‌ای‌آی</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            ما در حال ساخت یک دستیار هوشمند سلامت هستیم که به افراد کمک می‌کند تصمیمات بهتری درباره سلامت خود بگیرند —
            با احترام به حریم خصوصی، با تأکید بر ایمنی، و بدون هیچ ادعای گزاف.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-16">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="glass rounded-2xl p-6 card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="glass rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">مد‌ای‌آی یک پزشک نیست</h2>
          <p className="text-text-secondary leading-relaxed mb-6 max-w-xl mx-auto">
            ما یک ابزار اطلاع‌رسانی و آموزشی هستیم. در موارد اورژانسی همیشه با شماره‌های اضطراری (۱۱۵) تماس بگیرید یا
            به نزدیک‌ترین مرکز درمانی مراجعه کنید.
          </p>
          <Link href="/ai" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-black font-semibold">
            گفت‌وگو را شروع کنید
          </Link>
        </div>
      </div>
    </div>
  );
}
