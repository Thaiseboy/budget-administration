import type { RefObject } from "react";
import Button from "../../../components/ui/Button";
import { MONTH_OPTIONS_PADDED } from "../../../utils/months";
import { GoSync } from "react-icons/go";
import type { TypeFilter } from "../types";

type Props = {
  typeFilter: TypeFilter;
  onTypeChange: (value: TypeFilter) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  monthFilter: string;
  onMonthChange: (value: string) => void;
  onExportCsv: () => void;
  onImportFile: (file: File) => void;
  isImporting: boolean;
  onResetFilters: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
};

export default function TransactionFiltersBar({
  typeFilter,
  onTypeChange,
  categoryFilter,
  onCategoryChange,
  categories,
  monthFilter,
  onMonthChange,
  onExportCsv,
  onImportFile,
  isImporting,
  onResetFilters,
  fileInputRef,
}: Props) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex w-full rounded-lg border border-slate-600 bg-slate-800 p-1 sm:w-auto">
        {(["all", "income", "expense"] as const).map((v) => (
          <Button
            key={v}
            type="button"
            variant="ghost"
            size="md"
            active={typeFilter === v}
            activeClassName="bg-slate-700 !text-yellow-300 hover:bg-slate-700"
            onClick={() => onTypeChange(v)}
            className="flex-1 rounded-md border border-transparent bg-transparent text-slate-300 hover:border-transparent hover:bg-slate-700/40 hover:text-white sm:flex-none"
          >
            {v === "all" ? "All" : v === "income" ? "Income" : "Expense"}
          </Button>
        ))}
      </div>

      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-slate-500 focus:outline-none sm:w-auto"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c === "all" ? "All categories" : c}
          </option>
        ))}
      </select>

      <select
        value={monthFilter}
        onChange={(e) => onMonthChange(e.target.value)}
        className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-slate-500 focus:outline-none sm:w-auto"
      >
        <option value="all">All months</option>
        {MONTH_OPTIONS_PADDED.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <Button
        type="button"
        variant="secondary"
        size="md"
        fullWidth
        onClick={onExportCsv}
        className="border-0 px-3 text-white sm:w-auto"
      >
        Export CSV
      </Button>

      <Button
        type="button"
        variant="secondary"
        size="md"
        fullWidth
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
        className="border-0 px-3 text-white sm:w-auto"
      >
        {isImporting ? "Importing..." : "Import CSV"}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onImportFile(file);
          }
          e.currentTarget.value = "";
        }}
      />

      <Button
        type="button"
        variant="danger"
        size="md"
        fullWidth
        onClick={onResetFilters}
        className="flex items-center justify-center border-0 bg-red-800 px-3 text-xl text-slate-300 hover:bg-red-700 hover:text-white sm:w-auto"
      >
        <GoSync />
      </Button>
    </div>
  );
}
