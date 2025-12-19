import { createContext, ReactNode, useContext, useState } from "react";

type ConfirmOptions = {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "danger";
};

type ConfirmState = {
    open: boolean;
    options: Required<ConfirmOptions>;
    resolve?: (value: boolean) => void;
};

type ConfirmContextValue = (options?: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

const DEFAULT_OPTIONS: Required<ConfirmOptions> = {
    title: "Are you sure?",
    message: "Please confirm your action.",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "default",
};

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ConfirmState>({
        open: false,
        options: DEFAULT_OPTIONS,
    });

    const confirm: ConfirmContextValue = (options) => {
        return new Promise<boolean>((resolve) => {
            setState({
                open: true,
                options: { ...DEFAULT_OPTIONS, ...(options ?? {}) },
                resolve,
            });
        });
    };

    function close(result: boolean) {
        state.resolve?.(result);
        setState((prev) => ({ ...prev, open: false, resolve: undefined }));
    }

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}

            {state.open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    role="dialog"
                    aria-modal="true">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40"
                        aria-label="Close dialog"
                        onClick={() => close(false)}/>

                    <div className="relative z-10 w-full max-w-md rounded-2xl bg-slate-800 shadow-xl border border-slate-700">
                        <div className="p-5">
                            <h2 className="text-base font-semibold text-white">{state.options.title}</h2>
                            <p className="mt-2 text-sm text-slate-300">
                                {state.options.message}
                            </p>

                            <div className="mt-5 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => close(false)}
                                    className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
                                    {state.options.cancelText}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => close(true)}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${state.options.variant === "danger"
                                            ? "bg-red-600 hover:bg-red-700"
                                            : "bg-slate-700 hover:bg-slate-600"
                                        }`}>
                                    {state.options.confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
    return ctx;
}