import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMonthPlan, upsertMonthPlan } from "./monthPlan";
import { http } from "./http";
import type { MonthPlan } from "@/types";

vi.mock("./http");

describe("monthPlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getMonthPlan", () => {
    it("calls http.get with year and month query params", async () => {
      const mockPlan: MonthPlan = {
        year: 2024,
        month: 1,
        expected_income: 5000,
      };
      vi.mocked(http.get).mockResolvedValueOnce(mockPlan);

      const result = await getMonthPlan(2024, 1);

      expect(http.get).toHaveBeenCalledWith("/month-plan?year=2024&month=1");
      expect(result).toEqual(mockPlan);
    });

    it("handles different year and month values", async () => {
      const mockPlan: MonthPlan = {
        year: 2023,
        month: 12,
        expected_income: 4500,
      };
      vi.mocked(http.get).mockResolvedValueOnce(mockPlan);

      await getMonthPlan(2023, 12);

      expect(http.get).toHaveBeenCalledWith("/month-plan?year=2023&month=12");
    });
  });

  describe("upsertMonthPlan", () => {
    it("calls http.put with month plan payload", async () => {
      const planPayload: MonthPlan = {
        year: 2024,
        month: 1,
        expected_income: 5500,
      };
      vi.mocked(http.put).mockResolvedValueOnce(planPayload);

      const result = await upsertMonthPlan(planPayload);

      expect(http.put).toHaveBeenCalledWith("/month-plan", planPayload);
      expect(result).toEqual(planPayload);
    });

    it("updates existing month plan", async () => {
      const updatedPlan: MonthPlan = {
        year: 2024,
        month: 2,
        expected_income: 6000,
      };
      vi.mocked(http.put).mockResolvedValueOnce(updatedPlan);

      const result = await upsertMonthPlan(updatedPlan);

      expect(result.expected_income).toBe(6000);
    });
  });
});
