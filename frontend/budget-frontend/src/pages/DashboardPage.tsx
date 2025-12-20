import { useMemo, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import TransactionSummary from "../components/TransactionSummary";
import { useAppContext } from "../hooks/useAppContext";
import { Link } from "react-router-dom";
import IncomeExpenseChart from "../components/charts/IncomeExpenseChart";
import { buildMonthlyTotals, withCumulativeBalance } from "../utils/monthlyTotals";
import BalanceTrendChart from "../components/charts/BalanceTrendChart";

function getYear(date: string) {
    return Number(date.slice(0, 4));
}

export default function DashboardPage() {
    const { items } = useAppContext();
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

    const years = useMemo(() => {
        const set = new Set(items.map((t) => getYear(t.date)));
        const arr = Array.from(set).sort((a, b) => b - a);
        return arr.length > 0 ? arr : [currentYear];
    }, [items, currentYear]);

    const yearItems = useMemo(() => {
        return items.filter((t) => getYear(t.date) === selectedYear);
    }, [items, selectedYear]);

    const monthlyTotals = useMemo(() => {
        return buildMonthlyTotals(items, selectedYear, "nl-NL");
    }, [items, selectedYear]);

    const balanceTrendData = useMemo(() => {
        return withCumulativeBalance(monthlyTotals);
    }, [monthlyTotals]);

    return (
        <AppLayout>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-white">Dashboard</h1>

                <Link
                    to="/transactions"
                    className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                >
                    View Transactions
                </Link>
            </div>

            <div className="mt-4 flex items-center gap-3">
                <span className="text-sm text-slate-300">Year:</span>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="rounded-lg border border-slate-600 bg-slate-700 text-white px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                >
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-4">
                <TransactionSummary items={yearItems} />
            </div>

            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800 p-6">
                <h2 className="text-base font-semibold text-white">Balance Trend</h2>
                <p className="mt-2 text-sm text-slate-400">
                    Cumulative balance over {selectedYear}.
                </p>

                <div className="mt-4">
                    <BalanceTrendChart data={balanceTrendData} />
                </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800 p-6">
                <h2 className="text-base font-semibold text-white">Income vs Expense</h2>
                <p className="mt-2 text-sm text-slate-400">
                    Overview per month for {selectedYear}.
                </p>

                <div className="mt-4">
                    <IncomeExpenseChart data={monthlyTotals} />
                </div>
            </div>
        </AppLayout>
    );
}
