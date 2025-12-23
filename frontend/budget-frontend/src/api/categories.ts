import { http } from "./http";

export type MergeCategoriesResponse = {
  from: string;
  to: string;
  updatedTransactions: number;
  updatedBudgets: number;
  mergedBudgets: number;
  updatedFixedItems: number;
};

export function mergeCategories(payload: { from: string; to: string }) {
  return http.post<MergeCategoriesResponse>("/categories/merge", payload);
}
