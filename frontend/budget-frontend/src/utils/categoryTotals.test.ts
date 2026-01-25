import { describe, expect, it } from "vitest";
import { buildCategoryTotals } from "./categoryTotals";
import type { Transaction } from "@/types";

describe("buildCategoryTotals", () => {
  it("should build category totals correctly for expenses", () => {
    const transactions = [
      {
        id: 1,
        date: "2024-01-15",
        category: "Food",
        amount: 50,
        type: "expense",
      },
      {
        id: 2,
        date: "2024-01-20",
        category: "Food",
        amount: 30,
        type: "expense",
      },
      {
        id: 3,
        date: "2024-01-10",
        category: "Transportation",
        amount: 20,
        type: "expense",
      },
      {
        id: 4,
        date: "2024-01-12",
        category: "Salary",
        amount: 100,
        type: "income",
      },
    ] as Transaction[];

    const result = buildCategoryTotals(transactions, "expense");
    expect(result).toEqual([
      { category: "Food", total: 80 },
      { category: "Transportation", total: 20 },
    ]);
  });
});
