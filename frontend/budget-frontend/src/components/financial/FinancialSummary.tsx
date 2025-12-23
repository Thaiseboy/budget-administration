import { Card } from "@/components/ui";
import { formatCurrency } from "@/utils";
import { useTranslation } from "@/i18n";

type TypeFilter = "all" | "income" | "expense";

type Props = {
  title: string;
  fixedIncome: number;
  fixedExpense: number;
  variableIncome: number;
  variableExpense: number;
  typeFilter?: TypeFilter;
};

export default function FinancialSummary({
  title,
  fixedIncome,
  fixedExpense,
  variableIncome,
  variableExpense,
  typeFilter = "all",
}: Props) {
  const { t } = useTranslation();
  const totalIncome = fixedIncome + variableIncome;
  const totalExpense = fixedExpense + variableExpense;
  const remaining = totalIncome - totalExpense;

  const showIncome = typeFilter === "all" || typeFilter === "income";
  const showExpense = typeFilter === "all" || typeFilter === "expense";
  const showSummary = typeFilter === "all";

  const gridCols = typeFilter === "all" ? "md:grid-cols-3" : "md:grid-cols-1";

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-base font-semibold text-slate-100">{title}</h2>

      <div className={`mt-4 grid gap-4 ${gridCols}`}>
        {showIncome && (
          <div>
            <div className="text-xs text-slate-400 mb-2">{t("income")}</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{t("fixedIncome")}:</span>
                <span className="text-green-400 font-semibold">{formatCurrency(fixedIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t("variableIncome")}:</span>
                <span className="text-green-400 font-semibold">{formatCurrency(variableIncome)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-600 pt-2">
                <span className="text-slate-100 font-semibold">{t("totalIncome")}:</span>
                <span className="text-green-300 font-bold">{formatCurrency(totalIncome)}</span>
              </div>
            </div>
          </div>
        )}

        {showExpense && (
          <div>
            <div className="text-xs text-slate-400 mb-2">{t("expenses")}</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{t("fixedExpenses")}:</span>
                <span className="text-red-400 font-semibold">{formatCurrency(fixedExpense)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t("variableExpenses")}:</span>
                <span className="text-red-400 font-semibold">{formatCurrency(variableExpense)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-600 pt-2">
                <span className="text-slate-100 font-semibold">{t("totalExpenses")}:</span>
                <span className="text-red-300 font-bold">{formatCurrency(totalExpense)}</span>
              </div>
            </div>
          </div>
        )}

        {showSummary && (
          <div>
            <div className="text-xs text-slate-400 mb-2">{t("summary")}</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{t("totalIncome")}:</span>
                <span className="text-green-400 font-semibold">{formatCurrency(totalIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t("totalExpenses")}:</span>
                <span className="text-red-400 font-semibold">{formatCurrency(totalExpense)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-600 pt-2">
                <span className="text-slate-100 font-semibold">{t("remaining")}:</span>
                <span
                  className={`font-bold ${remaining >= 0 ? "text-emerald-300" : "text-red-300"}`}
                >
                  {formatCurrency(remaining)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
