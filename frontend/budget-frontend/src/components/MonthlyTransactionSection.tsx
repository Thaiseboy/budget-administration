import type { Transaction } from "../types/transaction";
import TransactionSummary from "./TransactionSummary";
import TransactionList from "./TransactionList";

// Formatted month and year in Dutch (e.g. "december 2025")
function formatMonthTitle(monthKey: string) {
    const [y, m] = monthKey.split("-").map(Number);
    const date = new Date(y, m - 1, 1);
    return new Intl.DateTimeFormat("nl-NL", { month: "long", year: "numeric" }).format(date);
}

type Props = {
    monthKey: string;
    items: Transaction[];
    isOpen: boolean;
    onToggle: () => void;
    onDelete?: (id: number) => void;
};

export default function MonthlyTransactionSection({
    monthKey,
    items,
    isOpen,
    onToggle,
    onDelete,
}: Props) {
    return (
        <section className="mt-6 rounded-xl border border-slate-700 bg-slate-800">
            <button
                type="button"
                onClick={onToggle}
                className="w-full px-4 py-4 text-left"
                aria-expanded={isOpen}>

                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold capitalize text-white">{formatMonthTitle(monthKey)}</h2>
                    <span className="text-sm text-slate-400">{isOpen ? "▾" : "▸"}</span>
                </div>

                <div className="mt-3">
                    <TransactionSummary items={items} />
                </div>
            </button>

            {isOpen && (
                <div className="border-t border-slate-700 px-4 py-4">
                    <TransactionList items={items} onDelete={onDelete} />
                </div>
            )}
        </section>
    );
}