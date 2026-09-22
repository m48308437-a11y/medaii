"use client";
import { ScrollText, Search } from "lucide-react";

const logs = [
  { action: "user.login", entity: "user", entityId: "u_a3f2", user: "u_a3f2", ip: "192.168.1.45", time: "۱۴۰۴/۱۰/۲۸ ۱۴:۳۲:۰۱" },
  { action: "consultation.create", entity: "consultation", entityId: "c_18ab", user: "u_a3f2", ip: "192.168.1.45", time: "۱۴۰۴/۱۰/۲۸ ۱۴:۳۳:۲۰" },
  { action: "safety.event.critical", entity: "safety_event", entityId: "se_01", user: "u_a3f2", ip: "192.168.1.45", time: "۱۴۰۴/۱۰/۲۸ ۱۴:۳۳:۴۵" },
  { action: "admin.user.view", entity: "user", entityId: "u_b9c1", user: "u_admin", ip: "10.0.0.1", time: "۱۴۰۴/۱۰/۲۸ ۱۳:۱۰:۰۰" },
  { action: "auth.login_failed", entity: "user", entityId: "u_unknown", ip: "8.8.8.8", user: "anonymous", time: "۱۴۰۴/۱۰/۲۸ ۱۲:۴۵:۱۲" },
  { action: "user.update_profile", entity: "user", entityId: "u_b9c1", user: "u_b9c1", ip: "172.16.0.2", time: "۱۴۰۴/۱۰/۲۸ ۱۰:۱۵:۰۰" },
  { action: "source.create", entity: "medical_source", entityId: "src_12", user: "u_admin", ip: "10.0.0.1", time: "۱۴۰۴/۱۰/۲۷ ۱۸:۰۰:۰۰" },
];

const actionColors: Record<string, string> = {
  "user.login": "text-success",
  "safety.event.critical": "text-danger",
  "auth.login_failed": "text-warning",
  "source.create": "text-primary",
};

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">لاگ‌های حسابرسی</h1>
        <p className="text-text-secondary text-sm">ثبت تمام دسترسی‌ها و اقدامات حساس در سیستم.</p>
      </div>

      <div className="glass rounded-2xl">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              placeholder="جستجو در لاگ‌ها..."
              className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-2 pr-10 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted uppercase border-b border-border">
                <th className="text-right p-3">action</th>
                <th className="text-right p-3 hidden sm:table-cell">entity</th>
                <th className="text-right p-3 hidden md:table-cell">user</th>
                <th className="text-right p-3 hidden lg:table-cell">ip</th>
                <th className="text-right p-3">time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={i} className="border-b border-border last:border-b-0 hover:bg-white/[0.02]">
                  <td className="p-3 font-mono">
                    <span className={actionColors[l.action] || "text-text-secondary"}>{l.action}</span>
                  </td>
                  <td className="p-3 text-text-secondary hidden sm:table-cell">
                    <span className="font-mono">{l.entity}:{l.entityId}</span>
                  </td>
                  <td className="p-3 text-muted hidden md:table-cell font-mono">{l.user}</td>
                  <td className="p-3 text-muted hidden lg:table-cell font-mono">{l.ip}</td>
                  <td className="p-3 text-muted">{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
