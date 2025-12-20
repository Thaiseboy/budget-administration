import { http } from "./http";
import type { CategoryBudget } from "../types/budget";

export function getBudgets(year: number, month: number) {
  return http<CategoryBudget[]>(`/budgets?year=${year}&month=${month}`);
}

export function upsertBudget(payload: CategoryBudget) {
  return http<CategoryBudget>(`/budgets`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}