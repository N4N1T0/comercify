import { BestDiscount, InviteCodeOptions, SimpleDiscount } from './types';

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
  // expired, or the subtotal is below the minimum
  if (!isDiscountActive(discount, subtotal)) {
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

/**
 * Tells whether a discount can be used right now: it has not expired and,
 * when a subtotal is given, the subtotal reaches its minimum.
 *
 * @param discount - The discount to check.
 * @param subtotal - The order subtotal, to check `minSubtotal` against.
 * @param now - The moment to check against (default: now).
 * @returns Whether the discount applies.
 *
 * @example
 * isDiscountActive({ type: 'fixed', amount: 5, minSubtotal: 30 }, 20) // false
 */
export function isDiscountActive(
  discount: SimpleDiscount,
  subtotal?: number,
  now: Date = new Date()
): boolean {
  if (discount.expiresAt && now > discount.expiresAt) return false;
  if (subtotal !== undefined && discount.minSubtotal !== undefined) {
    return subtotal >= discount.minSubtotal;
  }
  return true;
}

/**
 * Picks the discount that saves the most on a subtotal, for carts where a
 * customer has several coupons but only one can be used.
 * On a tie, the first one in the list wins.
 *
 * @param subtotal - The total before the discount.
 * @param discounts - The candidate discounts.
 * @returns The winning discount (or null), the total after it and the savings.
 *
 * @example
 * pickBestDiscount(80, [
 *   { type: 'percentage', amount: 10 },
 *   { type: 'fixed', amount: 15, minSubtotal: 50 },
 * ]) // { discount: { type: 'fixed', ... }, total: 65, savings: 15 }
 */
export function pickBestDiscount(subtotal: number, discounts: SimpleDiscount[]): BestDiscount {
  let best: BestDiscount = { discount: null, total: subtotal, savings: 0 };

  for (const discount of discounts) {
    const result = applyDiscount(subtotal, discount);
    if (result.savings > best.savings) best = { discount, ...result };
  }

  return best;
}

/** Uppercase letters and digits without the ones people misread: 0/O, 1/I/L */
const UNAMBIGUOUS_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/**
 * Generates a random invite, referral or coupon code that is easy to read
 * aloud and type: no 0/O or 1/I/L by default.
 * Uses the Web Crypto API, so codes are not guessable from Math.random.
 *
 * @param options - `length` (default 8), `prefix`, and the `alphabet` to use.
 * @returns The code.
 * @throws RangeError when the length is not a positive whole number or the
 * alphabet does not have between 2 and 256 different characters.
 *
 * @example
 * generateInviteCode() // "K7MQ2XRT"
 * generateInviteCode({ prefix: 'FRIEND-', length: 6 }) // "FRIEND-H4W9PC"
 */
export function generateInviteCode({
  length = 8,
  prefix = '',
  alphabet = UNAMBIGUOUS_ALPHABET,
}: InviteCodeOptions = {}): string {
  if (!Number.isInteger(length) || length < 1) {
    throw new RangeError(`Length must be a positive whole number, got ${length}`);
  }
  const characters = Array.from(new Set(alphabet));
  // one random byte picks one character, so 256 is the most it can address
  if (characters.length < 2 || characters.length > 256) {
    throw new RangeError('The alphabet needs between 2 and 256 different characters');
  }

  // rejection sampling: drop the bytes that would make some characters likelier
  const limit = 256 - (256 % characters.length);
  let code = '';
  while (code.length < length) {
    const bytes = globalThis.crypto.getRandomValues(new Uint8Array(length * 2));
    for (const byte of bytes) {
      if (byte < limit && code.length < length) code += characters[byte % characters.length];
    }
  }
  return prefix + code;
}
