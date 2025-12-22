import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import { createTransaction } from "@/api";
import { TransactionForm } from "../components";
import { useToast } from "@/contexts";
import { useAppContext } from "@/hooks/useAppContext";
import { getCategories } from "@/utils";
import { PageHeader } from "@/components/ui";

export default function NewTransactionPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { items, onCreated } = useAppContext();

  const categories = useMemo(() => getCategories(items), [items]);

  return (
    <AppLayout>
      <PageHeader title="New transaction" />

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
