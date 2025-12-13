import type { Transaction } from "../types/transaction";
import TransactionItem from "./TransactionItem";

type Props = {
  items: Transaction[];
};

export default function TransactionList({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6 text-sm text-slate-600">
        No transactions yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white">
      <ul className="divide-y">
        {items.map((t) => (
          <TransactionItem key={t.id} item={t} />
        ))}
      </ul>
    </div>
  );
}