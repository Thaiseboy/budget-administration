import { useEffect, useState, useMemo, useRef } from "react";
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
import { downloadCsv, parseCsv } from "../../../utils/csv";
import FinancialSummary from "../../../components/financial/FinancialSummary";
import ApplyFixedItems from "../../../components/fixed-items/ApplyFixedItems";
import PageHeader from "../../../components/ui/PageHeader";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { MONTH_OPTIONS, MONTH_OPTIONS_PADDED } from "../../../utils/months";
import { GoSync } from "react-icons/go";
import ImportCsvPreviewModal, {
  type ImportPreview,
} from "../components/ImportCsvPreviewModal";

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

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [isImporting, setIsImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  function parseAmount(raw: string): number {
    const trimmed = raw.trim();
    if (!trimmed) return Number.NaN;
    const normalized =
      trimmed.includes(",") && !trimmed.includes(".")
        ? trimmed.replace(",", ".")
        : trimmed;
    return Number(normalized);
  }

  async function handleImportCsv(file: File) {
    setIsImporting(true);
    try {
      const text = await file.text();
      const rows = parseCsv(text);

      if (rows.length === 0) {
        toast.error("CSV is empty");
        return;
      }

      const [header, ...dataRows] = rows;
      const headerMap = header.map((h) => h.trim().toLowerCase());
      const dateIdx = headerMap.indexOf("date");
      const typeIdx = headerMap.indexOf("type");
      const categoryIdx = headerMap.indexOf("category");
      const amountIdx = headerMap.indexOf("amount");
      const descriptionIdx = headerMap.indexOf("description");

      if ([dateIdx, typeIdx, categoryIdx, amountIdx, descriptionIdx].some((i) => i < 0)) {
        toast.error("CSV header is missing required columns");
        return;
      }

      const rowsWithData = dataRows
        .map((row, i) => ({ row, rowNumber: i + 2 }))
        .filter(({ row }) => row.some((cell) => (cell ?? "").trim() !== ""));

      if (rowsWithData.length === 0) {
        toast.error("CSV has no data rows");
        return;
      }

      const parsed = rowsWithData.map(({ row, rowNumber }) => {
        const date = (row[dateIdx] ?? "").trim();
        const typeRaw = (row[typeIdx] ?? "").trim().toLowerCase();
        const amount = parseAmount(String(row[amountIdx] ?? ""));
        const category = normalizeCategory(row[categoryIdx]);
        const description = (row[descriptionIdx] ?? "").trim();

        return {
          rowNumber,
          date,
          type: typeRaw as "income" | "expense",
          amount,
          category,
          description,
        };
      });

      const invalidRows = parsed.filter(
        (t) =>
          !t.date ||
          (t.type !== "income" && t.type !== "expense") ||
          !Number.isFinite(t.amount)
      );

      if (invalidRows.length > 0) {
        const rowList = invalidRows
          .slice(0, 5)
          .map((t) => t.rowNumber)
          .join(", ");
        const suffix = invalidRows.length > 5 ? "..." : "";
        toast.error(`Invalid CSV rows: ${rowList}${suffix}`);
        return;
      }

      setImportPreview({
        fileName: file.name,
        rows: parsed,
      });
    } catch (err) {
      toast.error("Failed to import CSV");
      console.error(err);
    } finally {
      setIsImporting(false);
    }
  }

  async function handleConfirmImport() {
    if (!importPreview) return;
    setIsImporting(true);
    try {
      const created = await Promise.all(
        importPreview.rows.map(({ rowNumber, ...payload }) => createTransaction(payload))
      );

      created.forEach((t) => onCreated(t));
      toast.success(`Imported ${created.length} transaction(s)`);
      setImportPreview(null);
    } catch (err) {
      toast.error("Failed to import CSV");
      console.error(err);
    } finally {
      setIsImporting(false);
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

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex w-full rounded-lg border border-slate-600 bg-slate-800 p-1 sm:w-auto">
          {(["all", "income", "expense"] as const).map((v) => (
            <Button
              key={v}
              type="button"
              variant="ghost"
              size="sm"
              active={typeFilter === v}
              activeClassName="bg-slate-700 !text-yellow-300 hover:bg-slate-700"
              onClick={() => setTypeFilter(v)}
              className="flex-1 rounded-md border border-transparent bg-transparent text-slate-300 hover:border-transparent hover:bg-slate-700/40 hover:text-white sm:flex-none"
            >
              {v === "all" ? "All" : v === "income" ? "Income" : "Expense"}
            </Button>
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

        <Button
          type="button"
          variant="secondary"
          size="md"
          fullWidth
          onClick={() => {
            const filename = `transactions-${selectedYear}-${monthFilter}.csv`;
            downloadCsv(filename, exportRows);
          }}
          className="border-0 px-3 text-white sm:w-auto"
        >
          Export CSV
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="md"
          fullWidth
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
          className="border-0 px-3 text-white sm:w-auto"
        >
          {isImporting ? "Importing..." : "Import CSV"}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleImportCsv(file);
            }
            e.currentTarget.value = "";
          }}
        />

        <Button
          type="button"
          variant="danger"
          size="md"
          fullWidth
          onClick={() => {
            setTypeFilter("all");
            setCategoryFilter("all");
            setMonthFilter("all");
          }}
          className="flex items-center justify-center border-0 bg-red-800 px-3 text-xl text-slate-300 hover:bg-red-700 hover:text-white sm:w-auto"
        >
          <GoSync />
        </Button>
      </div>

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
          onCancel={() => setImportPreview(null)}
          onConfirm={handleConfirmImport}
        />
      )}

    </AppLayout>
  );
}
