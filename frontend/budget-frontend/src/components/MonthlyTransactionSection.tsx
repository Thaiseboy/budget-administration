import type { Transaction } from "../types/transaction";
import TransactionSummary from "./TransactionSummary";
import TransactionList from "./TransactionList";
import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";

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
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    onApplyFixedItems?: () => void;
    hasFixedItems?: boolean;
};

export default function MonthlyTransactionSection({
    monthKey,
    items,
    isOpen,
    onToggle,
    onEdit,
    onDelete,
    onApplyFixedItems,
    hasFixedItems = false,
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
                    <span className="text-2xl text-slate-400 sm:text-3xl">{isOpen ? <VscEye /> : <VscEyeClosed />}</span>
                </div>

                <div className="mt-3">
                    <TransactionSummary items={items} />
                </div>
            </button>

            {isOpen && (
                <div className="border-t border-slate-700 px-4 py-4">
                    {hasFixedItems && onApplyFixedItems && (
                        <div className="mb-4">
                            <button
                                onClick={onApplyFixedItems}
                                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                            >
                                + Apply Fixed Items to This Month
                            </button>
                        </div>
                    )}
                    <TransactionList items={items} onEdit={onEdit} onDelete={onDelete} />
                </div>
            )}
        </section>
    );
}
