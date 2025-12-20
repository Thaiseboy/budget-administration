import type { Transaction } from "../types/transaction";
import { normalizeCategory } from "./categories";

export type CategoryTotal = {
  category: string;
  total: number;
};

export function buildCategoryTotals(
  items: Transaction[],
  type: "expense" | "income"
): CategoryTotal[] {
  const map = new Map<string, number>();

  for (const t of items) {
    if (t.type !== type) continue;

    const key = normalizeCategory(t.category);
    map.set(key, (map.get(key) ?? 0) + t.amount);
  }

  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}
