import type { Transaction } from "../types/transaction";
import { http } from "./http";

export function getTransactions() {
  return http<Transaction[]>('/transactions');
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