export const metadata = { title: "شرایط استفاده" };

const sections = [
  { title: "۱. پذیرش شرایط", body: "با استفاده از مد‌ای‌آی شما این شرایط را می‌پذیرید. اگر با شرایط موافق نیستید، لطفاً از سرویس استفاده نکنید." },
  { title: "۲. ماهیت سرویس", body: "مد‌ای‌آی یک ابزار اطلاع‌رسانی و آموزشی است. این سرویس جایگزین تشخیص، درمان یا مشاوره پزشکی حرفه‌ای نیست. همیشه در موارد سلامت با پزشک واجد شرایط مشورت کنید. ما پزشک نیستیم." },
  { title: "۳. ممنوعیت استفاده", body: "شما نباید از این سرویس در شرایط اورژانسی استفاده کنید. در مواقع اورژانسی با شماره‌های اضطراری (۱۱۵ در ایران، ۹۱۱/۱۱۲ در سایر کشورها) تماس بگیرید." },
  { title: "۴. حریم خصوصی", body: "استفاده شما تابع سیاست حریم خصوصی ما نیز هست که به صورت جداگانه منتشر شده است." },
  { title: "۵. محدودیت مسئولیت", body: "ما تضمین نمی‌کنیم که اطلاعات ارائه شده کاملاً دقیق یا کامل باشند. استفاده شما از این سرویس به عهده خود شماست. ما در قبال تصمیماتی که بر اساس اطلاعات این سرویس می‌گیرید، مسئولیتی نداریم." },
  { title: "۶. حساب کاربری", body: "شما مسئول حفاظت از اطلاعات حساب خود هستید. ما این حق را داریم که در صورت مشاهده استفاده نادرست، حساب را معلق یا حذف کنیم." },
  { title: "۷. تغییرات", body: "ممکن است در آینده این شرایط را به‌روزرسانی کنیم. تغییرات در همین صفحه منتشر می‌شوند." },
];

export default function TermsPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">شرایط استفاده</h1>
          <p className="text-text-secondary">آخرین به‌روزرسانی: ۲۰۲۶</p>
        </div>

        <div className="glass rounded-3xl p-8 space-y-6">
          <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30">
            <p className="text-sm text-white leading-relaxed">
              <strong className="text-danger">هشدار مهم:</strong> مد‌ای‌آی <em>جایگزین پزشک نیست</em>.
              این سرویس فقط برای اهداف اطلاع‌رسانی است. در موارد فوری با اورژانس تماس بگیرید.
            </p>
          </div>

          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-lg font-semibold text-white mb-2">{s.title}</h2>
              <p className="text-sm text-text-secondary leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
