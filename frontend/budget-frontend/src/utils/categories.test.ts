import { describe, it, expect } from "vitest";
import { normalizeCategory, getCategories } from "./categories";
import type { Transaction } from "@/types";

describe("normalizeCategory", () => {
  it("normalizes casing", () => {
    expect(normalizeCategory("  food  ")).toBe("Food");
    expect(normalizeCategory("TRANSPORT")).toBe("Transport");
    expect(normalizeCategory("  entertainment ")).toBe("Entertainment");
    expect(normalizeCategory("")).toBe("Other");
    expect(normalizeCategory(null)).toBe("Other");
    expect(normalizeCategory(undefined)).toBe("Other");
  });
});

describe("getCategories", () => {
  it("returns sorted categories and includes Other", () => {
    const transactions = [
      {
        id: 1,
        date: "2024-01-01",
        amount: 10,
        type: "expense",
        category: "food",
      },
      {
        id: 2,
        date: "2024-01-02",
        amount: 20,
        type: "income",
        category: "Salary",
      },
      { id: 3, date: "2024-01-03", amount: 5, type: "expense", category: "" },
    ] as Transaction[];

    const result = getCategories(transactions);
    expect(result).toEqual(["Food", "Other", "Salary"]);
  });

  it("returns Other for empty array", () => {
    const result = getCategories([]);
    expect(result).toEqual(["Other"]);
  });
});
