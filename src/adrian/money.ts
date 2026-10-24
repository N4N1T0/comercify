import { CalculateSavings } from './types';

/**
 * Formats a value as a Euro currency string using German locale.
 *
 * @param value - The value to format (number, string, or null).
 * @returns The formatted Euro currency string.
 *
 * @example
 * eurilize(1000) // "1.000,00 €"
 * eurilize("50.5") // "50,50 €"
 * eurilize(null) // "0,00 €"
 */
export function eurilize(value: number | string | null = 0): string {
  const parsed = Number(value);
  // NaN falls back to zero through the same formatter, so the output keeps
  // the locale's non-breaking space instead of a hardcoded regular one
  const number = isNaN(parsed) ? 0 : parsed;

  return number.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Calculates the absolute and percentage savings between an original price
 * and a discounted price.
 *
 * @param originalPrice - The original price (must be greater than 0).
 * @param discountedPrice - The price after the discount.
 * @returns The amount saved, rounded to cents, and the percentage saved.
 *
 * @example
 * calculateSavings(200, 150) // { amountSaved: 50, percentSaved: 25 }
 */
export function calculateSavings(originalPrice: number, discountedPrice: number): CalculateSavings {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) {
    return { amountSaved: 0, percentSaved: 0 };
  }
  // round to cents: 99.99 - 49.99 is 50.00000000000001 in floating point
  const amountSaved = parseFloat((originalPrice - discountedPrice).toFixed(2));
  const percentSaved = parseFloat(((amountSaved / originalPrice) * 100).toFixed(2));
  return { amountSaved, percentSaved };
}
