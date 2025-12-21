import { useEffect, useState, useMemo } from "react";
import AppLayout from "../../../layouts/AppLayout";
import { Link, useNavigate } from "react-router-dom";
import { deleteTransaction, createTransaction } from "../../../api/transactions";
import { useToast } from "../../../components/feedback/ToastContext";
import { useConfirm } from "../../../components/feedback/ConfirmContext";
import { groupByMonth, type MonthKey } from "../../../utils/groupTransactions";
import MonthlyTransactionSection from "../components/MonthlyTransactionSection";
import { useAppContext } from "../../../hooks/useAppContext";
import type { FixedMonthlyItem } from "../../../types/fixedItem";
import { getFixedItems } from "../../../api/fixedItems";
import { normalizeCategory } from "../../../utils/categories";
import { isFixedCategory } from "../../../utils/budgetCategories";
import { downloadCsv } from "../../../utils/csv";
import FinancialSummary from "../../../components/financial/FinancialSummary";
import ApplyFixedItems from "../../../components/fixed-items/ApplyFixedItems";
import PageHeader from "../../../components/ui/PageHeader";
import Card from "../../../components/ui/Card";
import { MONTH_OPTIONS, MONTH_OPTIONS_PADDED } from "../../../utils/months";

export default function TransactionsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const { items, onDeleted, onCreated } = useAppContext();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [openMonthKeys, setOpenMonthKeys] = useState<MonthKey[]>([]);
  const [fixedItems, setFixedItems] = useState<FixedMonthlyItem[]>([]);

  type TypeFilter = "all" | "income" | "expense";
  type SortKey = "date_desc" | "date_asc" | "amount_desc" | "amount_asc";

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date_desc");
  const [monthFilter, setMonthFilter] = useState<string>("all");

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

  async function handleApplyFixedItems(year: number, month: number) {
    if (fixedItems.length === 0) {
      toast.error("No fixed items to apply");
      return;
    }

    const monthStr = String(month).padStart(2, '0');
    const monthKey = `${year}-${monthStr}`;

    const ok = await confirm({
      title: "Apply fixed items?",
      message: `This will create ${fixedItems.length} transaction(s) for ${monthKey}. You can edit or delete them afterwards.`,
      confirmText: "Apply",
      cancelText: "Cancel",
      variant: "default",
    });

    if (!ok) return;

    try {
      const dateStr = `${year}-${monthStr}-01`;

      const promises = fixedItems.map((fixedItem) => {
        return createTransaction({
          date: dateStr,
          description: fixedItem.description,
          amount: fixedItem.amount,
          type: fixedItem.type,
          category: fixedItem.category || undefined,
        });
      });

      const createdTransactions = await Promise.all(promises);

      createdTransactions.forEach((t) => onCreated(t));

      toast.success(`Applied ${fixedItems.length} fixed item(s) to ${monthKey}`);
    } catch (err) {
      toast.error("Failed to apply fixed items");
      console.error(err);
    }
  }

  const years = useMemo(() => {
    const yearSet = new Set<number>();
    items.forEach((t) => {
      const year = parseInt(t.date.slice(0, 4), 10);
      yearSet.add(year);
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [items]);

  const yearItems = useMemo(() => {
    return items.filter((t) => t.date.startsWith(String(selectedYear)));
  }, [items, selectedYear]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    yearItems.forEach((t) => {
      set.add(normalizeCategory(t.category));
    });
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [yearItems]);

  const filteredSortedItems = useMemo(() => {
    let list = [...yearItems];

    if (typeFilter !== "all") {
      list = list.filter((t) => t.type === typeFilter);
    }

    if (categoryFilter !== "all") {
      list = list.filter((t) => {
        const c = normalizeCategory(t.category);
        return c === categoryFilter;
      });
    }

    if (monthFilter !== "all") {
      list = list.filter((t) => t.date.slice(5, 7) === monthFilter);
    }

    list.sort((a, b) => {
      if (sortKey === "date_desc") return b.date.localeCompare(a.date);
      if (sortKey === "date_asc") return a.date.localeCompare(b.date);
      if (sortKey === "amount_desc") return b.amount - a.amount;
      if (sortKey === "amount_asc") return a.amount - b.amount;
      return 0;
    });

    return list;
  }, [yearItems, typeFilter, categoryFilter, monthFilter, sortKey]);

  const exportRows = useMemo(() => {
    return filteredSortedItems.map((item) => ({
      date: item.date,
      type: item.type,
      category: normalizeCategory(item.category),
      amount: item.amount,
      description: item.description ?? "",
    }));
  }, [filteredSortedItems]);

  const monthMap = useMemo(() => {
    return groupByMonth(filteredSortedItems);
  }, [filteredSortedItems]);

  const monthEntries = useMemo(() => {
    return Array.from(monthMap.entries());
  }, [monthMap]);

  const monthKeys = useMemo(() => {
    return monthEntries.map(([k]) => k);
  }, [monthEntries]);

  function toggleMonth(key: MonthKey) {
    setOpenMonthKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function getCurrentMonthKey(): MonthKey {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}` as MonthKey;
  }

  useEffect(() => {
    getFixedItems()
      .then((data) => setFixedItems(data))
      .catch(() => setFixedItems([]));
  }, []);

  // Keep visible month sections aligned with available data.
  useEffect(() => {
    setOpenMonthKeys((prev) => prev.filter((k) => monthKeys.includes(k)));

    const cmk = getCurrentMonthKey();
    if (openMonthKeys.length === 0 && monthKeys.includes(cmk)) {
      setOpenMonthKeys([cmk]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKeys.join("|")]);

  const selectedItems = useMemo(() => {
    if (monthFilter === "all") return filteredSortedItems;
    if (openMonthKeys.length === 0) return filteredSortedItems;

    return openMonthKeys.flatMap((key) => monthMap.get(key) ?? []);
  }, [monthFilter, openMonthKeys, monthMap, filteredSortedItems]);

  const fixedIncome = useMemo(() => {
    return selectedItems
      .filter((t) => t.type === "income" && isFixedCategory(normalizeCategory(t.category)))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [selectedItems]);

  const fixedExpense = useMemo(() => {
    return selectedItems
      .filter((t) => t.type === "expense" && isFixedCategory(normalizeCategory(t.category)))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [selectedItems]);

  const variableIncome = useMemo(() => {
    return selectedItems
      .filter((t) => t.type === "income" && !isFixedCategory(normalizeCategory(t.category)))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [selectedItems]);

  const variableExpense = useMemo(() => {
    return selectedItems
      .filter((t) => t.type === "expense" && !isFixedCategory(normalizeCategory(t.category)))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [selectedItems]);

  // When a month filter is set, open that month or fall back to the first available one.
  useEffect(() => {
    if (monthFilter === "all") return;

    const key = `${selectedYear}-${monthFilter}` as MonthKey;

    if (monthKeys.includes(key)) {
      setOpenMonthKeys([key]);
      return;
    }

    if (monthKeys.length > 0) {
      setOpenMonthKeys([monthKeys[0]]);
    } else {
      setOpenMonthKeys([]);
    }
  }, [monthFilter, selectedYear, monthKeys, setOpenMonthKeys]);

  return (
    <AppLayout>
      <PageHeader
        title="Transactions"
        actions={
          <>
            <Link
              to="/dashboard"
              className="w-full rounded-lg border border-slate-600 px-4 py-2 text-center text-sm text-slate-300 hover:bg-slate-800 sm:w-auto"
            >
              Dashboard
            </Link>

            <Link
              to="/transactions/new"
              className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-slate-800 sm:ml-4 sm:w-auto"
            >
              Add transaction
            </Link>
          </>
        }
      />

      {years.length > 0 && (
        <div className="mt-4">
          <label htmlFor="year-select" className="block text-sm font-medium text-slate-300 mb-2">
            Select Year
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-slate-500 focus:outline-none sm:w-auto"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex w-full rounded-lg border border-slate-600 bg-slate-800 p-1 sm:w-auto">
          {(["all", "income", "expense"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setTypeFilter(v)}
              className={`flex-1 rounded-md px-3 py-1 text-sm transition-colors sm:flex-none ${typeFilter === v
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:text-white"
                }`}
            >
              {v === "all" ? "All" : v === "income" ? "Income" : "Expense"}
            </button>
          ))}
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-slate-500 focus:outline-none sm:w-auto"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c}
            </option>
          ))}
        </select>

        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-slate-500 focus:outline-none sm:w-auto"
        >
          <option value="all">All months</option>
          {MONTH_OPTIONS_PADDED.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-slate-500 focus:outline-none sm:w-auto"
        >
          <option value="date_desc">Date: new → old</option>
          <option value="date_asc">Date: old → new</option>
          <option value="amount_desc">Amount: high → low</option>
          <option value="amount_asc">Amount: low → high</option>
        </select>

        <button
          onClick={() => {
            const filename = `transactions-${selectedYear}-${monthFilter}.csv`;
            downloadCsv(filename, exportRows);
          }}
          className="w-full rounded-lg bg-slate-700 px-3 py-2 text-center text-sm text-white hover:bg-slate-600 sm:w-auto"
        >
          Export CSV
        </button>

                <button
          onClick={() => {
            setTypeFilter("all");
            setCategoryFilter("all");
            setMonthFilter("all");
            setSortKey("date_desc");
          }}
          className="w-full rounded-lg border border-slate-600 bg-red-800 px-3 py-2 text-center text-sm text-slate-300 hover:text-white sm:w-auto"
        >
          Reset
        </button>
      </div>

      <div className="mt-4">
        <FinancialSummary
          title={monthFilter === "all"
            ? `Total Overview (${selectedYear})`
            : `Total Overview (${MONTH_OPTIONS[parseInt(monthFilter) - 1]?.label} ${selectedYear})`}
          fixedIncome={fixedIncome}
          fixedExpense={fixedExpense}
          variableIncome={variableIncome}
          variableExpense={variableExpense}
          typeFilter={typeFilter}
        />
      </div>

      <div className="mt-6">
        <ApplyFixedItems
          fixedItems={fixedItems}
          onApply={handleApplyFixedItems}
          currentYear={currentYear}
          currentMonth={currentMonth}
        />
      </div>

      {monthEntries.map(([monthKey, monthItems]) => {
        const [yearStr, monthStr] = monthKey.split('-');
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);

        return (
          <MonthlyTransactionSection
            key={monthKey}
            monthKey={monthKey}
            items={monthItems}
            isOpen={openMonthKeys.includes(monthKey)}
            onToggle={() => toggleMonth(monthKey)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onApplyFixedItems={() => handleApplyFixedItems(year, month)}
            hasFixedItems={fixedItems.length > 0}
            typeFilter={typeFilter}
          />
        );
      })}

      {filteredSortedItems.length === 0 && (
        <Card className="mt-6 p-4 text-center text-sm text-slate-400 sm:p-6">
          No transactions found for {selectedYear} with the current filters.
        </Card>
      )}

    </AppLayout>
  );
}
