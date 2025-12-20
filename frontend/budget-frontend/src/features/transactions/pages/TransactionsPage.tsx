import { useEffect, useState, useMemo } from "react";
import AppLayout from "../../../layouts/AppLayout";
import TransactionSummary from "../../../components/transactions/TransactionSummary";
import { Link, useNavigate } from "react-router-dom";
import { deleteTransaction, createTransaction } from "../../../api/transactions";
import { useToast } from "../../../components/feedback/ToastContext";
import { useConfirm } from "../../../components/feedback/ConfirmContext";
import { groupByMonth } from "../../../utils/groupTransactions";
import MonthlyTransactionSection from "../components/MonthlyTransactionSection";
import { useAppContext } from "../../../hooks/useAppContext";
import type { FixedMonthlyItem } from "../../../types/fixedItem";
import { getFixedItems } from "../../../api/fixedItems";
import { normalizeCategory } from "../../../utils/categories";
import { downloadCsv } from "../../../utils/csv";
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
  const [openMonthKeys, setOpenMonthKeys] = useState<string[]>([]);
  const [fixedItems, setFixedItems] = useState<FixedMonthlyItem[]>([]);
  const [applyYear, setApplyYear] = useState<number>(currentYear);
  const [applyMonth, setApplyMonth] = useState<number>(currentMonth);

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

  async function handleApplyFixedItems(monthKey: string) {
    if (fixedItems.length === 0) {
      toast.error("No fixed items to apply");
      return;
    }

    const ok = await confirm({
      title: "Apply fixed items?",
      message: `This will create ${fixedItems.length} transaction(s) for ${monthKey}. You can edit or delete them afterwards.`,
      confirmText: "Apply",
      cancelText: "Cancel",
      variant: "default",
    });

    if (!ok) return;

    try {
      const [year, month] = monthKey.split("-");
      const dateStr = `${year}-${month}-01`;

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

  // When a month filter is set, open that month or fall back to the first available one.
  useEffect(() => {
    if (monthFilter === "all") return;

    const key = `${selectedYear}-${monthFilter}`;

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
            setTypeFilter("all");
            setCategoryFilter("all");
            setMonthFilter("all");
            setSortKey("date_desc");
          }}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-center text-sm text-slate-300 hover:text-white sm:w-auto"
        >
          Reset
        </button>

        <button
          onClick={() => {
            const filename = `transactions-${selectedYear}-${monthFilter}.csv`;
            downloadCsv(filename, exportRows);
          }}
          className="w-full rounded-lg bg-slate-700 px-3 py-2 text-center text-sm text-white hover:bg-slate-600 sm:w-auto"
        >
          Export CSV
        </button>
      </div>

      <div className="mt-4">
        <TransactionSummary items={selectedItems} />
      </div>

      {fixedItems.length > 0 && (
        <Card className="mt-6 p-4 sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-white">Apply Fixed Items to Month</h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="w-full sm:flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">Year</label>
              <select
                value={applyYear}
                onChange={(e) => setApplyYear(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 text-white px-3 py-2 focus:border-slate-500 focus:outline-none"
              >
                {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">Month</label>
              <select
                value={applyMonth}
                onChange={(e) => setApplyMonth(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 text-white px-3 py-2 focus:border-slate-500 focus:outline-none"
              >
                {MONTH_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:flex-1">
              <button
                onClick={() => {
                  const monthStr = String(applyMonth).padStart(2, '0');
                  const monthKey = `${applyYear}-${monthStr}`;
                  handleApplyFixedItems(monthKey);
                }}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Apply Fixed Items
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Apply your {fixedItems.length} fixed item(s) to the selected month. They will be created as regular transactions that you can edit or delete.
          </p>
        </Card>
      )}

      {monthEntries.map(([monthKey, monthItems]) => (
        <MonthlyTransactionSection
          key={monthKey}
          monthKey={monthKey}
          items={monthItems}
          isOpen={openMonthKeys.includes(monthKey)}
          onToggle={() => toggleMonth(monthKey)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onApplyFixedItems={() => handleApplyFixedItems(monthKey)}
          hasFixedItems={fixedItems.length > 0}
        />
      ))}

      {filteredSortedItems.length === 0 && (
        <Card className="mt-6 p-4 text-center text-sm text-slate-400 sm:p-6">
          No transactions found for {selectedYear} with the current filters.
        </Card>
      )}

    </AppLayout>
  );
}
