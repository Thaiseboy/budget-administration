import type { Transaction } from "../types";

export function normalizeCategory(raw?: string | null): string {
  const s = (raw ?? "").trim();
  if (!s) return "Other";
  const lower = s.toLowerCase();
  return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
}

/**
 * Extract unique categories from transactions
 * @param items - Array of transactions
 * @returns Sorted array of unique categories (always includes "Other")
 */
export function getCategories(items: Transaction[]): string[] {
  const set = new Set<string>();

  for (const t of items) {
    const normalized = normalizeCategory(t.category);
    if (normalized) set.add(normalized);
  }

  set.add("Other");

  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
