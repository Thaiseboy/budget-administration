import { useMemo, useState, useEffect } from "react";
import AppLayout from "../../../layouts/AppLayout";
import { useAppContext } from "../../../hooks/useAppContext";
import { normalizeCategory } from "../../../utils/categories";
import { mergeCategories } from "../../../api/categories";
import { useToast } from "../../../components/feedback/ToastContext";
import { useConfirm } from "../../../components/feedback/ConfirmContext";
import type { FixedMonthlyItem } from "../../../types/fixedItem";
import { getFixedItems } from "../../../api/fixedItems";
import { FixedItemsList } from "../../dashboard/components/FixedItemsList";
import PageHeader from "../../../components/ui/PageHeader";
import Card from "../../../components/ui/Card";

export default function CategoriesPage() {
  const { items, setItems } = useAppContext();
  const toast = useToast();
  const confirm = useConfirm();
  const [renameValues, setRenameValues] = useState<Record<string, string>>({});
  const [mergeTargets, setMergeTargets] = useState<Record<string, string>>({});
  const [busyCategory, setBusyCategory] = useState<string | null>(null);
  const [fixedItems, setFixedItems] = useState<FixedMonthlyItem[]>([]);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      const key = normalizeCategory(item.category);
      map.set(key, (map.get(key) ?? 0) + 1);
    }

    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [items]);

  const loadFixedItems = () => {
    getFixedItems()
      .then((data) => setFixedItems(data))
      .catch(() => setFixedItems([]));
  };

  useEffect(() => {
    loadFixedItems();
  }, []);

  async function applyMerge(from: string, toRaw: string, actionLabel: string) {
    const to = toRaw.trim();
    if (!to) {
      toast.error("Please enter a target category");
      return;
    }

    const normalizedFrom = normalizeCategory(from);
    const normalizedTo = normalizeCategory(to);

    const ok = await confirm({
      title: `${actionLabel} category?`,
      message: `This will update all transactions, budgets, and fixed items from "${normalizedFrom}" to "${normalizedTo}".`,
      confirmText: actionLabel,
      cancelText: "Cancel",
      variant: "default",
    });

    if (!ok) return;

    try {
      setBusyCategory(from);
      const response = await mergeCategories({ from, to });

      setItems((prev) =>
        prev.map((item) => {
          const current = normalizeCategory(item.category);
          if (current !== response.from) return item;
          return { ...item, category: response.to };
        })
      );

      setRenameValues((prev) => {
        const next = { ...prev };
        delete next[from];
        return next;
      });
      setMergeTargets((prev) => {
        const next = { ...prev };
        delete next[from];
        return next;
      });

      toast.success(
        `Updated ${response.updatedTransactions} transaction(s) and ${response.updatedBudgets + response.mergedBudgets} budget(s).`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update categories";
      toast.error(message);
    } finally {
      setBusyCategory(null);
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="Categories"
        description="Rename or merge categories to keep your data clean."
      />

      <Card className="mt-6 p-4 sm:p-6">
        <div className="hidden grid-cols-12 gap-4 border-b border-slate-700 pb-3 text-xs font-semibold text-slate-400 sm:grid">
          <div className="col-span-3">Category</div>
          <div className="col-span-2">Transactions</div>
          <div className="col-span-3">Rename</div>
          <div className="col-span-4">Merge into</div>
        </div>

        {categories.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-400">
            No categories yet. Add a transaction to get started.
          </div>
        )}

        {categories.map((category) => {
          const renameValue = renameValues[category.name] ?? category.name;
          const mergeValue = mergeTargets[category.name] ?? "";
          const mergeOptions = categories
            .map((c) => c.name)
            .filter((name) => name !== category.name);
          const isBusy = busyCategory === category.name;

          return (
            <div
              key={category.name}
              className="grid grid-cols-1 gap-3 border-b border-slate-700 py-3 last:border-b-0 sm:grid-cols-12 sm:items-center sm:gap-4"
            >
              <div className="sm:col-span-3">
                <div className="text-xs font-semibold text-slate-400 sm:hidden">Category</div>
                <div className="break-words text-sm font-medium text-white">{category.name}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs font-semibold text-slate-400 sm:hidden">Transactions</div>
                <div className="text-sm text-slate-300">{category.count}</div>
              </div>
              <div className="sm:col-span-3">
                <div className="text-xs font-semibold text-slate-400 sm:hidden">Rename</div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) =>
                      setRenameValues((prev) => ({ ...prev, [category.name]: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-slate-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => applyMerge(category.name, renameValue, "Rename")}
                    disabled={isBusy}
                    className="w-full rounded-lg border border-slate-600 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700 disabled:opacity-50 sm:w-auto"
                  >
                    Rename
                  </button>
                </div>
              </div>
              <div className="sm:col-span-4">
                <div className="text-xs font-semibold text-slate-400 sm:hidden">Merge into</div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    value={mergeValue}
                    onChange={(e) =>
                      setMergeTargets((prev) => ({ ...prev, [category.name]: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-slate-500 focus:outline-none"
                  >
                    <option value="">Select category</option>
                    {mergeOptions.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => applyMerge(category.name, mergeValue, "Merge")}
                    disabled={!mergeValue || isBusy}
                    className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-xs text-white hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
                  >
                    Merge
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </Card>

      <div className="mt-6">
        <FixedItemsList
          items={fixedItems}
          onUpdate={loadFixedItems}
          categories={categories.map(c => c.name)}
        />
      </div>
    </AppLayout>
  );
}
