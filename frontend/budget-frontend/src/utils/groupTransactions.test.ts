import { describe, expect, it } from "vitest";
import { monthKeyFromDate, sortByDateDesc } from "./groupTransactions";
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
  // Test 1: Empty array
  it("returns empty array when input is empty", () => {
    expect(sortByDateDesc([])).toEqual([]);
  });

  // Test 2: Immutability
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
