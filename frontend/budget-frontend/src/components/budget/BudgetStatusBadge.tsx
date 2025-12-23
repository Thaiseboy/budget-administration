type Props = {
  variableExpenses: number;
  availableForVariable: number;
  monthlyRemaining: number;
};

export default function BudgetStatusBadge({
  variableExpenses,
  availableForVariable,
  monthlyRemaining,
}: Props) {
  const variablePercentage = availableForVariable > 0
    ? Math.round((variableExpenses / availableForVariable) * 100)
    : 0;

  const status =
    monthlyRemaining < 0 ? "Over budget" :
    variablePercentage >= 100 ? "Over limit" :
    variablePercentage >= 80 ? "Near limit" :
    variablePercentage >= 60 ? "Warning" :
    null;

  const statusClass =
    monthlyRemaining < 0 ? "bg-red-600 text-slate-100" :
    variablePercentage >= 100 ? "bg-red-600 text-slate-100" :
    variablePercentage >= 80 ? "bg-amber-400 text-slate-900" :
    variablePercentage >= 60 ? "bg-orange-500 text-slate-100" :
    "";

  if (!status) return null;

  return (
    <>
      <div className="mt-1">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}>
          {status}
        </span>
      </div>
      {variableExpenses > 0 && availableForVariable > 0 && (
        <div className="mt-1 text-xs text-slate-400">
          {variablePercentage}% of variable budget used
        </div>
      )}
    </>
  );
}
