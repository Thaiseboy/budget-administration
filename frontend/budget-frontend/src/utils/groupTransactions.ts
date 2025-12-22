import type { Transaction } from "../types";

export type MonthKey = `${number}-${string}`;

/**
 * Extracts the month key from a date string
 * @param date - Date string in "YYYY-MM-DD" or ISO format
 * @returns Month key in "YYYY-MM" format
 */
export function monthKeyFromDate(date: string): MonthKey {
  return date.slice(0, 7) as MonthKey; // works for "YYYY-MM-DD" and ISO
}

/**
 * Sorts transactions by date in descending order (newest first)
 * @param items - Array of transactions to sort
 * @returns New sorted array (original array remains unchanged)
 */
export function sortByDateDesc(items: Transaction[]) {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Groups transactions by month
 * @param items - Array of transactions to group
 * @returns Map with month keys as keys and arrays of transactions as values
 * @example
 * // Returns: Map { "2025-12" => [tx1, tx2], "2025-11" => [tx3] }
 */
export function groupByMonth(items: Transaction[]) {
  const sorted = sortByDateDesc(items);
  const map = new Map<MonthKey, Transaction[]>();

  for (const t of sorted) {
    const key = monthKeyFromDate(t.date);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }

  return map;
}
