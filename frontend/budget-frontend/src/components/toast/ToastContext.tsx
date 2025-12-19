import { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error";

type Toast = {
    id: number;
    message: string;
    type: ToastType;
};


type ToastContextValue = {
    success: (message: string) => void;
    error: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    function addToast(type: ToastType, message: string) {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message }]);

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

      <div className="fixed right-4 top-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg px-4 py-2 text-sm shadow-lg text-white
              ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
            {toast.message}
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