import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { updateTransaction } from "../api/transactions";
import TransactionForm from "../components/TransactionForm";
import { useToast } from "../components/toast/ToastContext";
import { useAppContext } from "../hooks/useAppContext";
import { getCategories } from "../utils/categories";

export default function EditTransactionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const { items, onUpdated } = useAppContext();

  const categories = useMemo(() => getCategories(items), [items]);

  const numericId = Number(id);
  const item = items.find((t) => t.id === numericId);

  if (!item) {
    return (
      <AppLayout>
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 text-slate-400">
          Transaction not found
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h1 className="text-xl font-semibold">Edit transaction</h1>

      <TransactionForm
        submitLabel="Update"
        categories={categories}
        initialValues={{
          type: item.type,
          amount: String(item.amount),
          date: item.date.slice(0, 10), // ISO -> YYYY-MM-DD
          description: item.description ?? "",
          category: item.category ?? "",
        }}
        onSubmit={async (data) => {
          const updatedTransaction = await updateTransaction(item.id, data);
          onUpdated(updatedTransaction);
          toast.success("Transaction updated");
          navigate("/transactions");
        }}
        onCancel={() => navigate("/transactions")}
      />
    </AppLayout>
  );
}