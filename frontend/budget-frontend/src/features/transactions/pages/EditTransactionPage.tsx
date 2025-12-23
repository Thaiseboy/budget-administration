import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import { updateTransaction } from "@/api";
import { TransactionForm } from "../components";
import { useToast } from "@/contexts";
import { useAppContext } from "@/hooks/useAppContext";
import { getCategories } from "@/utils";
import { PageHeader, Card } from "@/components/ui";
import { useTranslation } from "@/i18n";

export default function EditTransactionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const { t } = useTranslation();
  const { items, onUpdated } = useAppContext();

  const categories = useMemo(() => getCategories(items), [items]);

  const numericId = Number(id);
  const item = items.find((t) => t.id === numericId);

  if (!item) {
    return (
      <AppLayout>
        <Card className="p-4 text-slate-400 sm:p-6">
          {t("transactionNotFound")}
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader title={t("editTransaction")} />

      <TransactionForm
        submitLabel={t("update")}
        categories={categories}
        initialValues={{
          type: item.type,
          amount: String(item.amount),
          date: item.date.slice(0, 10),
          description: item.description ?? "",
          category: item.category ?? "",
        }}
        onSubmit={async (data) => {
          const updatedTransaction = await updateTransaction(item.id, data);
          onUpdated(updatedTransaction);
          toast.success(t("transactionUpdated"));
          navigate("/transactions");
        }}
        onCancel={() => navigate("/transactions")}
      />
    </AppLayout>
  );
}
