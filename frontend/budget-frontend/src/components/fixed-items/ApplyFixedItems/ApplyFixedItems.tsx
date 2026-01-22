import { useMemo, useState } from "react";
import type { FixedMonthlyItem } from "@/types";
import { formatCurrency, normalizeCategory, getMonthOptions } from "@/utils";
import { Card, Button } from "@/components/ui";
import { useTranslation } from "@/i18n";

type Props = {
  fixedItems: FixedMonthlyItem[];
  onApply: (year: number, month: number) => void;
  currentYear?: number;
  currentMonth?: number;
};

export default function ApplyFixedItems({
  fixedItems,
  onApply,
  currentYear = new Date().getFullYear(),
  currentMonth = new Date().getMonth() + 1,
}: Props) {
  const { t, locale } = useTranslation();
  const [applyYear, setApplyYear] = useState<number>(currentYear);
  const [applyMonth, setApplyMonth] = useState<number>(currentMonth);
  const monthOptions = useMemo(() => getMonthOptions(locale), [locale]);

  if (fixedItems.length === 0) return null;

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="mb-4 text-base font-semibold text-slate-100">{t("applyFixedItemsToMonthTitle")}</h2>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="w-full sm:flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-2">{t("year")}</label>
          <select
            value={applyYear}
            onChange={(e) => setApplyYear(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-600 bg-slate-700 text-slate-100 px-3 py-2 focus:border-slate-500 focus:outline-none"
          >
            {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-2">{t("month")}</label>
          <select
            value={applyMonth}
            onChange={(e) => setApplyMonth(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-600 bg-slate-700 text-slate-100 px-3 py-2 focus:border-slate-500 focus:outline-none"
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:flex-1">
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            onClick={() => onApply(applyYear, applyMonth)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {t("applyFixedItems")}
          </Button>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        {t("fixedItemsDescription", { count: fixedItems.length })}
      </p>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-slate-100 mb-3">{t("fixedItemsPreview")}</h3>
        <div className="space-y-2">
          {fixedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-3"
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-100">
                  {item.description || t("unnamed")}
                </div>
                {item.category && (
                  <div className="text-xs text-slate-400 mt-1">
                    {normalizeCategory(item.category)}
                  </div>
                )}
              </div>
              <div className={`text-sm font-semibold ${item.type === "expense" ? "text-red-400" : "text-green-400"}`}>
                {item.type === "expense" ? "-" : "+"}{formatCurrency(item.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
