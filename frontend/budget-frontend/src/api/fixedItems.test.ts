import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getFixedItems,
  createFixedItem,
  updateFixedItem,
  deleteFixedItem,
} from "./fixedItems";
import { http } from "./http";

vi.mock("./http");

describe("fixedItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getFixedItems", () => {
    it("calls http.get to fetch all fixed items", async () => {
      const mockItems = [
        {
          id: 1,
          description: "Rent",
          amount: 1000,
          type: "expense",
          category: "Housing",
        },
        {
          id: 2,
          description: "Salary",
          amount: 3000,
          type: "income",
          category: "Work",
        },
      ];
      vi.mocked(http.get).mockResolvedValueOnce(mockItems);

      const result = await getFixedItems();

      expect(http.get).toHaveBeenCalledWith("/fixed-items");
      expect(result).toEqual(mockItems);
    });
  });

  describe("createFixedItem", () => {
    it("calls http.post with fixed item data", async () => {
      const newItem = {
        description: "Internet",
        amount: 50,
        type: "expense",
        category: "Utilities",
      };
      const mockResponse = { id: 3, ...newItem };
      vi.mocked(http.post).mockResolvedValueOnce(mockResponse);

      const result = await createFixedItem(newItem);

      expect(http.post).toHaveBeenCalledWith("/fixed-items", newItem);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("updateFixedItem", () => {
    it("calls http.put with id and updated data", async () => {
      const updatedData = {
        description: "Rent Updated",
        amount: 1100,
        type: "expense",
        category: "Housing",
      };
      const mockResponse = { id: 1, ...updatedData };
      vi.mocked(http.put).mockResolvedValueOnce(mockResponse);

      const result = await updateFixedItem(1, updatedData);

      expect(http.put).toHaveBeenCalledWith("/fixed-items/1", updatedData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("deleteFixedItem", () => {
    it("calls http.delete with fixed item id", async () => {
      vi.mocked(http.delete).mockResolvedValueOnce(undefined);

      await deleteFixedItem(1);

      expect(http.delete).toHaveBeenCalledWith("/fixed-items/1");
    });
  });
});
