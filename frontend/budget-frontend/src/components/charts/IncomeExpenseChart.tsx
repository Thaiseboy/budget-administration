import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import type { MonthlyTotal } from "../../utils/monthlyTotals";
import { formatCurrency } from "../../utils/formatCurrency";

type Props = {
  data: MonthlyTotal[];
};

export default function IncomeExpenseChart({ data }: Props) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Legend />
          <Bar dataKey="income" name="Income" />
          <Bar dataKey="expense" name="Expense" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}