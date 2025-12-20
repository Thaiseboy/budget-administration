import { http } from "./http";
import type { CategoryBudget } from "../types/budget";

export function getBudgets(year: number) {
  return http<CategoryBudget[]>(`/budgets?year=${year}`);
}

export function upsertBudget(payload: CategoryBudget) {
  return http<CategoryBudget>(`/budgets`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}