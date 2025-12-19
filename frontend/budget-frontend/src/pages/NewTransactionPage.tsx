import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { createTransaction } from "../api/transactions";
import TransactionForm from "../components/TransactionForm";

export default function NewTransactionPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <h1 className="text-xl font-semibold">New transaction</h1>

      <TransactionForm
        submitLabel="Create"
        onSubmit={async (data) => {
          await createTransaction(data);
          navigate("/transactions");
        }}
        onCancel={() => navigate("/transactions")}
      />
    </AppLayout>
  );
}