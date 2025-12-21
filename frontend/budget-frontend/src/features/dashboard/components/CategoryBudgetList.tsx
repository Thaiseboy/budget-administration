import { useMemo } from "react";
import type { Transaction } from "../../../types/transaction";
import { formatCurrency } from "../../../utils/formatCurrency";
import { normalizeCategory } from "../../../utils/categories";
import { isFixedCategory } from "../../../utils/budgetCategories";
import Card from "../../../components/ui/Card";
import { MONTH_NAMES } from "../../../utils/months";
import BudgetStatusBadge from "../../../components/budget/BudgetStatusBadge";

type Props = {
  year: number;
  month: number;
  monthItems: Transaction[];
  totalRemaining: number;
};

function getCategory(t: Transaction) {
  return normalizeCategory(t.category);
}

export default function CategoryBudgetList({
  year,
  month,
  monthItems,
  totalRemaining,
}: Props) {
  const monthlyIncome = useMemo(() => {
    return monthItems.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  }, [monthItems]);

  const monthlyExpense = useMemo(() => {
    return monthItems.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  }, [monthItems]);

  const fixedExpenses = useMemo(() => {
    return monthItems
      .filter((t) => t.type === "expense" && isFixedCategory(getCategory(t)))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthItems]);

  const variableExpenses = useMemo(() => {
    return monthItems
      .filter((t) => t.type === "expense" && !isFixedCategory(getCategory(t)))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthItems]);

  const monthlyRemaining = monthlyIncome - monthlyExpense;
  const availableForVariable = monthlyIncome - fixedExpenses;

  const categoryTotals = useMemo(() => {
    const incomeMap = new Map<string, number>();
    const expenseMap = new Map<string, number>();

    for (const t of monthItems) {
      const key = getCategory(t);
      if (t.type === "income") {
        incomeMap.set(key, (incomeMap.get(key) ?? 0) + t.amount);
      } else {
        expenseMap.set(key, (expenseMap.get(key) ?? 0) + t.amount);
      }
    }

    return { incomeMap, expenseMap };
  }, [monthItems]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const t of monthItems) set.add(getCategory(t));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [monthItems]);

  const monthName = MONTH_NAMES[month - 1];

  return (
    <Card className="mt-6 p-4 sm:p-6">
      <h2 className="text-base font-semibold text-white">Spending Overview ({monthName} {year})</h2>
      <p className="mt-2 text-sm text-slate-400">
        Income and expenses per category. Status shows how much of your variable budget (after fixed costs) is being used.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg border border-slate-600 bg-slate-700 p-4 sm:grid-cols-3">
        <div>
          <div className="text-xs text-slate-400">Income (Month)</div>
          <div className="mt-1 text-lg font-semibold text-green-400">{formatCurrency(monthlyIncome)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Expense (Month)</div>
          <div className="mt-1 text-lg font-semibold text-red-400">{formatCurrency(monthlyExpense)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Remaining</div>
          <div className={`mt-1 text-lg font-semibold ${monthlyRemaining >= 0 ? "text-emerald-400" : "text-red-500"}`}>
            {formatCurrency(monthlyRemaining)}
          </div>
          <BudgetStatusBadge
            variableExpenses={variableExpenses}
            availableForVariable={availableForVariable}
            monthlyRemaining={monthlyRemaining}
          />
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-white mb-3">By Category</h3>
          <div className="space-y-3">
            {categories.map((category) => {
              const income = categoryTotals.incomeMap.get(category) ?? 0;
              const expense = categoryTotals.expenseMap.get(category) ?? 0;

              return (
                <div key={category} className="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <div className="break-words text-sm font-medium text-white">{category}</div>
                    </div>
                    <div className="text-left sm:text-right">
                      {income > 0 && (
                        <div className="text-sm font-semibold text-green-400">
                          +{formatCurrency(income)}
                        </div>
                      )}
                      {expense > 0 && (
                        <div className="text-sm font-semibold text-red-400">
                          -{formatCurrency(expense)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {categories.length === 0 && (
        <div className="mt-4 text-center text-sm text-slate-400 py-8">
          No transactions for this month yet.
        </div>
      )}
    </Card>
  );
}
