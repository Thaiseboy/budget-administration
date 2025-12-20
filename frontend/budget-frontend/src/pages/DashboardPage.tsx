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
import type { CategoryBudget } from "../types/budget";
import { getBudgets } from "../api/budgets";
import { formatCurrency } from "../utils/formatCurrency";

function getYear(date: string) {
    return Number(date.slice(0, 4));
}

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function DashboardPage() {
    const { items } = useAppContext();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
    const [categoryType, setCategoryType] = useState<"expense" | "income">("expense");
    const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
    const [budgetsLoading, setBudgetsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


    const years = useMemo(() => {
        const set = new Set(items.map((t) => getYear(t.date)));
        const arr = Array.from(set).sort((a, b) => b - a);
        return arr.length > 0 ? arr : [currentYear];
    }, [items, currentYear]);

    const yearItems = useMemo(() => {
        return items.filter((t) => getYear(t.date) === selectedYear);
    }, [items, selectedYear]);

    const monthItems = useMemo(() => {
        const monthStr = String(selectedMonth).padStart(2, '0');
        const prefix = `${selectedYear}-${monthStr}`;
        return items.filter((t) => t.date.startsWith(prefix));
    }, [items, selectedYear, selectedMonth]);

    useEffect(() => {
        setBudgetsLoading(true);

        getBudgets(selectedYear, selectedMonth)
            .then((data) => setBudgets(data))
            .catch(() => setBudgets([]))
            .finally(() => setBudgetsLoading(false));
    }, [selectedYear, selectedMonth]);

    function handleBudgetSaved(saved: CategoryBudget) {
        setBudgets((prev) => {
            const idx = prev.findIndex((b) =>
                b.category === saved.category &&
                b.year === saved.year &&
                b.month === saved.month
            );
            if (idx === -1) return [...prev, saved];
            return prev.map((b) =>
                b.category === saved.category && b.year === saved.year && b.month === saved.month
                    ? saved
                    : b
            );
        });
    }

    const monthlyTotals = useMemo(() => {
        return buildMonthlyTotals(yearItems, selectedYear, "nl-NL");
    }, [yearItems, selectedYear]);

    const balanceTrendData = useMemo(() => {
        return withCumulativeBalance(monthlyTotals);
    }, [monthlyTotals]);

    const categoryData = useMemo(() => {
        return buildCategoryTotals(yearItems, categoryType);
    }, [yearItems, categoryType]);

    // Calculate over budget categories (month-based)
    const overBudgetCategories = useMemo(() => {
        const expensesByCategory = new Map<string, number>();

        for (const t of monthItems) {
            if (t.type !== "expense") continue;
            const cat = t.category || "Other";
            expensesByCategory.set(cat, (expensesByCategory.get(cat) ?? 0) + t.amount);
        }

        const overBudget: Array<{ category: string; spent: number; budget: number; over: number }> = [];

        for (const budget of budgets) {
            const spent = expensesByCategory.get(budget.category) ?? 0;
            if (budget.amount > 0 && spent > budget.amount) {
                overBudget.push({
                    category: budget.category,
                    spent,
                    budget: budget.amount,
                    over: spent - budget.amount,
                });
            }
        }

        return overBudget.sort((a, b) => b.over - a.over);
    }, [monthItems, budgets]);

    const hasYearData = yearItems.length > 0;

    // Filter transactions for drilldown
    const filteredTransactions = useMemo(() => {
        if (!selectedCategory) return [];
        return yearItems.filter((t) => {
            const matchesType = t.type === categoryType;
            const matchesCategory = (t.category || "Other") === selectedCategory;
            return matchesType && matchesCategory;
        });
    }, [yearItems, selectedCategory, categoryType]);


    return (
        <AppLayout>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-white">Dashboard</h1>

                <div>
                    <Link
                        to="/transactions"
                        className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                    >
                        View Transactions
                    </Link>

                    <Link
                        to="/transactions/new"
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 ml-4"
                    >
                        Add transaction
                    </Link>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-6">
                <div className="flex items-center gap-3">
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

                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-300">Month:</span>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="rounded-lg border border-slate-600 bg-slate-700 text-white px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                    >
                        <option value={1}>January</option>
                        <option value={2}>February</option>
                        <option value={3}>March</option>
                        <option value={4}>April</option>
                        <option value={5}>May</option>
                        <option value={6}>June</option>
                        <option value={7}>July</option>
                        <option value={8}>August</option>
                        <option value={9}>September</option>
                        <option value={10}>October</option>
                        <option value={11}>November</option>
                        <option value={12}>December</option>
                    </select>
                </div>
            </div>

            <div className="mt-4">
                <TransactionSummary items={yearItems} />
            </div>

            {overBudgetCategories.length > 0 && (
                <div className="mt-4 rounded-xl border border-red-600 bg-red-950/30 p-4">
                    <div className="flex items-start gap-3">
                        <div className="text-red-400 text-xl">⚠️</div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-red-400">
                                Over Budget Alert
                            </h3>
                            <p className="mt-1 text-xs text-red-300">
                                {overBudgetCategories.length} {overBudgetCategories.length === 1 ? "category is" : "categories are"} over budget for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                            </p>
                            <div className="mt-3 space-y-2">
                                {overBudgetCategories.map((item) => (
                                    <div
                                        key={item.category}
                                        className="flex items-center justify-between text-xs"
                                    >
                                        <span className="text-red-200">
                                            <strong>{item.category}</strong>
                                        </span>
                                        <span className="text-red-300">
                                            Over by {formatCurrency(item.over)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                    onClick={() => {
                                        setCategoryType("expense");
                                        setSelectedCategory(null);
                                    }}
                                    className={`rounded-lg px-3 py-1 text-sm ${categoryType === "expense"
                                        ? "bg-red-500 text-white"
                                        : "bg-slate-700 text-slate-300"
                                        }`}
                                >
                                    Expense
                                </button>

                                <button
                                    onClick={() => {
                                        setCategoryType("income");
                                        setSelectedCategory(null);
                                    }}
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
                            <CategoryBreakdownChart
                                data={categoryData}
                                onCategoryClick={(category) => setSelectedCategory(category)}
                            />
                        </div>

                        {selectedCategory && filteredTransactions.length > 0 && (
                            <div className="mt-4 rounded-xl border border-slate-600 bg-slate-700 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-white">
                                        {selectedCategory} - {categoryType === "expense" ? "Expenses" : "Income"}
                                    </h3>
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className="text-xs text-slate-400 hover:text-slate-300 underline"
                                    >
                                        Clear filter
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {filteredTransactions.map((t) => (
                                        <div
                                            key={t.id}
                                            className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2 text-sm"
                                        >
                                            <div>
                                                <div className="text-white">{t.description || "No description"}</div>
                                                <div className="text-xs text-slate-400">{t.date}</div>
                                            </div>
                                            <div className={`font-semibold ${t.type === "expense" ? "text-red-400" : "text-green-400"}`}>
                                                {t.type === "expense" ? "-" : "+"}{formatCurrency(t.amount)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>


                    <div className="mt-6">
                        {budgetsLoading ? (
                            <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 text-sm text-slate-400">
                                Loading budgets...
                            </div>
                        ) : (
                            <CategoryBudgetList
                                year={selectedYear}
                                month={selectedMonth}
                                monthItems={monthItems}
                                budgets={budgets}
                                onBudgetSaved={handleBudgetSaved}
                            />
                        )}
                    </div>
                </>
            )}
        </AppLayout>
    );
}