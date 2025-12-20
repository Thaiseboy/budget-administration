import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: Props) {
  return (
    <div className={`rounded-xl border border-slate-700 bg-slate-800 ${className}`}>
      {children}
    </div>
  );
}
