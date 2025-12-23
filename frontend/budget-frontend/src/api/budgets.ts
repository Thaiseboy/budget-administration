import { http } from "./http";
import type { CategoryBudget } from "../types";

export function getBudgets(year: number, month: number) {
  return http.get<CategoryBudget[]>(`/budgets?year=${year}&month=${month}`);
}

export function upsertBudget(payload: CategoryBudget) {
  return http.put<CategoryBudget>(`/budgets`, payload);
}