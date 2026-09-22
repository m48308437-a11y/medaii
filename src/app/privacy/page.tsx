import { Shield, Lock, Eye, Trash2, UserCheck, Database } from "lucide-react";

export const metadata = { title: "حریم خصوصی" };

const sections = [
  { icon: Database, title: "چه داده‌هایی جمع‌آوری می‌کنیم", items: ["ایمیل (برای ایجاد حساب)", "گفت‌وگوهای شما با دستیار (در صورت ورود به حساب)", "اطلاعاتی که در پروفایل وارد می‌کنید", "اطلاعات فنی پایه برای امنیت و لاگ"] },
  { icon: Lock, title: "چگونه از داده‌های شما محافظت می‌کنیم", items: ["رمز عبور با الگوریتم bcrypt هش می‌شود", "نشست‌ها با JWT امضاشده مدیریت می‌شوند", "اتصال‌ها از طریق HTTPS رمزگذاری می‌شوند", "دسترسی‌ها به حداقل ممکن محدود شده است"] },
  { icon: Eye, title: "چه کسی به داده‌ها دسترسی دارد", items: ["شما به داده‌های خود دسترسی کامل دارید", "ادمین‌ها فقط در موارد پشتیبانی و با ثبت لاگ دسترسی محدود دارند", "ما داده‌ها را به اشخاص ثالث نمی‌فروشیم"] },
  { icon: Trash2, title: "حقوق شما", items: ["ویرایش اطلاعات شخصی", "دانلود داده‌های خود", "حذف کامل حساب و داده‌ها", "انصراف از اعلان‌ها"] },
  { icon: UserCheck, title: "شفافیت", items: ["همه دسترسی‌های حساس در لاگ حسابرسی ثبت می‌شوند", "شما می‌توانید در هر زمان درخواست گزارش دسترسی‌ها بدهید"] },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-success/20 mb-4">
            <Shield className="w-4 h-4 text-success" />
            <span className="text-xs text-text-secondary">حریم خصوصی</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">سیاست حریم خصوصی</h1>
          <p className="text-text-secondary">آخرین به‌روزرسانی: ۲۰۲۶</p>
        </div>

        <div className="glass rounded-3xl p-8 mb-6">
          <p className="text-text-secondary leading-relaxed">
            در مد‌ای‌آی ما باور داریم اطلاعات سلامت شما یکی از حساس‌ترین دارایی‌های شماست.
            ما با رعایت اصول حداقل داده، رمزنگاری، و شفافیت، با داده‌های شما رفتار می‌کنیم.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-success" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">{s.title}</h2>
                </div>
                <ul className="space-y-2 mr-14">
                  {s.items.map((item, j) => (
                    <li key={j} className="text-sm text-text-secondary leading-relaxed list-disc mr-4">{item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted text-center mt-8">
          برای سؤالات مربوط به حریم خصوصی با privacy@medai.app تماس بگیرید.
        </p>
      </div>
    </div>
  );
}
