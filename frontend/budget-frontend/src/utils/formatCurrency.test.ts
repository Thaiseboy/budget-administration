import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  // Test 1: Basis EUR formatting
  it('formatteert EUR bedragen correct', () => {
    // Arrange
    const amount = 1234.56;

    // Act
    const result = formatCurrency(amount, 'EUR');

    // Assert - Nederlands formaat gebruikt komma als decimaal
    expect(result).toContain('1.234,56');
    expect(result).toContain('€');
  });

  // Test 2: Default currency is EUR
  it('gebruikt EUR als default currency', () => {
    const result = formatCurrency(100);

    expect(result).toContain('€');
  });

  // Test 3: USD formatting
  it('formatteert USD bedragen correct', () => {
    const result = formatCurrency(1234.56, 'USD');

    // Amerikaans formaat gebruikt punt als decimaal
    expect(result).toContain('1,234.56');
    expect(result).toContain('$');
  });

  // Test 4: THB formatting
  it('formatteert THB bedragen correct', () => {
    const result = formatCurrency(1000, 'THB');

    // THB wordt weergegeven met het Baht symbool ฿
    expect(result).toContain('฿');
  });

  // Test 5: GBP formatting
  it('formatteert GBP bedragen correct', () => {
    const result = formatCurrency(99.99, 'GBP');

    expect(result).toContain('£');
  });

  // Test 6: Negatieve bedragen
  it('formatteert negatieve bedragen correct', () => {
    const result = formatCurrency(-50, 'EUR');

    expect(result).toContain('50');
    expect(result).toContain('€');
  });

  // Test 7: Nul bedrag
  it('formatteert nul correct', () => {
    const result = formatCurrency(0, 'EUR');

    expect(result).toContain('0');
    expect(result).toContain('€');
  });
});
