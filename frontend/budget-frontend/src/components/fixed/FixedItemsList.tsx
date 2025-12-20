import { useState } from "react";
import type { FixedMonthlyItem } from "../../types/fixedItem";
import { createFixedItem, updateFixedItem, deleteFixedItem } from "../../api/fixedItems";
import { normalizeCategory } from "../../utils/categories";

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
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Fixed Monthly Items
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Fixed Item
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
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
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="e.g., Salary, Rent, Internet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              {useCustomCategory ? (
                <input
                  type="text"
                  value={formData.category ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value || null })
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Enter custom category"
                />
              ) : (
                <select
                  value={formData.category ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value || null })
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
              <div className="flex justify-between items-center">
                {formData.category && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, category: null }));
                      setUseCustomCategory(false);
                    }}
                    className="text-xs text-red-400 hover:text-red-300 underline"
                  >
                    ✕ Clear category
                  </button>
                )}
                <div className={formData.category ? "" : "ml-auto"}>
                  <button
                    type="button"
                    onClick={() => setUseCustomCategory((prev) => !prev)}
                    className="text-xs text-slate-400 hover:text-slate-300 underline"
                  >
                    {useCustomCategory ? "← Use existing category" : "+ Add custom category"}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                }
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as "income" | "expense" })
                }
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {editingId ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white rounded hover:bg-slate-400 dark:hover:bg-slate-500"
            >
              Cancel
            </button>
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
                  className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded"
                >
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {item.description}
                    </div>
                    {item.category && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {item.category}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-green-900 dark:text-green-300">
                      €{item.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => item.id && handleDelete(item.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
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
                  className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded"
                >
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {item.description}
                    </div>
                    {item.category && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {item.category}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-red-900 dark:text-red-300">
                      €{item.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => item.id && handleDelete(item.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
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
