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
