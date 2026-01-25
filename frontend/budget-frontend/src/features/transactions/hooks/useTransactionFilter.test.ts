import { describe, it, expect } from "vitest";
import {
  parseYearParam,
  parseTypeParam,
  parseMonthParam,
  parseCategoryParam,
} from "./useTransactionFilters";

describe("parseYearParam", () => {
  it("returns fallback when value is null", () => {
    expect(parseYearParam(null, 2024)).toBe(2024);
  });

  it("returns fallback when value is empty string", () => {
    expect(parseYearParam("", 2024)).toBe(2024);
  });

  it("returns parsed number when value is valid", () => {
    expect(parseYearParam("2023", 2024)).toBe(2023);
  });

  it("returns fallback when value is not a valid number", () => {
    expect(parseYearParam("abc", 2024)).toBe(2024);
  });

  it("returns fallback for Infinity", () => {
    expect(parseYearParam("Infinity", 2024)).toBe(2024);
  });
});

describe("parseTypeParam", () => {
  it("returns 'all' when value is null", () => {
    expect(parseTypeParam(null)).toBe("all");
  });

  it("returns 'income' for income value", () => {
    expect(parseTypeParam("income")).toBe("income");
  });

  it("returns 'expense' for expense value", () => {
    expect(parseTypeParam("expense")).toBe("expense");
  });

  it("returns 'income' for uppercase INCOME", () => {
    expect(parseTypeParam("INCOME")).toBe("income");
  });

  it("returns 'all' for invalid value", () => {
    expect(parseTypeParam("invalid")).toBe("all");
  });
});

describe("parseMonthParam", () => {
  it("returns 'all' when value is null", () => {
    expect(parseMonthParam(null)).toBe("all");
  });

  it("returns 'all' when value is empty string", () => {
    expect(parseMonthParam("")).toBe("all");
  });

  it("returns 'all' when value is 'all'", () => {
    expect(parseMonthParam("all")).toBe("all");
  });

  it("returns padded month for single digit", () => {
    expect(parseMonthParam("1")).toBe("01");
    expect(parseMonthParam("9")).toBe("09");
  });

  it("returns month for double digit", () => {
    expect(parseMonthParam("12")).toBe("12");
  });

  it("returns 'all' for invalid month number", () => {
    expect(parseMonthParam("13")).toBe("all");
    expect(parseMonthParam("0")).toBe("all");
  });

  it("returns padded format for valid padded input", () => {
    expect(parseMonthParam("01")).toBe("01");
    expect(parseMonthParam("09")).toBe("09");
  });
});

describe("parseCategoryParam", () => {
  it("return 'all' when value is null", () => {
    expect(parseCategoryParam(null)).toBe("all");
  });

  it("returns 'all' when value is 'all'", () => {
    expect(parseCategoryParam("all")).toBe("all");
  });

  it("returns 'all' for 'ALL' (case insensitive)", () => {
    expect(parseCategoryParam("ALL")).toBe("all");
  });

  it("returns normalized category name", () => {
    expect(parseCategoryParam("food")).toBe("Food");
    expect(parseCategoryParam("GROCERIES")).toBe("Groceries");
  });
});
