import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui";
import { useTranslation } from "@/i18n";

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

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const { t } = useTranslation();
    const [state, setState] = useState<ConfirmState>({
        open: false,
        options: {
            title: t("areYouSure"),
            message: t("confirmActionMessage"),
            confirmText: t("confirm"),
            cancelText: t("cancel"),
            variant: "default",
        },
    });

    const confirm: ConfirmContextValue = (options) => {
        const defaultOptions: Required<ConfirmOptions> = {
            title: t("areYouSure"),
            message: t("confirmActionMessage"),
            confirmText: t("confirm"),
            cancelText: t("cancel"),
            variant: "default",
        };

        return new Promise<boolean>((resolve) => {
            setState({
                open: true,
                options: { ...defaultOptions, ...(options ?? {}) },
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
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    role="dialog"
                    aria-modal="true">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40"
                        aria-label={t("closeDialog")}
                        onClick={() => close(false)}/>

                    <div className="relative z-10 w-full max-w-md rounded-2xl bg-slate-800 shadow-xl border border-slate-700">
                        <div className="p-5">
                            <h2 className="text-base font-semibold text-slate-100">{state.options.title}</h2>
                            <p className="mt-2 text-sm text-slate-300">
                                {state.options.message}
                            </p>

                            <div className="mt-5 flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => close(false)}
                                    className="border border-slate-600 text-slate-300 hover:bg-slate-700">
                                    {state.options.cancelText}
                                </Button>

                                <Button
                                    type="button"
                                    variant={state.options.variant === "danger" ? "danger" : "secondary"}
                                    size="sm"
                                    onClick={() => close(true)}
                                    className={
                                        state.options.variant === "danger"
                                            ? ""
                                            : "border-0 bg-slate-700 text-slate-100 hover:bg-slate-600"
                                    }>
                                    {state.options.confirmText}
                                </Button>
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
