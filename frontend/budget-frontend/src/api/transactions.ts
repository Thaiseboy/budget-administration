import type { Transaction } from "../types";
import { http } from "./http";

export function getTransactions(options?: { signal?: AbortSignal }) {
  return http.get<Transaction[]>('/transactions', options);
}

export function getTransaction(id: number) {
  return http.get<Transaction>(`/transactions/${id}`);
}

export function createTransaction(data: Omit<Transaction, 'id'>) {
  return http.post<Transaction>('/transactions', data);
}

export function deleteTransaction(id: number) {
  return http.delete<void>(`/transactions/${id}`);
}

export function updateTransaction(id: number, data: Omit<Transaction, "id">) {
  return http.put<Transaction>(`/transactions/${id}`, data);
}
