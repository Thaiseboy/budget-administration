export type FixedMonthlyItem = {
  id?: number;
  description: string;
  category: string | null;
  amount: number;
  type: "income" | "expense";
};
