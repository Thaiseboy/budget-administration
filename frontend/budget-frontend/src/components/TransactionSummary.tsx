import type { Transaction } from '../types/transaction.ts';
import { formatCurrency } from '../utils/formatCurrency.ts';

type props = {
    items: Transaction[];
}

export default function TransactionSummary({items}: props) {
    const income = items
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

    const expense = items
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;

    return (
<div className="grid gap-3 sm:grid-cols-3">
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <div className="text-xs text-slate-300">Total income</div>
        <div className="mt-1 text-lg font-semibold text-emerald-400">
            {formatCurrency(income)}
        </div>
    </div>

    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <div className="text-xs text-slate-300">Total expense</div>
        <div className="mt-1 text-lg font-semibold text-red-400">
            {formatCurrency(expense)}
        </div>
    </div>

    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <div className="text-xs text-slate-300">Balance</div>
        <div className="mt-1 text-lg font-semibold text-white">
            {formatCurrency(balance)}
        </div>
    </div>
</div>
    );
}