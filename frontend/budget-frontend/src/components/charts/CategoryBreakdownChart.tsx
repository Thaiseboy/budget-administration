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
  onCategoryClick?: (category: string) => void;
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

export default function CategoryBreakdownChart({ data, onCategoryClick }: Props) {
  return (
    <div className="h-64 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
            onClick={(entry) => {
              if (onCategoryClick && entry?.category) {
                onCategoryClick(entry.category);
              }
            }}
            style={{ cursor: onCategoryClick ? "pointer" : "default" }}
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
