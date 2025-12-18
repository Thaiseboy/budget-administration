import { useEffect, useState } from "react";
import { getTransactions } from "../api/transactions";
import AppLayout from "../layouts/AppLayout";
import type { Transaction } from "../types/transaction";
import TransactionList from "../components/TransactionList";
import TransactionSummary from "../components/TransactionSummary";

export default function TransactionsPage() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTransactions()
      .then((data) => setItems(data))
      .catch((e: unknown) => {
        const message = e instanceof Error ? e.message : "Failed to load transactions";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, []);

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

      {loading && (
        <div className="mt-4 rounded-xl border bg-white p-4 text-sm text-slate-600">
          Loading...
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border bg-white p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mt-4">
            <TransactionSummary items={items} />
          </div>

          <div className="mt-4">
            <TransactionList items={items} />
          </div>
        </>
      )}

    </AppLayout>
  );
}