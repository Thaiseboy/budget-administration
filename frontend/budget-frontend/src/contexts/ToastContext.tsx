import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type ToastType = "success" | "error";

type Toast = {
    id: number;
    message: string;
    type: ToastType;
    isExiting?: boolean;
};


type ToastContextValue = {
    success: (message: string) => void;
    error: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function CheckIcon() {
    return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );
}

function ErrorIcon() {
    return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    function addToast(type: ToastType, message: string) {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message, isExiting: false }]);

        setTimeout(() => {
            setToasts((prev) =>
                prev.map((t) => t.id === id ? { ...t, isExiting: true } : t)
            );
        }, 2700);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }

    const value: ToastContextValue = {
        success: (msg) => addToast('success', msg),
        error: (msg) => addToast('error', msg),
    };

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed left-1/2 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex w-full items-center gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-sm transition-all duration-300
              ${toast.isExiting
                ? '-translate-y-2 scale-95 opacity-0'
                : 'translate-y-0 scale-100 opacity-100'
              }
              ${toast.type === "success"
                ? "border-emerald-700 bg-emerald-900/90 text-emerald-100"
                : "border-red-700 bg-red-900/90 text-red-100"
              }`}>
            <div className={`shrink-0 rounded-lg p-1 
            ${toast.type === "success" ? "bg-emerald-500 text-slate-100" : "bg-red-500 text-slate-100"}`}>
              {toast.type === "success" ? <CheckIcon /> : <ErrorIcon />}
            </div>
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return ctx;
}
