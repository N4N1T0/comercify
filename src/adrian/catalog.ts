import { slugify } from './text';
import { SkuOptions, StockStatus, StockStatusOptions } from './types';

/** GTIN lengths: EAN-8, UPC-A (GTIN-12), EAN-13 and GTIN-14 */
const GTIN_LENGTHS = new Set([8, 12, 13, 14]);

/**
 * Checks a barcode number (EAN-8, UPC-A, EAN-13 or GTIN-14) against its
 * check digit, the way Google Merchant Center and marketplaces validate it.
 * Spaces and hyphens are ignored.
 *
 * @param code - The barcode number.
 * @returns Whether it has a valid length and check digit.
 *
 * @example
 * isValidGtin('4006381333931') // true (EAN-13)
 * isValidGtin('4006381333932') // false (wrong check digit)
 * isValidGtin('036000 291452') // true (UPC-A)
 */
export function isValidGtin(code: string | number): boolean {
  const digits = String(code).replace(/[\s-]/g, '');
  if (!/^\d+$/.test(digits) || !GTIN_LENGTHS.has(digits.length)) return false;

  // from the right, skipping the check digit, weights alternate 3, 1, 3, ...
  let sum = 0;
  for (let i = digits.length - 2, weight = 3; i >= 0; i--, weight = 4 - weight) {
    sum += Number(digits[i]) * weight;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === Number(digits[digits.length - 1]);
}

/**
 * Builds a readable SKU from product attributes such as name, color and
 * size. Each part loses its accents, spaces and symbols and is uppercased;
 * empty parts are skipped.
 *
 * @param parts - The attributes, in order.
 * @param options - `separator` (default '-') and `maxPartLength` to shorten each part.
 * @returns The SKU, or an empty string when no part has usable characters.
 *
 * @example
 * generateSku(['Camiseta Pádel', 'Azul', 'XL']) // "CAMISETAPADEL-AZUL-XL"
 * generateSku(['T-shirt', 'Blue', 'XL'], { maxPartLength: 3 }) // "TSH-BLU-XL"
 * generateSku(['Mug', 350, undefined, 'ml'], { separator: '_' }) // "MUG_350_ML"
 */
export function generateSku(
  parts: Array<string | number | null | undefined>,
  { separator = '-', maxPartLength }: SkuOptions = {}
): string {
  if (maxPartLength !== undefined && (!Number.isInteger(maxPartLength) || maxPartLength < 1)) {
    throw new RangeError(`maxPartLength must be a positive whole number, got ${maxPartLength}`);
  }

  return parts
    .filter((part): part is string | number => part !== null && part !== undefined)
    .map((part) => slugify(String(part)).replace(/-/g, '').toUpperCase())
    .map((part) => (maxPartLength ? part.slice(0, maxPartLength) : part))
    .filter(Boolean)
    .join(separator);
}

/**
 * Classifies the stock of a product for badges such as "Only 3 left" or
 * "Out of stock".
 *
 * @param quantity - Units available.
 * @param options - `lowStockThreshold`: units at or below which stock is low (default 5).
 * @returns 'in_stock', 'low_stock' or 'out_of_stock'.
 *
 * @example
 * getStockStatus(20) // "in_stock"
 * getStockStatus(3) // "low_stock"
 * getStockStatus(0) // "out_of_stock"
 */
export function getStockStatus(
  quantity: number,
  { lowStockThreshold = 5 }: StockStatusOptions = {}
): StockStatus {
  if (!(quantity > 0)) return 'out_of_stock';
  return quantity <= lowStockThreshold ? 'low_stock' : 'in_stock';
}
