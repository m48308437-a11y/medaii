"use client";

import { useState } from "react";
import { Bell, Send, Users, Clock, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

const history = [
  { title: "به‌روزرسانی جدید: دفترچه سلامت", audience: "همه کاربران", sent: "۱۴۰۴/۱۰/۲۵", status: "ارسال‌شده", reach: 2847 },
  { title: "یادآوری تکمیل پروفایل سلامت", audience: "کاربران فعال", sent: "۱۴۰۴/۱۰/۱۸", status: "ارسال‌شده", reach: 892 },
  { title: "نگهداری برنامه‌ریزی‌شده سرور", audience: "همه کاربران", sent: "۱۴۰۴/۱۰/۱۰", status: "ارسال‌شده", reach: 2790 },
];

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">مرکز اعلان‌ها</h1>
        <p className="text-text-secondary text-sm">ارسال اعلان به کاربران و مشاهده تاریخچه.</p>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Send className="w-4 h-4 text-primary" />
            ساخت اعلان جدید
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">عنوان</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان اعلان"
                className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-2.5 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">پیام</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="متن اعلان..."
                className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 resize-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">مخاطبان</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 text-sm"
              >
                <option value="all">همه کاربران</option>
                <option value="active">کاربران فعال (۷ روز اخیر)</option>
                <option value="suspended">کاربران معلق</option>
                <option value="admins">فقط مدیران</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" fullWidth className="gap-2">
                <Eye className="w-4 h-4" /> پیش‌نمایش
              </Button>
              <Button fullWidth className="gap-2">
                <Send className="w-4 h-4" /> ارسال اعلان
              </Button>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-warning" />
            پیش‌نمایش زنده
          </h2>
          <div className="p-4 rounded-xl bg-bg-secondary border border-border">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title || "عنوان اعلان"}</p>
                <p className="text-xs text-text-secondary mt-1">{message || "متن پیام شما اینجا نمایش داده می‌شود."}</p>
                <p className="text-[10px] text-muted mt-2 flex items-center gap-1"><Users className="w-3 h-3" />{audience === "all" ? "همه کاربران" : audience}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-white text-sm">تاریخچه اعلان‌ها</h2>
        </div>
        <div className="divide-y divide-border">
          {history.map((h, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{h.title}</p>
                <p className="text-xs text-muted flex items-center gap-1"><Clock className="w-3 h-3" />{h.sent} • {h.audience} • {h.reach.toLocaleString()} گیرنده</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/30">{h.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
