import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { createTransaction } from "../api/transactions";
import TransactionForm from "../components/TransactionForm";
import { useToast } from "../components/toast/ToastContext";
import { useAppContext } from "../hooks/useAppContext";

export default function NewTransactionPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { onCreated } = useAppContext();

  return (
    <AppLayout>
      <h1 className="text-xl font-semibold">New transaction</h1>

      <TransactionForm
        submitLabel="Create"
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