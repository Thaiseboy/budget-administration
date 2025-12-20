import { VscVscodeInsiders } from "react-icons/vsc";
import { HiOutlineCurrencyEuro } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

export default function AppHeader() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-slate-700 bg-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <div className="font-semibold text-white">
          <HiOutlineCurrencyEuro className="inline-block text-3xl text-amber-300 align-middle" />
          Get money Administration
        </div>

        <nav className="flex gap-6">
          <Link
            to="/dashboard"
            className={`text-sm transition-colors ${
              isActive("/dashboard")
                ? "text-emerald-400 font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`} >
            Dashboard
          </Link>

          <Link
            to="/transactions"
            className={`text-sm transition-colors ${
              isActive("/transactions")
                ? "text-emerald-400 font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`}>
            Transactions
          </Link>
        </nav>

        <div className="text-4xl text-red-600">
          <VscVscodeInsiders />
        </div>
      </div>
    </header>
  );
}
