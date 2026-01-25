import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "./transactions";
import { http } from "./http";

vi.mock("./http");

describe("transactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTransactions", () => {
    it("calls http.get to fetch all transactions", async () => {
      const mockTransactions = [
        {
          id: 1,
          date: "2024-01-01",
          type: "income",
          amount: 100,
          category: "Salary",
          description: "January salary",
        },
        {
          id: 2,
          date: "2024-01-02",
          type: "expense",
          amount: 50,
          category: "Food",
          description: "groceries",
        },
      ];
      vi.mocked(http.get).mockResolvedValueOnce(mockTransactions);

      const result = await getTransactions();

      expect(http.get).toHaveBeenCalledWith("/transactions", undefined);
      expect(result).toEqual(mockTransactions);
    });
  });

  describe("getTransaction", () => {
    it("calls http.get with transaction id", async () => {
      const mockTransaction = {
        id: 1,
        date: "2024-01-01",
        type: "income",
        amount: 100,
        category: "Salary",
        description: "Test",
      };
      vi.mocked(http.get).mockResolvedValueOnce(mockTransaction);

      const result = await getTransaction(1);

      expect(http.get).toHaveBeenCalledWith("/transactions/1");
      expect(result).toEqual(mockTransaction);
    });
  });

  describe("createTransaction", () => {
    it("calls http.post with transaction data", async () => {
      const newTransaction = {
        date: "2024-01-01",
        type: "expense" as const,
        amount: 25,
        category: "Food",
        description: "Lunch",
      };
      const mockResponse = { id: 3, ...newTransaction };
      vi.mocked(http.post).mockResolvedValueOnce(mockResponse);

      const result = await createTransaction(newTransaction);

      expect(http.post).toHaveBeenCalledWith("/transactions", newTransaction);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("updateTransaction", () => {
    it("calls http.put with id and updated data", async () => {
      const updatedData = {
        date: "2024-01-01",
        type: "expense" as const,
        amount: 30,
        category: "Food",
        description: "Updated lunch",
      };
      const mockResponse = { id: 1, ...updatedData };
      vi.mocked(http.put).mockResolvedValueOnce(mockResponse);

      const result = await updateTransaction(1, updatedData);

      expect(http.put).toHaveBeenCalledWith("/transactions/1", updatedData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("deleteTransaction", () => {
    it("calls http.delete with transaction id", async () => {
      vi.mocked(http.delete).mockResolvedValueOnce(undefined);

      await deleteTransaction(1);

      expect(http.delete).toHaveBeenCalledWith("/transactions/1");
    });
  });
});
