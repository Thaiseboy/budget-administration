import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "../../../../utils/formatCurrency";

type Props = {
  data: {
    label: string;
    cumulativeBalance: number;
  }[];
};

export default function BalanceTrendChart({ data }: Props) {
  return (
    <div className="h-64 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />

          <XAxis
            dataKey="label"
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickFormatter={(v) => formatCurrency(v)}
          />

          <Tooltip
            formatter={(v) => formatCurrency(Number(v))}
            labelFormatter={(label) => `Month: ${label}`}
          />

          <Line
            type="monotone"
            dataKey="cumulativeBalance"
            name="Balance"
            stroke="#60a5fa"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
