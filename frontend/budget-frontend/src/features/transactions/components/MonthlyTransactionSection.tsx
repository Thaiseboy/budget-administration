import type { Transaction } from "../../../types";
import TransactionSummary from "../../../components/transactions/TransactionSummary";
import TransactionList from "./TransactionList";
import Button from "../../../components/ui/Button";
import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";

function formatMonthTitle(monthKey: string) {
    const [y, m] = monthKey.split("-").map(Number);
    const date = new Date(y, m - 1, 1);
    return new Intl.DateTimeFormat("nl-NL", { month: "long", year: "numeric" }).format(date);
}

type TypeFilter = "all" | "income" | "expense";

type Props = {
    monthKey: string;
    items: Transaction[];
    isOpen: boolean;
    onToggle: () => void;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    onApplyFixedItems?: () => void;
    hasFixedItems?: boolean;
    typeFilter?: TypeFilter;
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
    typeFilter = "all",
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
                    <TransactionSummary items={items} typeFilter={typeFilter} />
                </div>
            </button>

            {isOpen && (
                <div className="border-t border-slate-700 px-4 py-4">
                    {hasFixedItems && onApplyFixedItems && (
                        <div className="mb-4">
                            <Button
                                type="button"
                                variant="primary"
                                size="md"
                                fullWidth
                                onClick={onApplyFixedItems}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                + Apply Fixed Items to This Month
                            </Button>
                        </div>
                    )}
                    <TransactionList items={items} onEdit={onEdit} onDelete={onDelete} />
                </div>
            )}
        </section>
    );
}
