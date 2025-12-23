import { http } from "./http";
import type { MonthPlan } from "../types";

export function getMonthPlan(year: number, month: number) {
  return http.get<MonthPlan>(`/month-plan?year=${year}&month=${month}`);
}

export function upsertMonthPlan(payload: MonthPlan) {
  return http.put<MonthPlan>(`/month-plan`, payload);
}
