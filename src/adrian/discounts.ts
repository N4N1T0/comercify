import { SimpleDiscount } from './types';

/**
 * Applies a single discount to a subtotal.
 * When the discount does not apply (expired, subtotal below the minimum, or
 * no actual savings), the original subtotal is returned.
 *
 * @param subtotal - The total before the discount.
 * @param discount - The discount to apply.
 * @returns The total after the discount and how much was saved.
 *
 * @example
 * applyDiscount(100, { type: 'percentage', amount: 10 }) // { total: 90, savings: 10 }
 * applyDiscount(50, { type: 'fixed', amount: 5 }) // { total: 45, savings: 5 }
 */
export function applyDiscount(
  subtotal: number,
  discount: SimpleDiscount
): { total: number; savings: number } {
  const now = new Date();

  // expired discount
  if (discount.expiresAt && now > discount.expiresAt) {
    return { total: subtotal, savings: 0 };
  }

  // subtotal below the minimum
  if (discount.minSubtotal !== undefined && subtotal < discount.minSubtotal) {
    return { total: subtotal, savings: 0 };
  }

  let savings = 0;
  if (discount.type === 'percentage') {
    savings = parseFloat(((subtotal * discount.amount) / 100).toFixed(2));
  } else {
    savings = parseFloat(discount.amount.toFixed(2));
  }

  // a discount can never save more than the subtotal it applies to
  savings = Math.min(savings, subtotal);

  const total = Math.max(0, parseFloat((subtotal - savings).toFixed(2)));

  // no actual savings: leave the subtotal untouched
  if (savings <= 0) {
    return { total: subtotal, savings: 0 };
  }

  return { total, savings };
}
