import { useMemo, useState } from "react";
import AppLayout from "../../../layouts/AppLayout";
import TransactionSummary from "../../../components/transactions/TransactionSummary";
import { useAppContext } from "../../../hooks/useAppContext";
import { Link } from "react-router-dom";
import IncomeExpenseChart from "../components/charts/IncomeExpenseChart";
import { buildMonthlyTotals, withCumulativeBalance } from "../../../utils/monthlyTotals";
import BalanceTrendChart from "../components/charts/BalanceTrendChart";
import { buildCategoryTotals } from "../../../utils/categoryTotals";
import CategoryBreakdownChart from "../components/charts/CategoryBreakdownChart";
import { normalizeCategory } from "../../../utils/categories";
import { formatCurrency } from "../../../utils/formatCurrency";
import PageHeader from "../../../components/ui/PageHeader";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

function getYear(date: string) {
    return Number(date.slice(0, 4));
}

export default function DashboardPage() {
    const { items } = useAppContext();
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [categoryType, setCategoryType] = useState<"expense" | "income">("expense");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


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

    const filteredTransactions = useMemo(() => {
        if (!selectedCategory) return [];
        return yearItems.filter((t) => {
            const matchesType = t.type === categoryType;
            const matchesCategory = normalizeCategory(t.category) === selectedCategory;
            return matchesType && matchesCategory;
        });
    }, [yearItems, selectedCategory, categoryType]);


    return (
        <AppLayout>
            <PageHeader
                title="Dashboard"
                actions={
                    <>
                        <Link
                            to="/transactions"
                            className="w-full rounded-lg border border-slate-600 px-4 py-2 text-center text-sm text-slate-300 hover:bg-slate-800 sm:w-auto"
                        >
                            View Transactions
                        </Link>

                        <Link
                            to="/transactions/new"
                            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-slate-800 sm:ml-4 sm:w-auto"
                        >
                            Add transaction
                        </Link>
                    </>
                }
            />

            <div className="mt-4">
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                    <span className="text-sm text-slate-300">Year:</span>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-slate-500 focus:outline-none sm:w-auto"
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-4">
                <TransactionSummary items={yearItems} />
            </div>

            {!hasYearData && (
                <Card className="mt-6 p-4 sm:p-6">
                    <h2 className="text-base font-semibold text-white">
                        No data for {selectedYear}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Add a transaction or pick another year to see charts and category insights.
                    </p>
                </Card>
            )}

            {hasYearData && (
                <>
                    <Card className="mt-6 p-4 sm:p-6">
                        <h2 className="text-base font-semibold text-white">Balance Trend</h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Cumulative balance over {selectedYear}.
                        </p>

                        <div className="mt-4">
                            <BalanceTrendChart data={balanceTrendData} />
                        </div>
                    </Card>

                    <Card className="mt-6 p-4 sm:p-6">
                        <h2 className="text-base font-semibold text-white">Income vs Expense</h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Overview per month for {selectedYear}.
                        </p>

                        <div className="mt-4">
                            <IncomeExpenseChart data={monthlyTotals} />
                        </div>
                    </Card>

                    <Card className="mt-6 p-4 sm:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-base font-semibold text-white">Category breakdown</h2>

                            <div className="flex w-full gap-2 sm:w-auto">
                                <Button
                                    type="button"
                                    variant={categoryType === "expense" ? "danger" : "secondary"}
                                    size="sm"
                                    onClick={() => {
                                        setCategoryType("expense");
                                        setSelectedCategory(null);
                                    }}
                                    className="flex-1 border-0 px-3 py-1 text-sm sm:flex-none"
                                >
                                    Expense
                                </Button>

                                <Button
                                    type="button"
                                    variant={categoryType === "income" ? "success" : "secondary"}
                                    size="sm"
                                    onClick={() => {
                                        setCategoryType("income");
                                        setSelectedCategory(null);
                                    }}
                                    className="flex-1 border-0 px-3 py-1 text-sm sm:flex-none"
                                >
                                    Income
                                </Button>
                            </div>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                            {categoryType === "expense" ? "Expenses" : "Income"} per category in{" "}
                            {selectedYear}.
                        </p>

                        <div className="mt-4">
                            <CategoryBreakdownChart
                                data={categoryData}
                                onCategoryClick={(category) => setSelectedCategory(category)}
                            />
                        </div>

                        {selectedCategory && filteredTransactions.length > 0 && (
                            <div className="mt-4 rounded-xl border border-slate-600 bg-slate-700 p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-white">
                                        {selectedCategory} - {categoryType === "expense" ? "Expenses" : "Income"}
                                    </h3>
                                    <Button
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        onClick={() => setSelectedCategory(null)}
                                        className="text-xs text-slate-400 hover:text-slate-300 underline"
                                    >
                                        Clear filter
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {filteredTransactions.map((t) => (
                                        <div
                                            key={t.id}
                                            className="flex flex-col gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div>
                                                <div className="break-words text-white">{t.description || "No description"}</div>
                                                <div className="text-xs text-slate-400">{t.date}</div>
                                            </div>
                                            <div className={`text-left font-semibold sm:text-right ${t.type === "expense" ? "text-red-400" : "text-green-400"}`}>
                                                {t.type === "expense" ? "-" : "+"}{formatCurrency(t.amount)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </>
            )}
        </AppLayout>
    );
}
