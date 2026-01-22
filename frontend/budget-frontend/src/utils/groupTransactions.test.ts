import { describe, expect, it } from "vitest";
import {
  monthKeyFromDate,
  sortByDateDesc,
  groupByMonth,
} from "./groupTransactions";
import type { Transaction } from "@/types";

describe("monthKeyFromDate", () => {
  it("should return the correct month key", () => {
    const date = "2024-02-15";
    expect(monthKeyFromDate(date)).toBe("2024-02");
  });

  it("extracts month key from ISO format", () => {
    expect(monthKeyFromDate("2024-12-31T10:30:00")).toBe("2024-12");
  });
});

describe("sortByDateDesc", () => {
  it("should sort transactions by date in descending order", () => {
    const transactions = [
      { id: 1, date: "2024-01-15" },
      { id: 2, date: "2024-03-10" },
      { id: 3, date: "2024-02-20" },
    ] as Transaction[];
    expect(sortByDateDesc(transactions)).toEqual([
      { id: 2, date: "2024-03-10" },
      { id: 3, date: "2024-02-20" },
      { id: 1, date: "2024-01-15" },
    ]);
  });
});

describe("sortByDateDesc", () => {
  // Empty array
  it("returns empty array when input is empty", () => {
    expect(sortByDateDesc([])).toEqual([]);
  });

  // Immutability
  it("does not modify the original array", () => {
    const original = [
      { id: 1, date: "2024-01-15" },
      { id: 2, date: "2024-03-10" },
    ] as Transaction[];
    const copy = [...original];
    sortByDateDesc(original);
    expect(original).toEqual(copy);
  });
});

describe("groupByMonth", () => {
  it("groups transactions by month", () => {
    const transactions = [
      { id: 1, date: "2024-01-15" },
      { id: 2, date: "2024-01-20" },
      { id: 3, date: "2024-02-10" },
    ] as Transaction[];

    const result = groupByMonth(transactions);
    // Check if there 2 months are present
    expect(result.size).toBe(2);
    // Check that januari has 2 transactions
    expect(result.get("2024-01")).toHaveLength(2);
    // Check if febuary has 1 transaction
    expect(result.get("2024-02")).toHaveLength(1);
  });
});
