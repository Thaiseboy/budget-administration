import { useEffect, useState, useRef } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { getTransactions } from "../api/transactions";
import type { Transaction } from "@/types";
import TransactionsPage from "../features/transactions/pages/TransactionsPage";
import NewTransactionPage from "../features/transactions/pages/NewTransactionPage";
import EditTransactionPage from "../features/transactions/pages/EditTransactionPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import CategoriesPage from "../features/categories/pages/CategoriesPage";
import type { CategoryBudget } from "@/types";
import { getBudgets } from "../api/budgets";
import Card from "../components/ui/Card";

/**
 * AppShell - Central data management and routing for the entire app
 * Loads transactions once and provides them to all child routes via context
 */
export default function AppShell() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [budgetsByYear, setBudgetsByYear] = useState<Record<number, CategoryBudget[]>>({});
  const budgetsLoadingRef = useRef<Record<number, boolean>>({});

  useEffect(() => {
    getTransactions()
      .then((data) => setItems(data))
      .catch((e: unknown) => {
        const message = e instanceof Error ? e.message : "Failed to load transactions";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleCreated(newTransaction: Transaction) {
    setItems((prev) => [...prev, newTransaction]);
  }

  function handleUpdated(updatedTransaction: Transaction) {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedTransaction.id ? updatedTransaction : item))
    );
  }

  function handleDeleted(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function loadBudgets(year: number, month: number) {
    if (budgetsByYear[year]) return;

    if (budgetsLoadingRef.current[year]) return;
    budgetsLoadingRef.current[year] = true;

    try {
      const data = await getBudgets(year, month);
      setBudgetsByYear((prev) => ({ ...prev, [year]: data }));
    } finally {
      budgetsLoadingRef.current[year] = false;
    }
  }

  function upsertBudgetInCache(budget: CategoryBudget) {
    setBudgetsByYear((prev) => {
      const list = prev[budget.year] ?? [];
      const idx = list.findIndex((b) => b.category === budget.category);

      const next =
        idx === -1
          ? [...list, budget]
          : list.map((b) => (b.category === budget.category ? budget : b));

      return { ...prev, [budget.year]: next };
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <Card className="p-6 text-slate-300">
          Loading transactions...
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <Card className="p-6 text-red-400">
          {error}
        </Card>
      </div>
    );
  }

  const contextValue = {
    items,
    setItems,
    onCreated: handleCreated,
    onUpdated: handleUpdated,
    onDeleted: handleDeleted,
    budgetsByYear,
    loadBudgets,
    upsertBudgetInCache,
  };

  return (
    <Routes>
      <Route path="/" element={<Outlet context={contextValue} />}>
        <Route index element={<Navigate to="/transactions" replace />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="transactions/new" element={<NewTransactionPage />} />
        <Route path="transactions/:id/edit" element={<EditTransactionPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="categories" element={<CategoriesPage />} />
      </Route>
    </Routes>
  );
}
