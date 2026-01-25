import { describe, it, expect, vi, beforeEach } from "vitest";
import { getBudgets, upsertBudget } from "./budgets";
import { http } from "./http";

vi.mock("./http");

describe("budgets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getBudgets", () => {
    it("calls http.get with year and month query params", async () => {
      const mockBudgets = [
        { id: 1, category: "Food", amount: 500, year: 2024, month: 1 },
        { id: 2, category: "Transport", amount: 200, year: 2024, month: 1 },
      ];
      vi.mocked(http.get).mockResolvedValueOnce(mockBudgets);

      const result = await getBudgets(2024, 1);

      expect(http.get).toHaveBeenCalledWith("/budgets?year=2024&month=1");
      expect(result).toEqual(mockBudgets);
    });

    it("handles different year and month values", async () => {
      vi.mocked(http.get).mockResolvedValueOnce([]);

      await getBudgets(2023, 12);

      expect(http.get).toHaveBeenCalledWith("/budgets?year=2023&month=12");
    });
  });

  describe("upsertBudget", () => {
    it("calls http.put with budget payload", async () => {
      const budgetPayload = {
        id: 1,
        category: "Food",
        amount: 600,
        year: 2024,
        month: 1,
      };
      vi.mocked(http.put).mockResolvedValueOnce(budgetPayload);

      const result = await upsertBudget(budgetPayload);

      expect(http.put).toHaveBeenCalledWith("/budgets", budgetPayload);
      expect(result).toEqual(budgetPayload);
    });

    it("creates new budget when id is not provided", async () => {
      const newBudget = {
        category: "Entertainment",
        amount: 100,
        year: 2024,
        month: 2,
      };
      const mockResponse = { id: 3, ...newBudget };
      vi.mocked(http.put).mockResolvedValueOnce(mockResponse);

      const result = await upsertBudget(newBudget);

      expect(http.put).toHaveBeenCalledWith("/budgets", newBudget);
      expect(result).toEqual(mockResponse);
    });
  });
});
