"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  offline?: boolean;
}

export function ErrorState({ title, description, onRetry, offline }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-12 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4">
        {offline ? <WifiOff className="w-7 h-7 text-danger" /> : <AlertTriangle className="w-7 h-7 text-danger" />}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        {title || (offline ? "اتصال اینترنت برقرار نیست" : "مشکلی پیش آمد")}
      </h3>
      <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto leading-relaxed">
        {description || "متاسفانه نتوانستیم درخواست شما را کامل کنیم. لطفاً دوباره تلاش کنید."}
      </p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} className="gap-2">
          <RotateCcw className="w-3.5 h-3.5" />
          تلاش مجدد
        </Button>
      )}
    </motion.div>
  );
}
