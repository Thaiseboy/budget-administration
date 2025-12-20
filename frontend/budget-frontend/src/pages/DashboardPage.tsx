import { useMemo, useState, useEffect } from "react";
import AppLayout from "../layouts/AppLayout";
import TransactionSummary from "../components/TransactionSummary";
import { useAppContext } from "../hooks/useAppContext";
import { Link } from "react-router-dom";
import IncomeExpenseChart from "../components/charts/IncomeExpenseChart";
import { buildMonthlyTotals, withCumulativeBalance } from "../utils/monthlyTotals";
import BalanceTrendChart from "../components/charts/BalanceTrendChart";
import { buildCategoryTotals } from "../utils/categoryTotals";
import CategoryBreakdownChart from "../components/charts/CategoryBreakdownChart";
import CategoryBudgetList from "../components/budgets/CategoryBudgetList";

function getYear(date: string) {
    return Number(date.slice(0, 4));
}

export default function DashboardPage() {
    const { items, budgetsByYear, loadBudgets, upsertBudgetInCache } = useAppContext();
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [categoryType, setCategoryType] = useState<"expense" | "income">("expense");

    useEffect(() => {
        loadBudgets(selectedYear);
    }, [selectedYear, loadBudgets]);

    const years = useMemo(() => {
        const set = new Set(items.map((t) => getYear(t.date)));
        const arr = Array.from(set).sort((a, b) => b - a);
        return arr.length > 0 ? arr : [currentYear];
    }, [items, currentYear]);

    const yearItems = useMemo(() => {
        return items.filter((t) => getYear(t.date) === selectedYear);
    }, [items, selectedYear]);

    const monthlyTotals = useMemo(() => {
        return buildMonthlyTotals(yearItems, selectedYear, "nl-NL");
    }, [yearItems, selectedYear]);

    const balanceTrendData = useMemo(() => {
        return withCumulativeBalance(monthlyTotals);
    }, [monthlyTotals]);

    const categoryData = useMemo(() => {
        return buildCategoryTotals(yearItems, categoryType);
    }, [yearItems, categoryType]);

    const hasYearData = yearItems.length > 0;

    const budgets = budgetsByYear[selectedYear] ?? [];

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

            {!hasYearData && (
                <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800 p-6">
                    <h2 className="text-base font-semibold text-white">
                        No data for {selectedYear}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Add a transaction or pick another year to see charts and category insights.
                    </p>
                </div>
            )}

            {hasYearData && (
                <>
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

                    <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800 p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-white">Category breakdown</h2>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCategoryType("expense")}
                                    className={`rounded-lg px-3 py-1 text-sm ${categoryType === "expense"
                                            ? "bg-red-500 text-white"
                                            : "bg-slate-700 text-slate-300"
                                        }`}
                                >
                                    Expense
                                </button>

                                <button
                                    onClick={() => setCategoryType("income")}
                                    className={`rounded-lg px-3 py-1 text-sm ${categoryType === "income"
                                            ? "bg-green-500 text-white"
                                            : "bg-slate-700 text-slate-300"
                                        }`}
                                >
                                    Income
                                </button>
                            </div>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                            {categoryType === "expense" ? "Expenses" : "Income"} per category in{" "}
                            {selectedYear}.
                        </p>

                        <div className="mt-4">
                            <CategoryBreakdownChart data={categoryData} />
                        </div>
                    </div>

                    <div className="mt-6">
                        <CategoryBudgetList
                            year={selectedYear}
                            yearItems={yearItems}
                            budgets={budgets}
                            onBudgetSaved={upsertBudgetInCache}
                        />
                    </div>
                </>
            )}
        </AppLayout>
    );
}