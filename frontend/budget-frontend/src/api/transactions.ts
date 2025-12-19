import type { Transaction } from "../types/transaction";
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

// Omit make new type on basic van Type with Omit<Type, Keys>, it remove properties. 
// Update new Transaction without new id, because it exist already.
export function updateTransaction(id: number, data: Omit<Transaction, "id">) {
  return http<Transaction>(`/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}