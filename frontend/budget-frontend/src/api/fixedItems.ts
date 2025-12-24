import { http } from "./http";
import type { FixedMonthlyItem } from "../types";

export function getFixedItems() {
  return http.get<FixedMonthlyItem[]>(`/fixed-items`);
}

export function createFixedItem(payload: Omit<FixedMonthlyItem, "id">) {
  return http.post<FixedMonthlyItem>(`/fixed-items`, payload);
}

export function updateFixedItem(id: number, payload: Omit<FixedMonthlyItem, "id">) {
  return http.put<FixedMonthlyItem>(`/fixed-items/${id}`, payload);
}

export function deleteFixedItem(id: number) {
  return http.delete<void>(`/fixed-items/${id}`);
}
