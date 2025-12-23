import { useState } from "react";
import type { Transaction } from "@/types";
import { normalizeCategory } from "@/utils";
import { mergeCategories } from "@/api";
import { useToast, useConfirm } from "@/contexts";
import { Card, Button } from "@/components/ui";
import { useTranslation } from "@/i18n";

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
  const { t } = useTranslation();
  const [renameValues, setRenameValues] = useState<Record<string, string>>({});
  const [mergeTargets, setMergeTargets] = useState<Record<string, string>>({});
  const [busyCategory, setBusyCategory] = useState<string | null>(null);

  async function applyMerge(from: string, toRaw: string, action: "rename" | "merge") {
    const to = toRaw.trim();
    if (!to) {
      toast.error(t("categoryTargetRequired"));
      return;
    }

    const normalizedFrom = normalizeCategory(from);
    const normalizedTo = normalizeCategory(to);
    const actionLabel = action === "rename" ? t("rename") : t("merge");

    const ok = await confirm({
      title: action === "rename" ? t("renameCategoryConfirmTitle") : t("mergeCategoryConfirmTitle"),
      message: t("categoryUpdateWarning", { from: normalizedFrom, to: normalizedTo }),
      confirmText: actionLabel,
      cancelText: t("cancel"),
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

      toast.success(action === "rename" ? t("categoryRenamedSuccess") : t("categoryMergedSuccess"));
    } catch (err) {
      toast.error(action === "rename" ? t("categoryRenameFailed") : t("categoryMergeFailed"));
      console.error(err);
    } finally {
      setBusyCategory(null);
    }
  }

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="mb-4 text-base font-semibold text-slate-100">{t("manageCategoriesTitle")}</h2>
      <p className="mb-4 text-sm text-slate-400">
        {t("manageCategoriesDescription")}
      </p>

      <div className="hidden grid-cols-12 gap-4 border-b border-slate-700 pb-3 text-xs font-semibold text-slate-400 sm:grid">
        <div className="col-span-3">{t("category")}</div>
        <div className="col-span-2">{t("transactions")}</div>
        <div className="col-span-3">{t("rename")}</div>
        <div className="col-span-4">{t("mergeInto")}</div>
      </div>

      {categories.length === 0 && (
        <div className="py-8 text-center text-sm text-slate-400">
          {t("noCategoriesYet")}
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
              <div className="text-xs font-semibold text-slate-400 sm:hidden">{t("category")}</div>
              <div className="break-words text-sm font-medium text-slate-100">{category.name}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs font-semibold text-slate-400 sm:hidden">{t("transactions")}</div>
              <div className="text-sm text-slate-300">{category.count}</div>
            </div>
            <div className="sm:col-span-3">
              <div className="text-xs font-semibold text-slate-400 sm:hidden">{t("rename")}</div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) =>
                    setRenameValues((prev) => ({ ...prev, [category.name]: e.target.value }))
                  }
                  disabled={isBusy}
                  className="w-full flex-1 rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-xs text-slate-100 focus:border-slate-500 focus:outline-none disabled:opacity-50"
                />
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => applyMerge(category.name, renameValue, "rename")}
                  disabled={!renameValue.trim() || renameValue === category.name || isBusy}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  {t("rename")}
                </Button>
              </div>
            </div>
            <div className="sm:col-span-4">
              <div className="text-xs font-semibold text-slate-400 sm:hidden">{t("mergeInto")}</div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <select
                  value={mergeValue}
                  onChange={(e) =>
                    setMergeTargets((prev) => ({ ...prev, [category.name]: e.target.value }))
                  }
                  disabled={isBusy}
                  className="w-full flex-1 rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-xs text-slate-100 focus:border-slate-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="">{t("selectCategoryPlaceholder")}</option>
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
                  onClick={() => applyMerge(category.name, mergeValue, "merge")}
                  disabled={!mergeValue || isBusy}
                  className="w-full sm:w-auto"
                >
                  {t("merge")}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
