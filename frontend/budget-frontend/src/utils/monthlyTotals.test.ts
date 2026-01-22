import { describe, it, expect } from "vitest";
import { buildMonthlyTotals, withCumulativeBalance } from "./monthlyTotals";
import type { Transaction } from "@/types";

describe("buildMonthlyTotals", () => {
  it("return 12 months for a year", () => {
    const result = buildMonthlyTotals([], 2024);
    expect(result).toHaveLength(12);
  });

  it("calculates income and expense correctly", () => {
    const transactions = [
      { id: 1, date: "2024-01-15", amount: 100, type: "income" },
      { id: 2, date: "2024-01-20", amount: 30, type: "expense" },
    ] as Transaction[];

    const result = buildMonthlyTotals(transactions, 2024);
    const january = result.find((m) => m.monthKey === "2024-01");

    expect(january?.income).toBe(100);
    expect(january?.expense).toBe(30);
    expect(january?.balance).toBe(70);
  });
});

describe("withCumulativeBalance", () => {
  it("calculates cumulative balance correctly", () => {
    const monthlyTotals = [
      {
        monthKey: "2024-01",
        label: "Jan",
        income: 100,
        expense: 50,
        balance: 50,
      },
      {
        monthKey: "2024-02",
        label: "Feb",
        income: 200,
        expense: 100,
        balance: 100,
      },
      {
        monthKey: "2024-03",
        label: "Mar",
        income: 150,
        expense: 200,
        balance: -50,
      },
    ];

    const result = withCumulativeBalance(monthlyTotals);

    expect(result[0].cumulativeBalance).toBe(50);
    expect(result[1].cumulativeBalance).toBe(150);
    expect(result[2].cumulativeBalance).toBe(100);
  });
});
