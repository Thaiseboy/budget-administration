import { describe, it, expect, vi, beforeEach } from "vitest";
import { mergeCategories } from "./categories";
import { http } from "./http";

vi.mock("./http");

describe("categories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("mergeCategories", () => {
    it("calls http.post with from and to categories", async () => {
      const payload = { from: "Food", to: "Groceries" };
      const mockResponse = {
        from: "Food",
        to: "Groceries",
        updatedTransactions: 5,
        updatedBudgets: 2,
        mergedBudgets: 1,
        updatedFixedItems: 0,
      };
      vi.mocked(http.post).mockResolvedValueOnce(mockResponse);

      const result = await mergeCategories(payload);

      expect(http.post).toHaveBeenCalledWith("/categories/merge", payload);
      expect(result).toEqual(mockResponse);
    });

    it("returns correct count of updated items", async () => {
      const payload = { from: "Transport", to: "Travel" };
      const mockResponse = {
        from: "Transport",
        to: "Travel",
        updatedTransactions: 10,
        updatedBudgets: 3,
        mergedBudgets: 2,
        updatedFixedItems: 1,
      };
      vi.mocked(http.post).mockResolvedValueOnce(mockResponse);

      const result = await mergeCategories(payload);

      expect(result.updatedTransactions).toBe(10);
      expect(result.updatedBudgets).toBe(3);
      expect(result.mergedBudgets).toBe(2);
      expect(result.updatedFixedItems).toBe(1);
    });
  });
});
