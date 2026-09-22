"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Mic,
  Plus,
  History,
  Bookmark,
  Settings as SettingsIcon,
  AlertTriangle,
  Activity,
  User as UserIcon,
  Loader2,
  ExternalLink,
  X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface ChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ title: string; url?: string; author?: string; snippet?: string }>;
  riskLevel?: "low" | "medium" | "high" | "critical";
  disclaimer?: string;
}

const QUICK_PROMPTS_FA = [
  "سردرد خفیف دارم، طبیعیه؟",
  "نتیجه آزمایش قندم ۱۱۰ هست یعنی چی؟",
  "عوارض رایج ایبوپروفن چیست؟",
  "چطور بفهمم گلودرم ویروسیه یا باکتریایی؟",
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [urgentAlert, setUrgentAlert] = useState<{ content: string; recommendation: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Welcome message
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "سلام! 👋 من دستیار هوشمند سلامت مد‌ای‌آی هستم.\n\nمن می‌توانم در درک علائم، تحلیل نتایج آزمایش، اطلاعات داروها و پرسش‌های کلی پزشکی کمکتان کنم.\n\n⚠️ یادتان باشد: من جایگزین پزشک نیستم. در موارد اورژانسی با ۱۱۵ تماس بگیرید.\n\nچه سوالی دارید؟",
      },
    ]);
  }, []);

  async function handleSubmit(e?: React.FormEvent, overrideText?: string) {
    e?.preventDefault();
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setUrgentAlert(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          consultationId,
          locale: "fa",
        }),
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (data.consultationId) setConsultationId(data.consultationId);

      const aiMsg: ChatMessage = {
        role: "assistant",
        content: data.response.content,
        sources: data.response.sources,
        riskLevel: data.response.riskLevel,
        disclaimer: data.response.disclaimer,
      };
      setMessages((prev) => [...prev, aiMsg]);

      if (data.response.riskLevel === "critical") {
        setUrgentAlert({
          content: data.response.content,
          recommendation: data.response.recommendation || "",
        });
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "متأسفانه در دریافت پاسخ مشکلی پیش آمد. لطفاً دوباره تلاش کنید یا اتصال اینترنت خود را بررسی کنید.",
        },
      ]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function startNewChat() {
    setMessages([
      {
        role: "assistant",
        content: "گفت‌وگوی جدید شروع شد. چه سوالی دارید؟",
      },
    ]);
    setConsultationId(null);
    setSidebarOpen(false);
    setUrgentAlert(null);
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        } fixed lg:static inset-y-0 right-0 lg:right-auto top-[64px] lg:top-auto w-72 bg-bg-secondary/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none border-l lg:border-l-0 lg:border-r border-border z-30 transition-transform duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-border">
          <Button variant="primary" fullWidth size="md" className="gap-2" onClick={startNewChat}>
            <Plus className="w-4 h-4" />
            گفت‌وگوی جدید
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <SidebarSection icon={History} title="تاریخچه" />
          <div className="space-y-1 mb-6">
            {[1, 2, 3].map((i) => (
              <button
                key={i}
                className="w-full text-start px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5 transition flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                {i === 1 ? "سردرد و علائم مرتبط" : i === 2 ? "تحلیل آزمایش خون" : "سؤال درباره استامینوفن"}
              </button>
            ))}
          </div>

          <SidebarSection icon={Bookmark} title="ذخیره شده" />
          <SidebarSection icon={SettingsIcon} title="تنظیمات" />
        </div>

        <div className="p-3 border-t border-border">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/5 transition text-sm">
            بازگشت به خانه
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-sm">دستیار هوشمند مد‌ای‌آی</h2>
              <p className="text-xs text-muted flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                آنلاین • پاسخ‌های شما رمزگذاری می‌شوند
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5"
          >
            <History className="w-5 h-5" />
          </button>
        </div>

        {/* Urgent alert banner */}
        <AnimatePresence>
          {urgentAlert && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-danger/10 border-b border-danger/30 overflow-hidden"
            >
              <div className="px-4 lg:px-8 py-4 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-danger flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-danger mb-1">توجه: نیاز به ارزیابی فوری پزشکی</h3>
                  <p className="text-sm text-white/90 leading-relaxed">{urgentAlert.content}</p>
                  <p className="text-sm text-danger/90 mt-2 font-medium">{urgentAlert.recommendation}</p>
                </div>
                <button onClick={() => setUrgentAlert(null)} className="text-white/60 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}

            {isLoading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full gradient-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-md px-5 py-4">
                  <div className="flex gap-1.5 items-center h-5">
                    <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
                    <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
                    <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
                  </div>
                </div>
              </motion.div>
            )}

            {messages.length === 1 && !isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {QUICK_PROMPTS_FA.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSubmit(undefined, prompt)}
                    className="text-start p-3 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 text-sm text-text-secondary hover:text-white transition text-right"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-border p-4 lg:p-6 bg-bg-secondary/30">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative glass rounded-2xl p-2 focus-within:border-primary/40 transition-colors">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
                }}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="سؤال پزشکی خود را بپرسید..."
                className="w-full bg-transparent text-white placeholder:text-muted resize-none px-3 py-2 pr-14 outline-none text-sm leading-relaxed max-h-[200px]"
              />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button type="button" className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-white hover:bg-white/5 transition" aria-label="Attach">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button type="button" className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-white hover:bg-white/5 transition" aria-label="Voice">
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || isLoading}
                  className="gap-1.5 w-9 h-9 !p-0 rounded-lg"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rotate-180" />}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted text-center mt-2">
              ⚠️ مد‌ای‌آی جایگزین پزشک نیست. در شرایط اورژانسی با ۱۱۵ تماس بگیرید.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function SidebarSection({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted font-semibold uppercase tracking-wider">
      <Icon className="w-3.5 h-3.5" />
      {title}
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? "bg-secondary/20 border border-secondary/40"
            : "gradient-primary/20 border border-primary/40"
        }`}
      >
        {isUser ? (
          <UserIcon className="w-4 h-4 text-secondary" />
        ) : (
          <Activity className="w-4 h-4 text-primary" />
        )}
      </div>

      <div className={`max-w-[85%] sm:max-w-[75%] ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-secondary/20 border border-secondary/30 text-white rounded-tr-md"
              : "bg-card border border-border text-text rounded-tl-md"
          }`}
        >
          {message.content.split(/(\*\*[^*]+\*\*|__[^_]+__)/g).map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={i} className="text-white font-semibold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 space-y-1">
            <p className="text-xs text-muted flex items-center gap-1">
              <Bookmark className="w-3 h-3" /> منابع:
            </p>
            {message.sources.map((s, i) => (
              <a
                key={i}
                href={s.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <span>{s.title}</span>
                {s.url && <ExternalLink className="w-3 h-3 inline" />}
              </a>
            ))}
          </div>
        )}

        {!isUser && message.disclaimer && (
          <p className="mt-2 text-[11px] text-muted leading-relaxed">
            {message.disclaimer}
          </p>
        )}
      </div>
    </motion.div>
  );
}
