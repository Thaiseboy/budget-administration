type Currency = 'EUR' | 'THB' | 'USD' | 'GBP';

const currencyLocales: Record<Currency, string> = {
    // locale identifiers language code - land code BCP 47
    EUR: 'nl-NL',
    THB: 'th-TH',
    USD: 'en-US',
    GBP: 'en-GB',
};

export function formatCurrency(
    amount: number,
    currency: Currency = 'EUR'
) {
    const locale = currencyLocales[currency];
// Use JavaScript API for format
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount);
}