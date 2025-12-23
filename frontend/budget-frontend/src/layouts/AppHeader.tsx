import { VscVscodeInsiders } from "react-icons/vsc";
import { HiOutlineCurrencyEuro } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, useToast } from "@/contexts";
import { useTranslation } from "@/i18n";
import { useState } from "react";

export default function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const toast = useToast();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  async function handleLogout() {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  }

  return (
    <header className="border-b border-slate-700 bg-slate-800">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-4">
        <div className="flex items-center gap-2 font-semibold text-slate-100">
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
            {t('dashboard')}
          </Link>

          <Link
            to="/transactions"
            className={`rounded-md px-2 py-1 text-sm transition-colors sm:px-0 sm:py-0 ${
              isActive("/transactions")
                ? "text-emerald-400 font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`}>
            {t('transactions')}
          </Link>

          <Link
            to="/categories"
            className={`rounded-md px-2 py-1 text-sm transition-colors sm:px-0 sm:py-0 ${
              isActive("/categories")
                ? "text-emerald-400 font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t('categories')}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-xs font-medium text-slate-200">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline">{user?.name}</span>
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="dropdown-menu absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-slate-700 py-1 shadow-2xl ring-1 ring-slate-900/10">
                  <div className="border-b border-slate-700 px-4 py-2">
                    <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="dropdown-menu-item block w-full px-4 py-2 text-left text-sm transition-colors"
                  >
                    {t('settings')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-menu-item w-full px-4 py-2 text-left text-sm transition-colors"
                  >
                    {t('logout')}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="hidden text-4xl text-red-600 sm:block">
            <VscVscodeInsiders />
          </div>
        </div>
      </div>
    </header>
  );
}
