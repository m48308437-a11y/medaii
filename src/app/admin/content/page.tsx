"use client";
import { FileText, Plus, Eye, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const articles = [
  { title: "سردرد تنشی: دلایل و درمان خانگی", category: "علائم شایع", status: "منتشر شده", author: "تیم محتوای پزشکی", date: "۱۴۰۴/۱۰/۲۰" },
  { title: "چطور نتیجه آزمایش خون را بخوانیم؟", category: "آزمایش", status: "منتشر شده", author: "دکتر رضایی", date: "۱۴۰۴/۱۰/۱۵" },
  { title: "تب در کودکان: چه زمانی نگران باشیم؟", category: "اطفال", status: "پیش‌نویس", author: "تیم محتوا", date: "۱۴۰۴/۱۰/۲۸" },
  { title: "تداخلات دارویی رایج که باید بدانید", category: "داروها", status: "بازبینی", author: "دکتر احمدی", date: "۱۴۰۴/۱۰/۲۵" },
];

const faqs = [
  { q: "آیا مد‌ای‌آی پزشک است؟", cat: "عمومی" },
  { q: "چگونه داده‌های من محافظت می‌شوند؟", cat: "حریم خصوصی" },
  { q: "آیا می‌توانم به پاسخ‌ها اعتماد کنم؟", cat: "عمومی" },
];

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">مدیریت محتوا</h1>
          <p className="text-text-secondary text-sm">مقالات، FAQ و دسته‌بندی‌های پزشکی.</p>
        </div>
        <Button size="sm" className="gap-2"><Plus className="w-4 h-4" />مقاله جدید</Button>
      </div>

      <div className="grid md:grid-cols-[2fr_1fr] gap-6">
        <div className="glass rounded-2xl">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-white text-sm">مقالات</h2>
          </div>
          <div className="divide-y divide-border">
            {articles.map((a, i) => (
              <div key={i} className="p-4 flex items-center gap-3 hover:bg-white/[0.02] transition">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{a.title}</p>
                  <p className="text-xs text-muted">{a.category} • {a.author} • {a.date}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  a.status === "منتشر شده" ? "text-success bg-success/10 border-success/30" :
                  a.status === "بازبینی" ? "text-warning bg-warning/10 border-warning/30" :
                  "text-muted bg-white/5 border-border"
                }`}>
                  {a.status}
                </span>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-lg text-muted hover:text-primary hover:bg-primary/10"><Eye className="w-4 h-4 mx-auto" /></button>
                  <button className="w-8 h-8 rounded-lg text-muted hover:text-white hover:bg-white/5"><Edit3 className="w-4 h-4 mx-auto" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-white text-sm">سؤالات متداول</h2>
          </div>
          <div className="divide-y divide-border">
            {faqs.map((f, i) => (
              <div key={i} className="p-4">
                <p className="text-sm text-white mb-1">{f.q}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-border text-muted">{f.cat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
