import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { normalizeCategory } from "../../../utils/categories";
import type { TypeFilter } from "../types";

type FilterParams = {
  year: number;
  month: string;
  type: TypeFilter;
  category: string;
};

type UseTransactionFiltersArgs = {
  fallbackYear: number;
};

function parseYearParam(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseTypeParam(value: string | null): TypeFilter {
  const v = (value ?? "").toLowerCase();
  if (v === "income" || v === "expense") return v;
  return "all";
}

function parseMonthParam(value: string | null): string {
  const v = (value ?? "").trim().toLowerCase();
  if (!v || v === "all") return "all";
  const asNumber = Number(v);
  if (Number.isFinite(asNumber) && asNumber >= 1 && asNumber <= 12) {
    return String(asNumber).padStart(2, "0");
  }
  if (/^(0[1-9]|1[0-2])$/.test(v)) return v;
  return "all";
}

function parseCategoryParam(value: string | null): string {
  if (!value) return "all";
  if (value.trim().toLowerCase() === "all") return "all";
  return normalizeCategory(value);
}

function getFilterParams(params: URLSearchParams, fallbackYear: number): FilterParams {
  return {
    year: parseYearParam(params.get("year"), fallbackYear),
    month: parseMonthParam(params.get("month")),
    type: parseTypeParam(params.get("type")),
    category: parseCategoryParam(params.get("cat")),
  };
}

export function useTransactionFilters({ fallbackYear }: UseTransactionFiltersArgs) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsString = searchParams.toString();
  const initialFiltersRef = useRef<FilterParams | null>(null);
  const skipUrlSyncRef = useRef(false);
  const didMountRef = useRef(false);

  if (!initialFiltersRef.current) {
    initialFiltersRef.current = getFilterParams(searchParams, fallbackYear);
  }

  const [filters, setFilters] = useState<FilterParams>(initialFiltersRef.current);

  useEffect(() => {
    const nextFilters = getFilterParams(searchParams, fallbackYear);
    skipUrlSyncRef.current = true;
    setFilters(nextFilters);
  }, [searchParamsString, fallbackYear]);

  useEffect(() => {
    if (skipUrlSyncRef.current) {
      skipUrlSyncRef.current = false;
      didMountRef.current = true;
      return;
    }

    const nextParams = new URLSearchParams(searchParamsString);
    nextParams.set("year", String(filters.year));
    nextParams.set("month", filters.month);
    nextParams.set("type", filters.type);
    nextParams.set("cat", filters.category);

    const nextString = nextParams.toString();
    const currentString = searchParamsString;

    if (nextString !== currentString) {
      setSearchParams(nextParams, { replace: !didMountRef.current });
    }

    didMountRef.current = true;
  }, [filters, searchParamsString, setSearchParams]);

  return {
    selectedYear: filters.year,
    setSelectedYear: (year: number) =>
      setFilters((prev) => ({ ...prev, year })),
    typeFilter: filters.type,
    setTypeFilter: (type: TypeFilter) =>
      setFilters((prev) => ({ ...prev, type })),
    categoryFilter: filters.category,
    setCategoryFilter: (category: string) =>
      setFilters((prev) => ({ ...prev, category })),
    monthFilter: filters.month,
    setMonthFilter: (month: string) =>
      setFilters((prev) => ({ ...prev, month })),
    resetFilters: () =>
      setFilters((prev) => ({
        ...prev,
        type: "all",
        category: "all",
        month: "all",
      })),
  };
}
