import { useEffect, useState, useMemo } from "react";
import AppLayout from "../layouts/AppLayout";
import TransactionSummary from "../components/TransactionSummary";
import { Link, useNavigate } from "react-router-dom";
import { deleteTransaction } from "../api/transactions";
import { useToast } from "../components/toast/ToastContext";
import { useConfirm } from "../components/confirm/ConfirmContext";
import { groupByMonth } from "../utils/groupTransactions";
import MonthlyTransactionSection from "../components/MonthlyTransactionSection";
import { useAppContext } from "../hooks/useAppContext";

export default function TransactionsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const { items, onDeleted } = useAppContext();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [openMonthKeys, setOpenMonthKeys] = useState<string[]>([]);

  function handleEdit(id: number) {
    navigate(`/transactions/${id}/edit`);
  }

  async function handleDelete(id: number) {
    const ok = await confirm({
      title: "Delete transaction?",
      message: "This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!ok) return;

    try {
      await deleteTransaction(id);
      onDeleted(id);
      toast.success("Transaction deleted");
    } catch {
      toast.error("Failed to delete transaction");
    }
  }

  const years = useMemo(() => {
    const yearSet = new Set<number>();
    items.forEach((t) => {
      const year = parseInt(t.date.slice(0, 4), 10);
      yearSet.add(year);
    });
    return Array.from(yearSet).sort((a, b) => b - a); // newest first
  }, [items]);

  const yearItems = useMemo(() => {
    return items.filter((t) => t.date.startsWith(String(selectedYear)));
  }, [items, selectedYear]);

  const monthMap = useMemo(() => {
    return groupByMonth(yearItems);
  }, [yearItems]);

  const monthEntries = useMemo(() => {
    return Array.from(monthMap.entries());
  }, [monthMap]);

  const monthKeys = useMemo(() => {
    return monthEntries.map(([k]) => k);
  }, [monthEntries]);

  function toggleMonth(key: string) {
    setOpenMonthKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function getCurrentMonthKey() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }

  useEffect(() => {
    // remove invalid keys when year/data changes
    setOpenMonthKeys((prev) => prev.filter((k) => monthKeys.includes(k)));

    // open current month by default if nothing open
    const cmk = getCurrentMonthKey();
    if (openMonthKeys.length === 0 && monthKeys.includes(cmk)) {
      setOpenMonthKeys([cmk]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKeys.join("|")]);

  const selectedItems = useMemo(() => {
    if (openMonthKeys.length === 0) return yearItems;

    return openMonthKeys.flatMap((key) => monthMap.get(key) ?? []);
  }, [openMonthKeys, monthMap, yearItems]);

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Transactions</h1>

        <Link
          to="/transactions/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add transaction
        </Link>
      </div>

      {years.length > 0 && (
            <div className="mt-4">
              <label htmlFor="year-select" className="block text-sm font-medium text-slate-300 mb-2">
                Select Year
              </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="rounded-lg border border-slate-600 bg-slate-700 text-white px-3 py-2 focus:border-slate-500 focus:outline-none"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-4">
            <TransactionSummary items={selectedItems} />
          </div>

          {monthEntries.map(([monthKey, monthItems]) => (
            <MonthlyTransactionSection
              key={monthKey}
              monthKey={monthKey}
              items={monthItems}
              isOpen={openMonthKeys.includes(monthKey)}
              onToggle={() => toggleMonth(monthKey)}
              onDelete={handleDelete}
            />
          ))}

      {yearItems.length === 0 && (
        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800 p-6 text-center text-sm text-slate-400">
          No transactions for {selectedYear}
        </div>
      )}

    </AppLayout>
  );
}