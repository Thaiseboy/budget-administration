import { useState } from "react";
import type { FixedMonthlyItem } from "../../../types/fixedItem";
import { createFixedItem, updateFixedItem, deleteFixedItem } from "../../../api/fixedItems";
import { normalizeCategory } from "../../../utils/categories";
import FormFieldGroup from "../../../components/form/FormFieldGroup";
import Button from "../../../components/ui/Button";

type Props = {
  items: FixedMonthlyItem[];
  onUpdate: () => void;
  categories: string[];
};

export function FixedItemsList({ items, onUpdate, categories }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<FixedMonthlyItem, "id">>({
    description: "",
    category: null,
    amount: 0,
    type: "expense",
  });
  const [useCustomCategory, setUseCustomCategory] = useState<boolean>(() => {
    const current = (formData.category ?? "").trim();
    return current.length > 0 && !categories.includes(current);
  });

  const incomeItems = items.filter((item) => item.type === "income");
  const expenseItems = items.filter((item) => item.type === "expense");

  const totalFixedIncome = incomeItems.reduce((sum, item) => sum + item.amount, 0);
  const totalFixedExpense = expenseItems.reduce((sum, item) => sum + item.amount, 0);

  const fieldUi = {
    labelClass: "block text-sm font-medium text-slate-700 dark:text-slate-300",
    inputClass:
      "border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white",
  };

  const fields = [
    {
      id: "description",
      name: "description",
      label: "Description",
      type: "text" as const,
      required: true,
      placeholder: "e.g., Salary, Rent, Internet",
      ...fieldUi,
    },
    useCustomCategory
      ? {
          id: "category",
          name: "category",
          label: "Category (Custom)",
          type: "text" as const,
          placeholder: "Enter custom category",
          ...fieldUi,
        }
      : {
          id: "category",
          name: "category",
          label: "Category",
          type: "select" as const,
          options: [
            { label: "-- Select Category --", value: "" },
            ...categories.map((cat) => ({ label: cat, value: cat })),
          ],
          ...fieldUi,
        },
    {
      id: "amount",
      name: "amount",
      label: "Amount",
      type: "number" as const,
      required: true,
      step: "0.01",
      min: 0,
      ...fieldUi,
    },
    {
      id: "type",
      name: "type",
      label: "Type",
      type: "select" as const,
      required: true,
      options: [
        { label: "Income", value: "income" },
        { label: "Expense", value: "expense" },
      ],
      ...fieldUi,
    },
  ];

  const handleFieldChange = (name: string, value: string | boolean) => {
    if (name === "amount") {
      const amountValue = Number(value);
      setFormData((prev) => ({
        ...prev,
        amount: Number.isFinite(amountValue) ? amountValue : 0,
      }));
      return;
    }

    if (name === "category") {
      const nextValue = typeof value === "string" ? value : "";
      setFormData((prev) => ({
        ...prev,
        category: nextValue.trim() ? nextValue : null,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value as string }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        category: normalizeCategory(formData.category),
      };
      if (editingId) {
        await updateFixedItem(editingId, payload);
        setEditingId(null);
      } else {
        await createFixedItem(payload);
        setIsAdding(false);
      }
      setFormData({
        description: "",
        category: null,
        amount: 0,
        type: "expense",
      });
      setUseCustomCategory(false);
      onUpdate();
    } catch (err) {
      console.error("Failed to save fixed item", err);
    }
  };

  const handleEdit = (item: FixedMonthlyItem) => {
    setEditingId(item.id ?? null);
    const normalizedCategory = item.category ? normalizeCategory(item.category) : null;
    setFormData({
      description: item.description,
      category: normalizedCategory,
      amount: item.amount,
      type: item.type,
    });
    const currentCategory = (normalizedCategory ?? "").trim();
    setUseCustomCategory(currentCategory.length > 0 && !categories.includes(currentCategory));
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this fixed item?")) {
      return;
    }
    try {
      await deleteFixedItem(id);
      onUpdate();
    } catch (err) {
      console.error("Failed to delete fixed item", err);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      description: "",
      category: null,
      amount: 0,
      type: "expense",
    });
    setUseCustomCategory(false);
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-slate-800 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
          Fixed Monthly Items
        </h2>
        {!isAdding && (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            + Add Fixed Item
          </Button>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded">
          <div className="text-sm text-green-700 dark:text-green-400">Total Fixed Income</div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-300">
            €{totalFixedIncome.toFixed(2)}
          </div>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded">
          <div className="text-sm text-red-700 dark:text-red-400">Total Fixed Expense</div>
          <div className="text-2xl font-bold text-red-900 dark:text-red-300">
            €{totalFixedExpense.toFixed(2)}
          </div>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 rounded bg-slate-50 p-4 dark:bg-slate-700">
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormFieldGroup
              fields={fields}
              formData={formData}
              onFieldChange={handleFieldChange}
            />
            <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              {formData.category && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, category: null }));
                    setUseCustomCategory(false);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  ✕ Clear category
                </Button>
              )}
              <div className={formData.category ? "" : "sm:ml-auto"}>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setUseCustomCategory((prev) => !prev);
                    setFormData((prev) => ({ ...prev, category: null }));
                  }}
                  className="text-slate-400 hover:text-slate-300"
                >
                  {useCustomCategory ? "← Use existing category" : "+ Add custom category"}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="submit"
              variant="success"
              size="md"
              className="w-full sm:w-auto"
            >
              {editingId ? "Update" : "Save"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {incomeItems.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
              Fixed Income
            </h3>
            <div className="space-y-2">
              {incomeItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded bg-green-50 p-3 dark:bg-green-900/20 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="break-words font-medium text-slate-900 dark:text-white">
                      {item.description}
                    </div>
                    {item.category && (
                      <div className="break-words text-sm text-slate-600 dark:text-slate-400">
                        {item.category}
                      </div>
                    )}
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                    <span className="text-lg font-semibold text-green-900 dark:text-green-300 sm:mr-4">
                      €{item.amount.toFixed(2)}
                    </span>
                    <div className="flex w-full gap-2 sm:w-auto">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto"
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => item.id && handleDelete(item.id)}
                        className="w-full sm:w-auto"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {expenseItems.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
              Fixed Expenses
            </h3>
            <div className="space-y-2">
              {expenseItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded bg-red-50 p-3 dark:bg-red-900/20 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="break-words font-medium text-slate-900 dark:text-white">
                      {item.description}
                    </div>
                    {item.category && (
                      <div className="break-words text-sm text-slate-600 dark:text-slate-400">
                        {item.category}
                      </div>
                    )}
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                    <span className="text-lg font-semibold text-red-900 dark:text-red-300 sm:mr-4">
                      €{item.amount.toFixed(2)}
                    </span>
                    <div className="flex w-full gap-2 sm:w-auto">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto"
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => item.id && handleDelete(item.id)}
                        className="w-full sm:w-auto"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {items.length === 0 && !isAdding && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No fixed monthly items yet. Add items like salary, rent, utilities that recur every
            month.
          </div>
        )}
      </div>
    </div>
  );
}
