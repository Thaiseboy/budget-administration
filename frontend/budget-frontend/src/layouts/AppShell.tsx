import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { getTransactions } from "../api/transactions";
import type { Transaction } from "../types/transaction";
import TransactionsPage from "../pages/TransactionsPage";
import NewTransactionPage from "../pages/NewTransactionPage";
import EditTransactionPage from "../pages/EditTransactionPage";
import DashboardPage from "../pages/DashboardPage";

/**
 * AppShell - Central data management and routing for the entire app
 * Loads transactions once and provides them to all child routes via context
 */
export default function AppShell() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load transactions once on mount
  useEffect(() => {
    getTransactions()
      .then((data) => setItems(data))
      .catch((e: unknown) => {
        const message = e instanceof Error ? e.message : "Failed to load transactions";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, []);

  // Callback when a new transaction is created
  function handleCreated(newTransaction: Transaction) {
    setItems((prev) => [...prev, newTransaction]);
  }

  // Callback when a transaction is updated
  function handleUpdated(updatedTransaction: Transaction) {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedTransaction.id ? updatedTransaction : item))
    );
  }

  // Callback when a transaction is deleted
  function handleDeleted(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 text-slate-300">
          Loading transactions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  const contextValue = {
    items,
    setItems,
    onCreated: handleCreated,
    onUpdated: handleUpdated,
    onDeleted: handleDeleted,
  };

  return (
    <Routes>
      <Route path="/" element={<Outlet context={contextValue} />}>
        <Route index element={<Navigate to="/transactions" replace />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="transactions/new" element={<NewTransactionPage />} />
        <Route path="transactions/:id/edit" element={<EditTransactionPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}
