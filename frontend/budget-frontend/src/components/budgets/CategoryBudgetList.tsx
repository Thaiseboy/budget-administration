import { useMemo } from "react";
import type { Transaction } from "../../types/transaction";
import { formatCurrency } from "../../utils/formatCurrency";

type Props = {
  year: number;
  month: number;
  monthItems: Transaction[];
  totalRemaining: number;
};

function getCategory(t: Transaction) {
  return t.category || "Other";
}

export default function CategoryBudgetList({
  year,
  month,
  monthItems,
  totalRemaining,
}: Props) {
  // Calculate monthly totals
  const monthlyIncome = useMemo(() => {
    return monthItems.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  }, [monthItems]);

  const monthlyExpense = useMemo(() => {
    return monthItems.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  }, [monthItems]);

  const monthlyRemaining = monthlyIncome - monthlyExpense;

  // Calculate totals by category (both income and expense)
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

  // Calculate percentage of remaining budget for expense categories
  function percentOfRemaining(spent: number) {
    if (totalRemaining <= 0) return 0;
    return Math.round((spent / totalRemaining) * 100);
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[month - 1];

  return (
    <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800 p-6">
      <h2 className="text-base font-semibold text-white">Spending Overview ({monthName} {year})</h2>
      <p className="mt-2 text-sm text-slate-400">
        Income and expenses per category. Status shows if a category uses too much of your remaining budget.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-4 rounded-lg border border-slate-600 bg-slate-700 p-4">
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
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-white mb-3">By Category</h3>
          <div className="space-y-3">
            {categories.map((category) => {
              const income = categoryTotals.incomeMap.get(category) ?? 0;
              const expense = categoryTotals.expenseMap.get(category) ?? 0;

              // Calculate percentage of remaining budget (for expenses only)
              const p = percentOfRemaining(expense);

              // Status based on percentage of remaining budget or if already in negative
              const status =
                expense === 0 ? null :
                totalRemaining < 0 ? "Over budget" :
                p >= 50 ? "Over limit" :
                p >= 30 ? "Near limit" :
                p >= 20 ? "Warning" :
                null;

              const statusClass =
                totalRemaining < 0 ? "bg-red-600 text-white" :
                p >= 50 ? "bg-red-600 text-white" :
                p >= 30 ? "bg-amber-400 text-slate-900" :
                p >= 20 ? "bg-orange-500 text-white" :
                "bg-emerald-500 text-white";

              return (
                <div key={category} className="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-white">{category}</div>
                      {status && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}>
                          {status}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
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
                  {expense > 0 && (
                    <div className="mt-2 text-xs text-slate-400">
                      {totalRemaining < 0
                        ? "Budget exceeded"
                        : `${p}% of remaining budget`}
                    </div>
                  )}
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
    </div>
  );
}