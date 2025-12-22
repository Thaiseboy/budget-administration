import { http } from "./http";
import type { FixedMonthlyItem } from "../types";

export function getFixedItems() {
  return http<FixedMonthlyItem[]>(`/fixed-items`);
}

export function createFixedItem(payload: Omit<FixedMonthlyItem, "id">) {
  return http<FixedMonthlyItem>(`/fixed-items`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateFixedItem(id: number, payload: Omit<FixedMonthlyItem, "id">) {
  return http<FixedMonthlyItem>(`/fixed-items/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteFixedItem(id: number) {
  return http<void>(`/fixed-items/${id}`, {
    method: "DELETE",
  });
}
