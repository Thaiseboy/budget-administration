import { useState } from "react";
import FormFieldGroup from "./FormFieldGroup";

type FormData = {
    type: "income" | "expense";
    amount: string;
    date: string;
    description?: string;
    category?: string;
};

type Props = {
    initialValues?: Partial<FormData>;
    submitLabel?: string;
    categories: string[];
    onSubmit: (data: {
        type: "income" | "expense";
        amount: number;
        date: string;
        description?: string;
        category?: string;
    }) => Promise<void>;
    onCancel?: () => void;
};

export default function TransactionForm({
    initialValues,
    submitLabel = "Save",
    categories,
    onSubmit,
    onCancel,
}: Props) {
    const [formData, setFormData] = useState<FormData>({
        type: initialValues?.type ?? "expense",
        amount: initialValues?.amount ?? "",
        date: initialValues?.date ?? new Date().toISOString().split('T')[0], //Today as default
        description: initialValues?.description ?? "",
        category: initialValues?.category ?? "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Track if user wants to use custom category input instead of select
    const [useCustomCategory, setUseCustomCategory] = useState<boolean>(() => {
        const current = (formData.category ?? "").trim();
        return current.length > 0 && !categories.includes(current);
    });

    // as const is a TypeScript const assertion that makes the type narrower/more specific!
    // If is `type: text` then is type text and not type string.
    const fields = [
        {
            id: "type",
            name: "type",
            label: "Type",
            type: "select" as const,
            required: true,
            options: [
                { label: "Expense", value: "expense" },
                { label: "Income", value: "income" },
            ],
        },
        {
            id: "amount",
            name: "amount",
            label: "Amount",
            type: "number" as const,
            required: true,
            placeholder: "0.00",
        },
        {
            id: "date",
            name: "date",
            label: "Date",
            type: "date" as const,
            required: false,
        },
        {
            id: "description",
            name: "description",
            label: "Description",
            type: "text" as const,
            placeholder: "Optional",
        },
        useCustomCategory
            ? {
                id: "category",
                name: "category",
                label: "Category (Custom)",
                type: "text" as const,
                placeholder: "Enter custom category",
            }
            : {
                id: "category",
                name: "category",
                label: "Category",
                type: "select" as const,
                required: false,
                options: [
                    { label: "-- Select Category --", value: "" },
                    ...categories.map((cat) => ({ label: cat, value: cat })),
                ],
            },
    ];

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const amountNumber = Number(formData.amount);
            if (!Number.isFinite(amountNumber)) {
                throw new Error("Amount must be a number");
            }

            await onSubmit({
                type: formData.type,
                amount: amountNumber,
                date: formData.date,
                description: formData.description || undefined,
                category: formData.category || undefined,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save transaction");
        } finally {
            setLoading(false);
        }
    }

    function handleFieldChange(name: string, value: string | boolean) {
        setFormData((prev) => ({ ...prev, [name]: value as any }));
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4">
            <FormFieldGroup fields={fields} formData={formData} onFieldChange={handleFieldChange} />

            <div className="flex justify-between items-center">
                {formData.category && (
                    <button
                        type="button"
                        onClick={() => {
                            setFormData((prev) => ({ ...prev, category: "" }));
                            setUseCustomCategory(false);
                        }}
                        className="text-xs text-red-400 hover:text-red-300 underline"
                    >
                        ✕ Clear category
                    </button>
                )}
                <div className={formData.category ? "" : "ml-auto"}>
                    <button
                        type="button"
                        onClick={() => setUseCustomCategory((prev) => !prev)}
                        className="text-xs text-slate-400 hover:text-slate-300 underline"
                    >
                        {useCustomCategory ? "← Use existing category" : "+ Add custom category"}
                    </button>
                </div>
            </div>

            {error && <div className="text-sm text-red-400">{error}</div>}

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600 disabled:opacity-50"
                >
                    {loading ? "Saving..." : submitLabel}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border bg-red-600 border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}