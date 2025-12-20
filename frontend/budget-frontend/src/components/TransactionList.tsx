import type { Transaction } from "../types/transaction";
import TransactionItem from "./TransactionItem";

type Props = {
  items: Transaction[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function TransactionList({ items, onEdit, onDelete }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4 text-sm text-slate-300 sm:p-6">
        No transactions yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800">
      <ul className="divide-y divide-slate-700">
        {items.map((t) => (
          <TransactionItem key={t.id} item={t} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  );
}
