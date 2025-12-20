import type { Transaction } from "../types/transaction";

/**
 * Extract unique categories from transactions
 * @param items - Array of transactions
 * @returns Sorted array of unique categories (always includes "Other")
 */
export function getCategories(items: Transaction[]): string[] {
  const set = new Set<string>();

  for (const t of items) {
    const c = (t.category ?? "").trim();
    if (c) set.add(c);
  }

  // Always include Other as fallback
  set.add("Other");

  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
