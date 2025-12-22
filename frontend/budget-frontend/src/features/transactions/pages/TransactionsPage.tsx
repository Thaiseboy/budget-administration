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
import { MONTH_OPTIONS } from "../../../utils/months";
import ImportCsvPreviewModal from "../components/ImportCsvPreviewModal";
import TransactionFiltersBar from "../components/TransactionFiltersBar";
import { useCsvImport } from "../hooks/useCsvImport";
import { useTransactionFilters } from "../hooks/useTransactionFilters";

export default function TransactionsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const { items, onDeleted, onCreated } = useAppContext();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [openMonthKeys, setOpenMonthKeys] = useState<MonthKey[]>([]);
  const [fixedItems, setFixedItems] = useState<FixedMonthlyItem[]>([]);

  const {
    selectedYear,
    setSelectedYear,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    monthFilter,
    setMonthFilter,
    resetFilters,
  } = useTransactionFilters({ fallbackYear: currentYear });

  const {
    fileInputRef,
    importPreview,
    isImporting,
    handleImportCsv,
    handleConfirmImport,
    clearImportPreview,
  } = useCsvImport({ onCreated });

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
          category: normalizeCategory(fixedItem.category),
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
    yearSet.add(selectedYear);
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [items, selectedYear]);

  const yearItems = useMemo(() => {
    return items.filter((t) => t.date.startsWith(String(selectedYear)));
  }, [items, selectedYear]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    yearItems.forEach((t) => {
      set.add(normalizeCategory(t.category));
    });
    if (categoryFilter !== "all") {
      set.add(categoryFilter);
    }
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [yearItems, categoryFilter]);

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



    return list;
  }, [yearItems, typeFilter, categoryFilter, monthFilter]);

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
    setOpenMonthKeys((prev) => {
      const next = prev.filter((k) => monthKeys.includes(k));
      const cmk = getCurrentMonthKey();

      if (next.length === 0 && monthKeys.includes(cmk)) {
        return [cmk];
      }

      return next;
    });
  }, [monthKeys]);

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
              to="/categories"
              className="w-full rounded-lg border border-slate-600 px-4 py-2 text-center text-sm text-slate-300 hover:bg-slate-800 sm:w-auto"
            >
              Categories
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

      <TransactionFiltersBar
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={categories}
        monthFilter={monthFilter}
        onMonthChange={setMonthFilter}
        onExportCsv={() => {
          const filename = `transactions-${selectedYear}-${monthFilter}.csv`;
          downloadCsv(filename, exportRows);
        }}
        onImportFile={handleImportCsv}
        isImporting={isImporting}
        onResetFilters={resetFilters}
        fileInputRef={fileInputRef}
      />

      <div className="mt-4">
        <FinancialSummary
          title={(() => {
            let title = monthFilter === "all"
              ? `Total Overview (${selectedYear})`
              : `Total Overview (${MONTH_OPTIONS[parseInt(monthFilter) - 1]?.label} ${selectedYear})`;

            if (typeFilter !== "all") {
              title += ` - ${typeFilter === "income" ? "Income" : "Expense"}`;
            }

            if (categoryFilter !== "all") {
              title += ` - ${categoryFilter}`;
            }


            return title;
          })()}
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

      {importPreview && (
        <ImportCsvPreviewModal
          preview={importPreview}
          isImporting={isImporting}
          onCancel={clearImportPreview}
          onConfirm={handleConfirmImport}
        />
      )}

    </AppLayout>
  );
}
