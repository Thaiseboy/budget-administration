import type { Transaction } from "../types/transaction";
import { formatCurrency } from "../utils/formatCurrency";

type Props = {
  item: Transaction;
};

export default function TransactionItem({ item }: Props) {
  const isExpense = item.type === "expense";

  return (
    <li className="flex items-center justify-between px-4 py-3">
      <div>
        <div className="font-medium">{item.description ?? "Untitled"}</div>
        <div className="text-xs text-slate-500">
          {item.date}
          {item.category ? ` • ${item.category}` : ""}
        </div>
      </div>

      <div className="text-right">
        <div className={isExpense ? "font-semibold text-red-600" : "font-semibold text-emerald-600"}>
          {isExpense ? "-" : "+"}{formatCurrency(item.amount)}
        </div>
        
        <div className="text-xs text-slate-500">{item.type}</div>
      </div>
    </li>
  );
}
