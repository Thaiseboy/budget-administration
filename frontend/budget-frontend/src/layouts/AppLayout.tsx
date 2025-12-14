import AppHeader from "./AppHeader";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
    <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}