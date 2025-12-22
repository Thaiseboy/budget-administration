import { useState } from "react";
import type { Transaction } from "@/types";
import { normalizeCategory } from "@/utils";
import { mergeCategories } from "@/api";
import { useToast, useConfirm } from "@/contexts";
import { Card, Button } from "@/components/ui";

type Category = {
  name: string;
  count: number;
};

type Props = {
  categories: Category[];
  onCategoriesUpdated: (updater: (items: Transaction[]) => Transaction[]) => void;
};

export default function CategoryManagement({ categories, onCategoriesUpdated }: Props) {
  const toast = useToast();
  const confirm = useConfirm();
  const [renameValues, setRenameValues] = useState<Record<string, string>>({});
  const [mergeTargets, setMergeTargets] = useState<Record<string, string>>({});
  const [busyCategory, setBusyCategory] = useState<string | null>(null);

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

      onCategoriesUpdated((prev) =>
        prev.map((item) => {
          const current = normalizeCategory(item.category);
          if (current !== response.from) return item;
          return { ...item, category: response.to };
        })
      );

      setRenameValues((prev) => {
        const { [from]: _, ...rest } = prev;
        return rest;
      });

      setMergeTargets((prev) => {
        const { [from]: _, ...rest } = prev;
        return rest;
      });

      toast.success(`Category ${actionLabel.toLowerCase()}d successfully`);
    } catch (err) {
      toast.error(`Failed to ${actionLabel.toLowerCase()} category`);
      console.error(err);
    } finally {
      setBusyCategory(null);
    }
  }

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="mb-4 text-base font-semibold text-white">Manage Categories</h2>
      <p className="mb-4 text-sm text-slate-400">
        Rename or merge categories to keep your data organized.
      </p>

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
                  disabled={isBusy}
                  className="w-full flex-1 rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-xs text-white focus:border-slate-500 focus:outline-none disabled:opacity-50"
                />
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => applyMerge(category.name, renameValue, "Rename")}
                  disabled={!renameValue.trim() || renameValue === category.name || isBusy}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  Rename
                </Button>
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
                  disabled={isBusy}
                  className="w-full flex-1 rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-xs text-white focus:border-slate-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="">Select category...</option>
                  {mergeOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="success"
                  size="sm"
                  onClick={() => applyMerge(category.name, mergeValue, "Merge")}
                  disabled={!mergeValue || isBusy}
                  className="w-full sm:w-auto"
                >
                  Merge
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
