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
  return http<MergeCategoriesResponse>("/categories/merge", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
