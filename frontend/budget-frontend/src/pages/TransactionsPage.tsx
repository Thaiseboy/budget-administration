import AppLayout from "../layouts/AppLayout";
import type { Transaction } from "../types/transaction";
import TransactionList from "../components/TransactionList";

const DUMMY_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    type: "income",
    amount: 2500,
    description: "Salary",
    date: "2025-12-01",
    category: "Work",
  },
  {
    id: "t2",
    type: "expense",
    amount: 65.4,
    description: "Groceries",
    date: "2025-12-03",
    category: "Food",
  },
  {
    id: "t3",
    type: "expense",
    amount: 14.99,
    description: "Spotify",
    date: "2025-12-05",
    category: "Subscriptions",
  },
];

export default function TransactionsPage() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Transactions</h1>

        <button
          type="button"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add transaction
        </button>
      </div>

      <div className="mt-4">
        <TransactionList items={DUMMY_TRANSACTIONS} />
      </div>
    </AppLayout>
  );
}