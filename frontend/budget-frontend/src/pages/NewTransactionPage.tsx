import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { createTransaction } from "../api/transactions";
import FormFieldGroup from "../components/FormFieldGroup";

export default function NewTransactionPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        type: "expense",
        amount: "",
        date: "",
        description: "",
        category: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFieldChange = (name: string, value: string | boolean) => {
        setFormData({ ...formData, [name]: value });
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createTransaction({
                type: formData.type as 'income' | 'expense',
                amount: Number(formData.amount),
                date: String(formData.date),
                description: formData.description || undefined,
                category: formData.category || undefined,
            });

            navigate('/transactions');
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save transaction");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AppLayout>
            <h1 className="text-xl font-semibold">New transaction</h1>

            <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4">
                <FormFieldGroup
                    fields={[
                        {
                            type: "select",
                            name: "type",
                            label: "Type",
                            options: [
                                { value: "expense", label: "Expense" },
                                { value: "income", label: "Income" },
                            ],
                        },
                        {
                            type: "number",
                            name: "amount",
                            label: "Amount",
                            step: "0.01",
                            required: true,
                        },
                        {
                            type: "date",
                            name: "date",
                            label: "Date",
                            required: true,
                        },
                        {
                            type: "text",
                            name: "description",
                            label: "Description",
                        },
                        {
                            type: "text",
                            name: "category",
                            label: "Category",
                        },
                    ]}
                    formData={formData}
                    onFieldChange={handleFieldChange}
                />

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
                        {loading ? "Saving..." : "Save"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/transactions")}
                        className="rounded-lg border px-4 py-2 text-sm">
                        Cancel
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}