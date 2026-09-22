"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(91,140,255,0.05)_0%,transparent_60%)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 glow-secondary">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center">
                <Activity className="w-6 h-6 text-black" strokeWidth={2.5} />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">ایجاد حساب کاربری</h1>
            <p className="text-text-secondary text-sm">به مد‌ای‌آی بپیوندید</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">نام کامل</label>
              <div className="relative">
                <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 pr-10 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition"
                  placeholder="نام و نام خانوادگی"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">ایمیل</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 pr-10 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition"
                  placeholder="your@email.com"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">رمز عبور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 pr-10 pl-10 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition"
                  placeholder="حداقل ۸ کاراکتر"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">تکرار رمز عبور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                <input
                  type={showPass ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 pr-10 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition"
                  placeholder="رمز عبور را تکرار کنید"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input type="checkbox" required id="terms" className="mt-1 accent-primary" />
              <label htmlFor="terms" className="text-xs text-text-secondary leading-relaxed">
                با{" "}
                <Link href="/terms" className="text-primary hover:underline">شرایط استفاده</Link>
                {" "}و{" "}
                <Link href="/privacy" className="text-primary hover:underline">حریم خصوصی</Link>
                {" "}مد‌ای‌آی موافقم.
              </label>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading} disabled={loading} className="mt-2">
              {loading ? "در حال ایجاد حساب..." : "ایجاد حساب"}
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            قبلاً حساب دارید؟{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              وارد شوید
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
