import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // If user is logged in, we could redirect; but for now let anyone see the landing
  // const user = await getCurrentUser();
  // if (user) redirect("/dashboard");

  return (
    <>
      <Hero locale="fa" />
      <Features locale="fa" />

      {/* Safety / Trust section */}
      <section className="relative py-24 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-primary text-sm font-semibold mb-3 tracking-wider uppercase">
                Safety First
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                طراحی شده با <span className="gradient-text">اولویت ایمنی</span>
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                مد‌ای‌آی هرگز خود را پزشک معرفی نمی‌کند. هر پاسخ همراه با هشدار است،
                و در صورت شناسایی علائم هشداردهنده، شما مستقیماً به خدمات پزشکی هدایت می‌شوید.
              </p>
              <ul className="space-y-3">
                {[
                  "لایه ایمنی مستقل از هوش مصنوعی",
                  "تشخیص خودکار شرایط اورژانسی",
                  "عدم تشخیص قطعی یا تجویز دارو",
                  "حریم خصوصی کامل و رمزنگاری داده‌ها",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-3xl p-8 glow-primary relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative space-y-4">
                <div className="p-4 rounded-xl bg-danger/10 border border-danger/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🚨</span>
                    <span className="font-semibold text-danger">اورژانسی</span>
                  </div>
                  <p className="text-sm text-white leading-relaxed">
                    در صورت تشخیص علائم مانند درد قفسه سینه، تنگی نفس، یا سکته، AI بدون تأخیر کاربر را به اورژانس هدایت می‌کند.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-warning/10 border border-warning/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">⚠️</span>
                    <span className="font-semibold text-warning">نیازمند مشورت</span>
                  </div>
                  <p className="text-sm text-white leading-relaxed">
                    در موارد پرخطر اما غیر اورژانسی، AI توصیه به مراجعه به پزشک می‌کند و پاسخ‌های آن با احتیاط همراه است.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-success/10 border border-success/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">✅</span>
                    <span className="font-semibold text-success">اطلاعات عمومی</span>
                  </div>
                  <p className="text-sm text-white leading-relaxed">
                    برای سؤالات عمومی، توضیحات آزمایش، و اطلاعات داروها، پاسخ‌های آموزشی شفاف ارائه می‌شود.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            سلامت خود را <span className="gradient-text">هوشمندانه‌تر</span> مدیریت کنید
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
            همین امروز گفت‌وگو با مد‌ای‌آی را شروع کنید. بدون نیاز به ثبت‌نام، به سادگی سؤال خود را بپرسید.
          </p>
          <a
            href="/ai"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl gradient-primary text-black font-semibold text-lg hover:shadow-[0_0_40px_rgba(22,217,197,0.4)] hover:brightness-110 transition-all"
          >
            شروع گفت‌وگوی رایگان
          </a>
        </div>
      </section>
    </>
  );
}
