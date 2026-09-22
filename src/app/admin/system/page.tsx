"use client";
import { Settings, ToggleLeft } from "lucide-react";
import { useState } from "react";

const flags = [
  { key: "maintenance_mode", label: "حالت تعمیر", desc: "دسترسی عمومی به سایت غیرفعال شود.", enabled: false },
  { key: "ai_enabled", label: "AI فعال", desc: "درخواست‌های AI پردازش شوند.", enabled: true },
  { key: "registration_open", label: "ثبت‌نام باز", desc: "کاربران جدید بتوانند ثبت‌نام کنند.", enabled: true },
  { key: "voice_input", label: "ورودی صدا", desc: "قابلیت ورودی صدا در چت.", enabled: false },
  { key: "file_upload", label: "آپلود فایل", desc: "آپلود فایل در آزمایش و چت.", enabled: false },
  { key: "doctor_connect", label: "اتصال به پزشک", desc: "نمایش بخش اتصال به پزشک.", enabled: false },
];

export default function AdminSystemPage() {
  const [ff, setFf] = useState(flags);
  function toggle(i: number) {
    setFf((p) => p.map((f, idx) => idx === i ? { ...f, enabled: !f.enabled } : f));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">تنظیمات سیستم</h1>
        <p className="text-text-secondary text-sm">پیکربندی سرویس، Feature Flagها و APIها.</p>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <ToggleLeft className="w-5 h-5 text-primary" />
          Feature Flags
        </h2>
        <div className="space-y-3">
          {ff.map((f, i) => (
            <div key={f.key} className="flex items-center justify-between p-4 rounded-xl bg-bg-secondary border border-border">
              <div>
                <p className="font-medium text-white text-sm">{f.label}</p>
                <p className="text-xs text-text-secondary">{f.desc}</p>
              </div>
              <button
                onClick={() => toggle(i)}
                className={`w-11 h-6 rounded-full transition-colors relative ${f.enabled ? "bg-primary" : "bg-border"}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${f.enabled ? "left-0.5" : ""}`}
                  style={{ right: f.enabled ? "auto" : "2px", left: f.enabled ? "2px" : "auto" }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-secondary" />
          پیکربندی AI
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Primary Provider</label>
            <select className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 text-sm">
              <option>OpenAI (gpt-4o)</option>
              <option>Anthropic Claude 3.5</option>
              <option>Gemini Pro</option>
              <option>Mock (development)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Embedding Model</label>
            <select className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 text-sm">
              <option>text-embedding-3-small</option>
              <option>text-embedding-3-large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
