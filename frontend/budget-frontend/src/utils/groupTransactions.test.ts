import { describe, expect, it } from "vitest";
import { monthKeyFromDate } from "./groupTransactions";

describe("monthKeyFromDate", () => {
  it("should return the correct month key", () => {
    const date = "2024-02-15";
    expect(monthKeyFromDate(date)).toBe("2024-02");
  });

  it("extracts month key from ISO format", () => {
    expect(monthKeyFromDate("2024-12-31T10:30:00")).toBe("2024-12");
  });
});
