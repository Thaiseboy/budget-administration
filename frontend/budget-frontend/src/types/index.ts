// Transaction types
export type TransactionType = "income" | "expense"

export type Transaction = {
    id: number;
    type: TransactionType;
    amount: number;
    description?: string;
    date: string;
    category?: string;
}

export type CategoryBudget = {
  year: number;
  month: number;
  category: string;
  amount: number;
};

export type MonthPlan = {
  year: number;
  month: number;
  expected_income: number;
};

export type FixedMonthlyItem = {
  id?: number;
  description: string;
  category: string | null;
  amount: number;
  type: "income" | "expense";
};
