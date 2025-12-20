import { useEffect, useMemo, useRef, useState } from "react";
import type { Transaction } from "../../types/transaction";
import type { CategoryBudget } from "../../types/budget";
import { upsertBudget } from "../../api/budgets";
import { useToast } from "../toast/ToastContext";
import { formatCurrency } from "../../utils/formatCurrency";

type Props = {
  year: number;
  month: number;
  monthItems: Transaction[];
  budgets: CategoryBudget[];
  onBudgetSaved: (b: CategoryBudget) => void;
};

function getCategory(t: Transaction) {
  return t.category || "Other";
}

export default function CategoryBudgetList({
  year,
  month,
  monthItems,
  budgets,
  onBudgetSaved,
}: Props) {
  const toast = useToast();

  // Calculate monthly totals
  const monthlyIncome = useMemo(() => {
    return monthItems.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  }, [monthItems]);

  const monthlyExpense = useMemo(() => {
    return monthItems.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  }, [monthItems]);

  const monthlyRemaining = monthlyIncome - monthlyExpense;

  const expenseTotalsByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of monthItems) {
      if (t.type !== "expense") continue;
      const key = getCategory(t);
      map.set(key, (map.get(key) ?? 0) + t.amount);
    }
    return map;
  }, [monthItems]);

  const categories = useMemo(() => {
    const set = new Set<string>(["Other"]);
    for (const t of monthItems) set.add(getCategory(t));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [monthItems]);

  const budgetMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of budgets) map.set(b.category, b.amount);
    return map;
  }, [budgets]);

  // local input state per category
  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    // init draft from budgets
    const next: Record<string, string> = {};
    for (const c of categories) {
      const amount = budgetMap.get(c);
      next[c] = amount != null ? String(amount) : "";
    }
    setDraft(next);
  }, [categories, budgetMap]);

  // debounce timers per category
  const timers = useRef<Record<string, number>>({});

  function scheduleSave(category: string, value: string) {
    // clear existing timer
    if (timers.current[category]) window.clearTimeout(timers.current[category]);

    timers.current[category] = window.setTimeout(async () => {
      const amount = Number(value);
      if (!Number.isFinite(amount) || amount < 0) {
        toast.error("Budget must be a valid number");
        return;
      }

      try {
        const saved = await upsertBudget({ year, month, category, amount });
        onBudgetSaved(saved);
        toast.success(`Budget saved for ${category}`);
      } catch {
        toast.error("Failed to save budget");
      }
    }, 600);
  }

  function percent(spent: number, budget: number) {
    if (!budget || budget <= 0) return 0;
    return Math.round((spent / budget) * 100);
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[month - 1];

  return (
    <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800 p-6">
      <h2 className="text-base font-semibold text-white">Budgets ({monthName} {year})</h2>
      <p className="mt-2 text-sm text-slate-400">
        Set monthly budgets per category. Auto saves after you stop typing.
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

      <div className="mt-4 space-y-4">
        {categories.map((category) => {
          const spent = expenseTotalsByCategory.get(category) ?? 0;
          const budget = budgetMap.get(category) ?? 0;
          const p = percent(spent, budget);

          const barClass =
            p >= 100 ? "bg-red-500" : p >= 70 ? "bg-amber-400" : "bg-emerald-500";

          const status =
            budget <= 0 ? "No budget" :
            p >= 100 ? "Over budget" :
            p >= 70 ? "Near limit" :
            "OK";

          const statusClass =
            budget <= 0 ? "bg-slate-700 text-slate-200" :
            p >= 100 ? "bg-red-600 text-white" :
            p >= 70 ? "bg-amber-400 text-slate-900" :
            "bg-emerald-500 text-white";

          return (
            <div key={category} className="rounded-xl border border-slate-700 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-white">{category}</div>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass}`}>
                      {status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Spent: {formatCurrency(spent)} • Budget: {formatCurrency(budget)} • {p}%
                  </div>
                </div>

                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={draft[category] ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setDraft((prev) => ({ ...prev, [category]: v }));
                    scheduleSave(category, v);
                  }}
                  className="w-40 rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-slate-500 focus:outline-none"
                  placeholder="Budget amount"
                />
              </div>

              <div className="mt-3 h-2 w-full rounded-full bg-slate-700">
                <div
                  className={`h-2 rounded-full ${barClass}`}
                  style={{ width: `${Math.min(p, 100)}%` }}
                />
              </div>

              {p > 100 && (
                <div className="mt-2 text-xs text-red-400">
                  Over budget by {formatCurrency(spent - budget)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}