"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-primary to-primary-bright text-black font-semibold hover:shadow-[0_0_30px_rgba(22,217,197,0.4)] hover:brightness-110",
  secondary: "bg-secondary text-white font-semibold hover:brightness-110 hover:shadow-[0_0_30px_rgba(91,140,255,0.3)]",
  ghost: "bg-transparent text-text-secondary hover:text-white hover:bg-white/5 border border-transparent",
  danger: "bg-danger text-white font-semibold hover:brightness-110 hover:shadow-[0_0_30px_rgba(255,77,90,0.3)]",
  outline: "bg-transparent border border-border text-text-secondary hover:text-white hover:border-primary/50 hover:bg-primary/5",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-base rounded-xl gap-2",
  lg: "px-7 py-3.5 text-lg rounded-2xl gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading = false, fullWidth = false, className = "", children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center transition-all duration-200 select-none ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
        {...(props as any)}
      >
        {loading && (
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
