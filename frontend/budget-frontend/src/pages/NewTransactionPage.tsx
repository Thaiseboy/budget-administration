import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { createTransaction } from "../api/transactions";
import TransactionForm from "../components/TransactionForm";
import { useToast } from "../components/toast/ToastContext";
import { useAppContext } from "../hooks/useAppContext";
import { getCategories } from "../utils/categories";

export default function NewTransactionPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { items, onCreated } = useAppContext();

  const categories = useMemo(() => getCategories(items), [items]);

  return (
    <AppLayout>
      <h1 className="text-xl font-semibold">New transaction</h1>

      <TransactionForm
        submitLabel="Create"
        categories={categories}
        onSubmit={async (data) => {
          const newTransaction = await createTransaction(data);
          onCreated(newTransaction);
          toast.success("Transaction created");
          navigate("/transactions");
        }}
        onCancel={() => navigate("/transactions")}
      />
    </AppLayout>
  );
}