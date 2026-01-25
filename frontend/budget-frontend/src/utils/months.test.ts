import { describe, it, expect } from "vitest";
import {
  MONTH_NAMES,
  MONTH_OPTIONS,
  MONTH_OPTIONS_PADDED,
  getMonthOptions,
  getMonthOptionsPadded,
} from "./months";

describe("MONTH_NAMES", () => {
  it("contains 12 months", () => {
    expect(MONTH_NAMES).toHaveLength(12);
  });

  it("start with January", () => {
    expect(MONTH_NAMES[0]).toBe("January");
  });

  it("ends with December", () => {
    expect(MONTH_NAMES[11]).toBe("December");
  });
});

describe("MONTH_OPTIONS", () => {
  it("contains 12 months", () => {
    expect(MONTH_OPTIONS).toHaveLength(12);
  });

  it("has value 1 for January", () => {
    expect(MONTH_OPTIONS[0]).toEqual({ value: 1, label: "January" });
  });

  it("has value 12 for December", () => {
    expect(MONTH_OPTIONS[11]).toEqual({ value: 12, label: "December" });
  });
});

describe("MONTH_OPTIONS_PADDED", () => {
  it("has padded value '01' for January", () => {
    expect(MONTH_OPTIONS_PADDED[0]).toEqual({ value: "01", label: "January" });
  });

  it("has padded value '09' for September", () => {
    expect(MONTH_OPTIONS_PADDED[8]).toEqual({
      value: "09",
      label: "September",
    });
  });
});

describe("getMonthOptions", () => {
  it("returns 12 options with numeric values", () => {
    const options = getMonthOptions();
    expect(options).toHaveLength(12);
    expect(options[0].value).toBe(1);
    expect(options[11].value).toBe(12);
  });

  it("uses en-US locale by default", () => {
    const options = getMonthOptions();
    expect(options[0].label).toBe("January");
  });

  it("formats months in Dutch locale", () => {
    const options = getMonthOptions("nl-NL");
    expect(options[0].label.toLowerCase()).toBe("januari");
  });
});

describe("getMonthOptionsPadded", () => {
  it("returns padded string values", () => {
    const options = getMonthOptionsPadded();
    expect(options[0].value).toBe("01");
    expect(options[8].value).toBe("09");
    expect(options[11].value).toBe("12");
  });

  it("respects locale parameter", () => {
    const options = getMonthOptionsPadded("nl-NL");
    expect(options[0].label.toLowerCase()).toBe("januari");
  });
});
