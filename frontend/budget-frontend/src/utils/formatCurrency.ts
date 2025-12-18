export function formatCurrency(amount: number, currency: 'EUR' | 'USD' | 'GBP' | 'BATH' = 'EUR') {
    return new Intl.NumberFormat('nl-NL', {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}