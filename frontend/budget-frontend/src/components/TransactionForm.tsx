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
        {
            id: "category",
            name: "category",
            label: "Category",
            type: "text" as const,
            placeholder: "Optional",
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

            {error && <div className="text-sm text-red-400">{error}</div>}

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600 disabled:opacity-50"
                >
                    {loading ? "Saving..." : submitLabel}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}