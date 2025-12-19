import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import type { Transaction } from "../types/transaction";
import { getTransaction, updateTransaction } from "../api/transactions";
import TransactionForm from "../components/TransactionForm";

export default function EditTransactionPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [item, setItem] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  const numericId = Number(id);

  useEffect(() => {
    if (!Number.isFinite(numericId)) return;

    getTransaction(numericId)
      .then((data) => setItem(data))
      .finally(() => setLoading(false));
  }, [numericId]);

  return (
    <AppLayout>
      <h1 className="text-xl font-semibold">Edit transaction</h1>

      {loading && (
        <div className="mt-4 rounded-xl border bg-white p-4 text-sm text-slate-600">
          Loading...
        </div>
      )}

      {!loading && item && (
        <TransactionForm
          submitLabel="Update"
          initialValues={{
            type: item.type,
            amount: String(item.amount),
            date: item.date.slice(0, 10), // ISO -> YYYY-MM-DD
            description: item.description ?? "",
            category: item.category ?? "",
          }}
          onSubmit={async (data) => {
            await updateTransaction(item.id, data);
            navigate("/transactions");
          }}
          onCancel={() => navigate("/transactions")}
        />
      )}
    </AppLayout>
  );
}