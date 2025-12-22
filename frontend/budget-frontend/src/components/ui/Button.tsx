import type { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  active?: boolean;
  activeClassName?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled,
  className = "",
  type = "submit",
  active = false,
  activeClassName = "",
  ...props
}: ButtonProps) {
  const baseClass = "rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border-2 border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    ghost: "border-2 border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500",
    link: "text-blue-400 hover:text-blue-300 underline",
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-sm",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const combinedClassName = `${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className} ${active ? activeClassName : ""}`.trim();

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={combinedClassName}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
