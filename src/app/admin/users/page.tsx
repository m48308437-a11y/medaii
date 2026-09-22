"use client";

import { useState } from "react";
import { Search, MoreHorizontal, UserCheck, UserX, Mail, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";

const mockUsers = [
  { id: 1, name: "علی رضایی", email: "ali@example.com", role: "user", status: "active", joined: "۱۴۰۴/۱۰/۰۲", consults: 12 },
  { id: 2, name: "مریم احمدی", email: "maryam@example.com", role: "user", status: "active", joined: "۱۴۰۴/۰۹/۲۸", consults: 5 },
  { id: 3, name: "مدیر ارشد", email: "admin@medai.app", role: "super_admin", status: "active", joined: "۱۴۰۴/۰۱/۰۱", consults: 0 },
  { id: 4, name: "حسین کریمی", email: "hossein@example.com", role: "user", status: "suspended", joined: "۱۴۰۴/۰۸/۱۵", consults: 42 },
  { id: 5, name: "سارا محمدی", email: "sara@example.com", role: "admin", status: "active", joined: "۱۴۰۴/۰۶/۱۰", consults: 8 },
];

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const filtered = mockUsers.filter((u) => u.name.includes(q) || u.email.includes(q) || u.role.includes(q));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">مدیریت کاربران</h1>
          <p className="text-text-secondary text-sm">لیست و مدیریت کاربران پلتفرم.</p>
        </div>
        <Button size="sm">کاربر جدید</Button>
      </div>

      <div className="glass rounded-2xl">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جستجو بر اساس نام، ایمیل یا نقش..."
              className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-2.5 pr-10 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted uppercase">
                <th className="text-right p-4">کاربر</th>
                <th className="text-right p-4 hidden md:table-cell">نقش</th>
                <th className="text-right p-4 hidden sm:table-cell">گفت‌وگوها</th>
                <th className="text-right p-4 hidden lg:table-cell">تاریخ عضویت</th>
                <th className="text-right p-4">وضعیت</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-border hover:bg-white/[0.02] transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full gradient-primary/20 border border-primary/30 flex items-center justify-center text-primary font-semibold text-xs">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-white">{u.name}</p>
                        <p className="text-xs text-muted flex items-center gap-1"><Mail className="w-3 h-3" />{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                      u.role === "super_admin" ? "bg-danger/10 text-danger border-danger/30" :
                      u.role === "admin" ? "bg-primary/10 text-primary border-primary/30" :
                      "bg-white/5 text-text-secondary border-border"
                    }`}>
                      <Shield className="w-2.5 h-2.5 inline mr-1" />
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 hidden sm:table-cell text-text-secondary">{u.consults}</td>
                  <td className="p-4 hidden lg:table-cell text-text-secondary text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />{u.joined}
                  </td>
                  <td className="p-4">
                    {u.status === "active" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-success">
                        <UserCheck className="w-3 h-3" /> فعال
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-danger">
                        <UserX className="w-3 h-3" /> معلق
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <button className="w-8 h-8 rounded-lg text-muted hover:text-white hover:bg-white/5">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
