import type { Transaction } from "../types";
import { http } from "./http";

export function getTransactions() {
  return http<Transaction[]>('/transactions');
}

export function getTransaction(id: number) {
  return http<Transaction>(`/transactions/${id}`);
}

export function createTransaction(data: Omit<Transaction, 'id'>) {
  return http<Transaction>('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function deleteTransaction(id: number) {
  return http<void>(`/transactions/${id}`, {
    method: "DELETE",
  });
}

export function updateTransaction(id: number, data: Omit<Transaction, "id">) {
  return http<Transaction>(`/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
