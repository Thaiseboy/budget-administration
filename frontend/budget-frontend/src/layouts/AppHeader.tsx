import { VscVscodeInsiders } from "react-icons/vsc";
import { HiOutlineCurrencyEuro } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

export default function AppHeader() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-slate-700 bg-slate-800">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-4">
        <div className="flex items-center gap-2 font-semibold text-white">
          <HiOutlineCurrencyEuro className="text-2xl text-amber-300 sm:text-3xl" />
          <span className="text-base sm:text-lg">Get money Administration</span>
        </div>

        <nav className="flex w-full flex-wrap items-center gap-3 text-sm sm:w-auto sm:gap-6">
          <Link
            to="/dashboard"
            className={`rounded-md px-2 py-1 text-sm transition-colors sm:px-0 sm:py-0 ${
              isActive("/dashboard")
                ? "text-emerald-400 font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`} >
            Dashboard
          </Link>

          <Link
            to="/transactions"
            className={`rounded-md px-2 py-1 text-sm transition-colors sm:px-0 sm:py-0 ${
              isActive("/transactions")
                ? "text-emerald-400 font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`}>
            Transactions
          </Link>

          <Link
            to="/categories"
            className={`rounded-md px-2 py-1 text-sm transition-colors sm:px-0 sm:py-0 ${
              isActive("/categories")
                ? "text-emerald-400 font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Categories
          </Link>
        </nav>

        <div className="hidden text-4xl text-red-600 sm:block">
          <VscVscodeInsiders />
        </div>
      </div>
    </header>
  );
}
