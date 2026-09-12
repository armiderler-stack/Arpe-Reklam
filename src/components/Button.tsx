"use client";

import { useFormStatus } from "react-dom";
import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
}

const variants: Record<string, string> = {
  primary: "bg-accent text-white hover:bg-accent-dark",
  secondary: "bg-panel text-ink border border-line hover:border-ink",
  ghost: "text-ink hover:bg-black/5",
  danger: "text-danger hover:bg-danger/10",
};

export default function Button({
  variant = "primary",
  fullWidth,
  className = "",
  children,
  disabled,
  ...props
}: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      {...props}
      disabled={disabled || pending}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        variants[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {pending ? "İşleniyor…" : children}
    </button>
  );
}
