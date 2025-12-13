export type TransactionType = "income" | "expense"

export type Transaction = {
    id: string;
    type: TransactionType;
    amount: number;
    description?: string;
    date: string;
    category?: string;
}