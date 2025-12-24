export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const MONTH_OPTIONS = MONTH_NAMES.map((label, index) => ({
  value: index + 1,
  label,
}));

export const MONTH_OPTIONS_PADDED = MONTH_NAMES.map((label, index) => ({
  value: String(index + 1).padStart(2, "0"),
  label,
}));

export function getMonthOptions(locale = "en-US") {
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(2020, index, 1);
    const label = new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
    return {
      value: index + 1,
      label,
    };
  });
}

export function getMonthOptionsPadded(locale = "en-US") {
  return getMonthOptions(locale).map(({ value, label }) => ({
    value: String(value).padStart(2, "0"),
    label,
  }));
}
