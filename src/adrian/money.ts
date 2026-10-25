import { CalculateSavings, FormatPriceOptions, TaxBreakdown } from './types';

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

/**
 * Rounds an amount to a number of decimals without the usual floating point
 * surprises: 1.005 rounds to 1.01, not 1. Halves round away from zero.
 *
 * @param value - The amount to round.
 * @param decimals - How many decimals to keep (default 2, i.e. cents).
 * @returns The rounded amount.
 *
 * @example
 * roundMoney(1.005) // 1.01
 * roundMoney(0.1 + 0.2) // 0.3
 * roundMoney(-2.675) // -2.68
 */
export function roundMoney(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  // Number.EPSILON nudges values like 1.005, stored as 1.00499..., back up
  return (Math.sign(value) * Math.round((Math.abs(value) + Number.EPSILON) * factor)) / factor;
}

/**
 * Formats an amount as a price in any currency and locale.
 * The generic version of `eurilize`: invalid input formats as zero.
 *
 * @param value - The amount (number, numeric string or null).
 * @param options - `currency` (default 'EUR') and `locale` (default 'de-DE').
 * @returns The formatted price.
 *
 * @example
 * formatPrice(1234.5, { currency: 'USD', locale: 'en-US' }) // "$1,234.50"
 * formatPrice(1234.5, { currency: 'GBP', locale: 'en-GB' }) // "£1,234.50"
 * formatPrice('abc') // "0,00 €"
 */
export function formatPrice(
  value: number | string | null = 0,
  { currency = 'EUR', locale = 'de-DE' }: FormatPriceOptions = {}
): string {
  const parsed = Number(value);
  const number = isNaN(parsed) ? 0 : parsed;
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(number);
}

/**
 * Reads a price typed or scraped as text and returns it as a number.
 * Understands currency symbols, spaces and both decimal conventions:
 * "1.234,56 €", "$1,234.56", "1 234,56 zł" and "12,5" all parse.
 *
 * When only one kind of separator appears once and is followed by exactly
 * three digits ("1.234" or "1,234"), it is read as a thousands separator.
 *
 * @param input - The text to parse.
 * @returns The amount, or null when the text holds no number.
 *
 * @example
 * parsePrice('1.234,56 €') // 1234.56
 * parsePrice('$1,234.56') // 1234.56
 * parsePrice('Free') // null
 */
export function parsePrice(input: string): number | null {
  const cleaned = input.replace(/[^\d.,-]/g, '');
  if (!/\d/.test(cleaned)) return null;

  const negative = cleaned.trim().startsWith('-');
  const unsigned = cleaned.replace(/-/g, '');
  const lastDot = unsigned.lastIndexOf('.');
  const lastComma = unsigned.lastIndexOf(',');

  let decimalSeparator: '.' | ',' | null = null;
  if (lastDot !== -1 && lastComma !== -1) {
    // both kinds present: the last one is the decimal separator
    decimalSeparator = lastDot > lastComma ? '.' : ',';
  } else if (lastDot !== -1 || lastComma !== -1) {
    const separator = lastDot !== -1 ? '.' : ',';
    const occurrences = unsigned.split(separator).length - 1;
    const digitsAfter = unsigned.length - unsigned.lastIndexOf(separator) - 1;
    // "1.234.567" or "1,234" group thousands; "12,5" or "9.99" are decimals
    if (occurrences === 1 && digitsAfter !== 3) decimalSeparator = separator;
  }

  const normalized = decimalSeparator
    ? unsigned
        .split(decimalSeparator)
        .map((part, index, parts) =>
          index === parts.length - 1 ? part : part.replace(/[.,]/g, '')
        )
        .join('.')
    : unsigned.replace(/[.,]/g, '');

  const amount = Number(normalized);
  if (isNaN(amount)) return null;
  return negative ? -amount : amount;
}

function assertRate(ratePercent: number): void {
  if (!Number.isFinite(ratePercent) || ratePercent < 0) {
    throw new RangeError(`Tax rate must be a non-negative percentage, got ${ratePercent}`);
  }
}

/**
 * Adds tax (VAT, IVA, sales tax) to a net price.
 *
 * @param net - The price before tax.
 * @param ratePercent - The tax rate as a percentage, e.g. 21 for 21%.
 * @returns The net price, the tax and the gross price, rounded to cents.
 * @throws RangeError when the rate is negative or not a number.
 *
 * @example
 * addTax(100, 21) // { net: 100, tax: 21, gross: 121 }
 */
export function addTax(net: number, ratePercent: number): TaxBreakdown {
  assertRate(ratePercent);
  const tax = roundMoney((net * ratePercent) / 100);
  return { net: roundMoney(net), tax, gross: roundMoney(net + tax) };
}

/**
 * Splits a gross price (tax included) into its net price and tax.
 * Net and tax always add back up to the gross price, cent for cent.
 *
 * @param gross - The price with tax included.
 * @param ratePercent - The tax rate as a percentage, e.g. 21 for 21%.
 * @returns The net price, the tax and the gross price, rounded to cents.
 * @throws RangeError when the rate is negative or not a number.
 *
 * @example
 * removeTax(121, 21) // { net: 100, tax: 21, gross: 121 }
 * removeTax(9.99, 21) // { net: 8.26, tax: 1.73, gross: 9.99 }
 */
export function removeTax(gross: number, ratePercent: number): TaxBreakdown {
  assertRate(ratePercent);
  const net = roundMoney(gross / (1 + ratePercent / 100));
  // derive the tax from the rounded net so the parts add up exactly
  return { net, tax: roundMoney(gross - net), gross: roundMoney(gross) };
}
