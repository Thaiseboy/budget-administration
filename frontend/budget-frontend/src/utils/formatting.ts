import type { User } from '@/api'

type Currency = 'EUR' | 'USD' | 'GBP' | 'THB'

const currencySymbols: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  THB: '฿',
}

const currencyLocales: Record<Currency, string> = {
  EUR: 'nl-NL',
  USD: 'en-US',
  GBP: 'en-GB',
  THB: 'th-TH',
}

/**
 * Format currency based on user preference
 */
export function formatCurrency(amount: number, user: User | null): string {
  const currency = user?.currency || 'EUR'
  const locale = currencyLocales[currency]

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(user: User | null): string {
  const currency = user?.currency || 'EUR'
  return currencySymbols[currency]
}

/**
 * Format date based on user preference
 */
export function formatDate(date: Date | string, user: User | null): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const format = user?.date_format || 'd-m-Y'

  const day = dateObj.getDate().toString().padStart(2, '0')
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const year = dateObj.getFullYear()

  switch (format) {
    case 'd-m-Y':
      return `${day}-${month}-${year}`
    case 'Y-m-d':
      return `${year}-${month}-${day}`
    case 'm/d/Y':
      return `${month}/${day}/${year}`
    default:
      return `${day}-${month}-${year}`
  }
}

/**
 * Format date for input fields (always YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const year = dateObj.getFullYear()
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const day = dateObj.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
