import type { Transaction } from "../types/transaction";

export type MonthlyTotal = {
  monthKey: string;   
  label: string;      
  income: number;
  expense: number;
  balance: number;
};

function monthKey(date: string) {
  return date.slice(0, 7); 
}

function monthLabel(monthKey: string, locale = "nl-NL") {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return new Intl.DateTimeFormat(locale, { month: "short" }).format(d);
}

export function buildMonthlyTotals(
  items: Transaction[],
  year: number,
  locale = "nl-NL"
): MonthlyTotal[] {

  const map = new Map<string, MonthlyTotal>();
  for (let m = 1; m <= 12; m++) {
    const mk = `${year}-${String(m).padStart(2, "0")}`;
    map.set(mk, {
      monthKey: mk,
      label: monthLabel(mk, locale),
      income: 0,
      expense: 0,
      balance: 0,
    });
  }

  for (const t of items) {
    if (Number(t.date.slice(0, 4)) !== year) continue;
    const mk = monthKey(t.date);
    const row = map.get(mk);
    if (!row) continue;

    if (t.type === "income") row.income += t.amount;
    else row.expense += t.amount;

    row.balance = row.income - row.expense;
  }

  return Array.from(map.values());
}