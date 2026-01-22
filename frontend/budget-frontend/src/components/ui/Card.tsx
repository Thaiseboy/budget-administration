import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "muted" | "elevated";
};

const variantClasses: Record<NonNullable<Props["variant"]>, string> = {
  default: "border border-slate-700 bg-slate-800",
  outline: "border border-slate-700 bg-transparent",
  muted: "border border-slate-800 bg-slate-900/40",
  elevated: "border border-slate-700 bg-slate-800 shadow-lg shadow-slate-900/40",
};

export default function Card({ children, className = "", variant = "default" }: Props) {
  return (
    <div className={`rounded-xl ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}
