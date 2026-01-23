import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatDateForInput,
  getCurrencySymbol,
} from "./formatting";
import type { User } from "@/api";

describe("formatDate", () => {
  it("formats with default d-m-Y when user is null", () => {
    expect(formatDate("2024-12-31", null)).toBe("31-12-2024");
  });

  it("formats using user date_format Y-m-d", () => {
    const user = { date_format: "Y-m-d" } as User;
    expect(formatDate("2024-01-05", user)).toBe("2024-01-05");
  });

  it("formats using user date_format m/d/Y", () => {
    const user = { date_format: "m/d/Y" } as User;
    expect(formatDate("2024-07-04", user)).toBe("07/04/2024");
  });

  it("accepts Date objects", () => {
    const date = new Date(2024, 0, 5);
    expect(formatDate(date, null)).toBe("05-01-2024");
  });

  it("returns original string for invalid input", () => {
    expect(formatDate("not-a-date", null)).toBe("not-a-date");
  });

  it("returns empty string for invalid Date object", () => {
    expect(formatDate(new Date("invalid"), null)).toBe("");
  });
});
