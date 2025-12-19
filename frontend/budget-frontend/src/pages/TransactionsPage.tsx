import { useEffect, useState } from "react";
import { getTransactions } from "../api/transactions";
import AppLayout from "../layouts/AppLayout";
import type { Transaction } from "../types/transaction";
import TransactionList from "../components/TransactionList";
import TransactionSummary from "../components/TransactionSummary";
import { Link, useNavigate } from "react-router-dom";
import { deleteTransaction } from "../api/transactions";
import { useToast } from "../components/toast/ToastContext";

export default function TransactionsPage() {
  const navigate = useNavigate();
  const toast = useToast();
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

  function handleEdit(id: number) {
    navigate(`/transactions/${id}/edit`);
  }

  async function handleDelete(id: number) {
    const ok = window.confirm("Delete this transaction?");
    if (!ok) return;

    try {
      await deleteTransaction(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
      toast.success("Transaction deleted");
    } catch (e) {
      toast.error("Failed to delete transaction");
    }
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Transactions</h1>

        <Link
          to="/transactions/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add transaction
        </Link>
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
            <TransactionList items={items} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        </>
      )}

    </AppLayout>
  );
}