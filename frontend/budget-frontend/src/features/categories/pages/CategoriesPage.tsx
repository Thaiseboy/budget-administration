import { useMemo, useState, useEffect } from "react";
import AppLayout from "@/layouts/AppLayout";
import { useAppContext } from "@/hooks/useAppContext";
import { normalizeCategory } from "@/utils";
import type { FixedMonthlyItem } from "@/types";
import { getFixedItems } from "@/api";
import { FixedItemsList } from "../../dashboard/components/FixedItemsList";
import CategoryManagement from "../components/CategoryManagement";
import { PageHeader } from "@/components/ui";
import { Link } from "react-router-dom";

export default function CategoriesPage() {
  const { items, setItems } = useAppContext();
  const [fixedItems, setFixedItems] = useState<FixedMonthlyItem[]>([]);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      const key = normalizeCategory(item.category);
      map.set(key, (map.get(key) ?? 0) + 1);
    }

    for (const fixedItem of fixedItems) {
      const key = normalizeCategory(fixedItem.category);
      if (!map.has(key)) {
        map.set(key, 0);
      }
    }

    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [items, fixedItems]);

  const loadFixedItems = () => {
    getFixedItems()
      .then((data) => setFixedItems(data))
      .catch(() => setFixedItems([]));
  };

  useEffect(() => {
    loadFixedItems();
  }, []);

  return (
    <AppLayout>
      <PageHeader
        title="Categories & Settings"
        description="Manage your categories and fixed items."
        actions={
          <>
            <Link
              to="/dashboard"
              className="w-full rounded-lg border border-slate-600 px-4 py-2 text-center text-sm text-slate-300 hover:bg-slate-800 sm:w-auto"
            >
              Dashboard
            </Link>

            <Link
              to="/transactions"
              className="w-full rounded-lg border border-slate-600 px-4 py-2 text-center text-sm text-slate-300 hover:bg-slate-800 sm:w-auto"
            >
              View Transactions
            </Link>
          </>
        }
      />

      <div className="mt-6">
        <CategoryManagement categories={categories} onCategoriesUpdated={setItems} />
      </div>

      <div className="mt-6">
        <FixedItemsList
          items={fixedItems}
          onUpdate={loadFixedItems}
          categories={categories.map(c => c.name)}
        />
      </div>
    </AppLayout>
  );
}
