import Card from "../ui/Card";
import { formatCurrency } from "../../utils/formatCurrency";

type Props = {
  title: string;
  fixedIncome: number;
  fixedExpense: number;
  variableIncome: number;
  variableExpense: number;
};

export default function FinancialSummary({
  title,
  fixedIncome,
  fixedExpense,
  variableIncome,
  variableExpense,
}: Props) {
  const totalIncome = fixedIncome + variableIncome;
  const totalExpense = fixedExpense + variableExpense;
  const remaining = totalIncome - totalExpense;

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-base font-semibold text-white">{title}</h2>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <div className="text-xs text-slate-400 mb-2">Income</div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Fixed income:</span>
              <span className="text-green-400 font-semibold">{formatCurrency(fixedIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Variable income:</span>
              <span className="text-green-400 font-semibold">{formatCurrency(variableIncome)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-600 pt-2">
              <span className="text-white font-semibold">Total income:</span>
              <span className="text-green-300 font-bold">{formatCurrency(totalIncome)}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400 mb-2">Expenses</div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Fixed expenses:</span>
              <span className="text-red-400 font-semibold">{formatCurrency(fixedExpense)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Variable expenses:</span>
              <span className="text-red-400 font-semibold">{formatCurrency(variableExpense)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-600 pt-2">
              <span className="text-white font-semibold">Total expenses:</span>
              <span className="text-red-300 font-bold">{formatCurrency(totalExpense)}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400 mb-2">Summary</div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Total income:</span>
              <span className="text-green-400 font-semibold">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total expenses:</span>
              <span className="text-red-400 font-semibold">{formatCurrency(totalExpense)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-600 pt-2">
              <span className="text-white font-semibold">Remaining:</span>
              <span
                className={`font-bold ${remaining >= 0 ? "text-emerald-300" : "text-red-300"}`}
              >
                {formatCurrency(remaining)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
