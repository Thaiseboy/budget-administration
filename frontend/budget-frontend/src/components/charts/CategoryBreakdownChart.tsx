import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import type { CategoryTotal } from "../../utils/categoryTotals";
import { formatCurrency } from "../../utils/formatCurrency";

type Props = {
  data: CategoryTotal[];
};

const COLORS = [
  "#60a5fa",
  "#34d399",
  "#f87171",
  "#fbbf24",
  "#a78bfa",
  "#fb7185",
  "#38bdf8",
  "#4ade80",
];

export default function CategoryBreakdownChart({ data }: Props) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(v) => formatCurrency(Number(v))}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}