import type { Transaction } from "../../types";
import { formatCurrency } from "../../utils/formatCurrency";
import { normalizeCategory } from "../../utils/categories";
import { isFixedCategory } from "../../utils/budgetCategories";
import Card from "../ui/Card";
import BudgetStatusBadge from "../budget/BudgetStatusBadge";

type TypeFilter = "all" | "income" | "expense";

type Props = {
    items: Transaction[];
    typeFilter?: TypeFilter;
};

export default function TransactionSummary({ items, typeFilter = "all" }: Props) {
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

    const showIncome = typeFilter === "all" || typeFilter === "income";
    const showExpense = typeFilter === "all" || typeFilter === "expense";
    const showBalance = typeFilter === "all";

    const gridCols = typeFilter === "all" ? "sm:grid-cols-3" : "sm:grid-cols-1";

    return (
        <div className={`grid gap-3 ${gridCols}`}>
            {showIncome && (
                <Card className="p-4">
                    <div className="text-xs text-slate-300">Total income</div>
                    <div className="mt-1 text-lg font-semibold text-emerald-400">
                        {formatCurrency(income)}
                    </div>
                </Card>
            )}

            {showExpense && (
                <Card className="p-4">
                    <div className="text-xs text-slate-300">Total expense</div>
                    <div className="mt-1 text-lg font-semibold text-red-400">
                        {formatCurrency(expense)}
                    </div>
                </Card>
            )}

            {showBalance && (
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
            )}
        </div>
    );
}
