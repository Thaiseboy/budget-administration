import { http } from "./http";
import type { MonthPlan } from "../types";

export function getMonthPlan(year: number, month: number) {
  return http<MonthPlan>(`/month-plan?year=${year}&month=${month}`);
}

export function upsertMonthPlan(payload: MonthPlan) {
  return http<MonthPlan>(`/month-plan`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
