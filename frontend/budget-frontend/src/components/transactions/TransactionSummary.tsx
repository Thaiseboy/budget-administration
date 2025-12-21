import type { Transaction } from "../../types/transaction";
import { formatCurrency } from "../../utils/formatCurrency";
import { normalizeCategory } from "../../utils/categories";
import { isFixedCategory } from "../../utils/budgetCategories";
import Card from "../ui/Card";
import BudgetStatusBadge from "../budget/BudgetStatusBadge";

type Props = {
    items: Transaction[];
};

export default function TransactionSummary({ items }: Props) {
    const income = items
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = items
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const fixedExpenses = items
        .filter((t) => t.type === "expense" && isFixedCategory(normalizeCategory(t.category)))
        .reduce((sum, t) => sum + t.amount, 0);

    const variableExpenses = items
        .filter((t) => t.type === "expense" && !isFixedCategory(normalizeCategory(t.category)))
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;
    const availableForVariable = income - fixedExpenses;

    return (
        <div className="grid gap-3 sm:grid-cols-3">
            <Card className="p-4">
                <div className="text-xs text-slate-300">Total income</div>
                <div className="mt-1 text-lg font-semibold text-emerald-400">
                    {formatCurrency(income)}
                </div>
            </Card>

            <Card className="p-4">
                <div className="text-xs text-slate-300">Total expense</div>
                <div className="mt-1 text-lg font-semibold text-red-400">
                    {formatCurrency(expense)}
                </div>
            </Card>

            <Card className="p-4">
                <div className="text-xs text-slate-300">Balance</div>
                <div className={`mt-1 text-lg font-semibold ${balance >= 0 ? "text-emerald-400" : "text-red-500"}`}>
                    {formatCurrency(balance)}
                </div>
                <BudgetStatusBadge
                    variableExpenses={variableExpenses}
                    availableForVariable={availableForVariable}
                    monthlyRemaining={balance}
                />
            </Card>
        </div>
    );
}
