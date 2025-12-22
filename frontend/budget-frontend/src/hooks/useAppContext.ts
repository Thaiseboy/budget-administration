import { useOutletContext } from "react-router-dom";
import type { Transaction } from "@/types";
import type { CategoryBudget } from "@/types";

type AppContextType = {
  items: Transaction[];
  setItems: React.Dispatch<React.SetStateAction<Transaction[]>>;
  onCreated: (transaction: Transaction) => void;
  onUpdated: (transaction: Transaction) => void;
  onDeleted: (id: number) => void;
  budgetsByYear: Record<number, CategoryBudget[]>;
  loadBudgets: (year: number, month: number) => Promise<void>;
  upsertBudgetInCache: (budget: CategoryBudget) => void;
};

/**
 * Hook to access the AppShell context from any child route
 */
export function useAppContext() {
  return useOutletContext<AppContextType>();
}
