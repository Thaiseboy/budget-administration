export function formatCurrency(
    amount: number,
    currency: 'EUR' | 'USD' | 'GBP' | 'THB' = 'EUR',
    locale = 'nl-NL'
) {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}