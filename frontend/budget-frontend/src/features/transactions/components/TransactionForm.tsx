import { useState, useMemo } from "react";
import { normalizeCategory } from "@/utils";
import { Card } from "@/components/ui";
import { Button } from "@/components/ui";
import { FormFieldGroup } from "@/components/form";
import { useTranslation } from "@/i18n";

type FormData = {
  type: "income" | "expense";
  amount: string;
  date: string;
  description?: string;
  category?: string;
};

type Props = {
  initialValues?: Partial<FormData>;
  submitLabel?: string;
  categories: string[];
  onSubmit: (data: {
    type: "income" | "expense";
    amount: number;
    date: string;
    description?: string;
    category?: string;
  }) => Promise<void>;
  onCancel?: () => void;
};

export default function TransactionForm({
  initialValues,
  submitLabel,
  categories,
  onSubmit,
  onCancel,
}: Props) {
  const { t } = useTranslation();
  const initialCategoryRaw = (initialValues?.category ?? "").trim();
  const initialCategory = initialCategoryRaw
    ? normalizeCategory(initialCategoryRaw)
    : "";
  const [formData, setFormData] = useState<FormData>({
    type: initialValues?.type ?? "expense",
    amount: initialValues?.amount ?? "",
    date: initialValues?.date ?? new Date().toISOString().split("T")[0],
    description: initialValues?.description ?? "",
    category: initialCategory,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resolvedSubmitLabel = submitLabel ?? t("save");

  const [useCustomCategory, setUseCustomCategory] = useState<boolean>(() => {
    const current = (formData.category ?? "").trim();
    return current.length > 0 && !categories.includes(current);
  });

  function handleFieldChange(name: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [name]: value as string }));
  }

  const commonInputClass =
    "border-2 bg-slate-700 px-4 py-3 text-slate-100 focus:outline-none transition-colors";
  const labelClass = "block text-sm font-semibold text-slate-200 mb-2";

  const amountField = useMemo(
    () => ({
      id: "amount",
      name: "amount",
      label: `${t("amount")} (€)`,
      type: "number" as const,
      required: true,
      placeholder: "0.00",
      step: "0.01",
      min: 0.01,
      prefix: <span className="text-slate-400 text-lg">€</span>,
      labelClass,
      inputClass: `${commonInputClass} text-lg font-semibold placeholder:text-slate-500 ${
        formData.type === "expense"
          ? "border-slate-600 focus:border-red-500"
          : "border-slate-600 focus:border-green-500"
      }`,
    }),
    [formData.type, t],
  );

  const dateField = {
    id: "date",
    name: "date",
    label: t("date"),
    type: "date" as const,
    required: true,
    labelClass,
    inputClass: `${commonInputClass} border-slate-600 focus:border-slate-500`,
  };

  const descriptionField = {
    id: "description",
    name: "description",
    label: t("description"),
    type: "text" as const,
    placeholder: t("transactionDescriptionPlaceholder"),
    labelClass,
    inputClass: `${commonInputClass} border-slate-600 focus:border-slate-500 placeholder:text-slate-500`,
  };

  const categoryField = useMemo(() => {
    if (useCustomCategory) {
      return {
        id: "category",
        name: "category",
        label: t("categoryCustom"),
        type: "text" as const,
        placeholder: t("categoryCustomPlaceholder"),
        labelClass,
        inputClass: `${commonInputClass} border-slate-600 focus:border-blue-500 placeholder:text-slate-500`,
      };
    }

    return {
      id: "category",
      name: "category",
      label: t("category"),
      type: "select" as const,
      required: false,
      labelClass,
      inputClass: `${commonInputClass} border-slate-600 focus:border-slate-500`,
      options: [
        { label: t("selectCategoryPlaceholder"), value: "" },
        ...categories.map((cat) => ({ label: cat, value: cat })),
      ],
    };
  }, [useCustomCategory, categories, t, commonInputClass, labelClass]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const amountNumber = Number(formData.amount);
      if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
        throw new Error(t("amountMustBePositive"));
      }

      await onSubmit({
        type: formData.type,
        amount: amountNumber,
        date: formData.date,
        description: formData.description || undefined,
        category: normalizeCategory(formData.category),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("failedToSaveTransaction"),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            {t("transactionType")} <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setFormData((prev) => ({ ...prev, type: "expense" }))
              }
              active={formData.type === "expense"}
              className="px-6 py-4 text-center"
              activeClassName="!border-red-500 !bg-red-500/20 !text-red-400"
            >
              <div className="text-2xl mb-1">-</div>
              <div className="text-sm font-medium">{t("expense")}</div>
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setFormData((prev) => ({ ...prev, type: "income" }))
              }
              active={formData.type === "income"}
              className="px-6 py-4 text-center"
              activeClassName="!border-green-500 !bg-green-500/20 !text-green-400"
            >
              <div className="text-2xl mb-1">+</div>
              <div className="text-sm font-medium">{t("income")}</div>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormFieldGroup
            fields={[amountField, dateField]}
            formData={formData}
            onFieldChange={handleFieldChange}
          />
        </div>

        <FormFieldGroup
          fields={[descriptionField]}
          formData={formData}
          onFieldChange={handleFieldChange}
        />

        <FormFieldGroup
          fields={[categoryField]}
          formData={formData}
          onFieldChange={handleFieldChange}
        />

        <div className="flex items-center gap-3 -mt-4">
          {formData.category && (
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => setFormData((prev) => ({ ...prev, category: "" }))}
              className="text-red-400 hover:text-red-300"
            >
              ✕ {t("clearCategory")}
            </Button>
          )}
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={() => {
              setUseCustomCategory((prev) => !prev);
              setFormData((prev) => ({ ...prev, category: "" }));
            }}
            className="ml-auto"
          >
            {useCustomCategory ? t("useExistingCategory") : t("newCategory")}
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={onCancel}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {t("cancel")}
            </Button>
          )}
          <Button
            type="submit"
            variant={"success"}
            size="lg"
            disabled={loading}
            isLoading={loading}
            className="w-full sm:flex-1"
          >
            {resolvedSubmitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
