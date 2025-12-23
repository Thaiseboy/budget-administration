import AppHeader from "./AppHeader";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <AppHeader />
      <EmailVerificationBanner />
      <main className="mx-auto w-full max-w-5xl px-4 py-4 sm:py-6">{children}</main>
    </div>
  );
}
