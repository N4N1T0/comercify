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
  const number = Number(value);

  if (isNaN(number)) return '0,00 €';

  return number.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
