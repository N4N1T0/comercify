import { roundMoney } from './money';
import { CartItem, FreeShippingProgress, PricedCartItem, ShippingRule } from './types';

/**
 * Merges two carts, adding up the quantities of items with the same productId.
 * When other fields conflict, the value from the "incoming" cart wins.
 *
 * @param base - The original cart (for example, the anonymous one).
 * @param incoming - The new cart (for example, after signing in).
 * @returns The merged cart, without items whose quantity ends at 0 or below.
 *
 * @example
 * mergeCarts([{ productId: 'p1', quantity: 2 }], [{ productId: 'p1', quantity: 3 }])
 * // [{ productId: 'p1', quantity: 5 }]
 */
export function mergeCarts(base: CartItem[], incoming: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();

  // base items first
  base.forEach((item) => {
    map.set(item.productId, { ...item });
  });

  // then merge the incoming ones
  incoming.forEach((item) => {
    const existing = map.get(item.productId);
    if (existing) {
      // add up the quantities and take the other fields from incoming
      const merged: CartItem = {
        ...existing,
        ...item,
        quantity: existing.quantity + item.quantity,
      };
      map.set(item.productId, merged);
    } else {
      map.set(item.productId, { ...item });
    }
  });

  // drop items whose quantity is no longer positive
  return Array.from(map.values()).filter((i) => i.quantity > 0);
}

/**
 * Adds up the price of every line in a cart (unit price times quantity).
 *
 * @param items - Cart lines with a unit `price` and a `quantity`.
 * @returns The subtotal, rounded to cents.
 *
 * @example
 * cartSubtotal([{ productId: 'p1', quantity: 3, price: 9.99 }]) // 29.97
 */
export function cartSubtotal(items: PricedCartItem[]): number {
  return roundMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
}

/**
 * Counts the units in a cart, the number shown on a cart badge.
 * Lines with a quantity of 0 or below do not count.
 *
 * @param items - The cart lines.
 * @returns The total number of units.
 *
 * @example
 * cartItemCount([{ productId: 'p1', quantity: 2 }, { productId: 'p2', quantity: 1 }]) // 3
 */
export function cartItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + Math.max(0, item.quantity), 0);
}

/**
 * Sets the quantity of one product in a cart without mutating it.
 * A quantity of 0 or below removes the line. A product that is not in the
 * cart is left out: adding a line needs its price and metadata.
 *
 * @param items - The cart lines.
 * @param productId - The product to update.
 * @param quantity - The new quantity, a whole number.
 * @returns A new cart.
 * @throws RangeError when the quantity is not a whole number.
 *
 * @example
 * updateCartItem([{ productId: 'p1', quantity: 1 }], 'p1', 4) // [{ productId: 'p1', quantity: 4 }]
 * updateCartItem([{ productId: 'p1', quantity: 1 }], 'p1', 0) // []
 */
export function updateCartItem<T extends CartItem>(
  items: T[],
  productId: string,
  quantity: number
): T[] {
  if (!Number.isInteger(quantity)) {
    throw new RangeError(`Quantity must be a whole number, got ${quantity}`);
  }
  if (quantity <= 0) return items.filter((item) => item.productId !== productId);
  return items.map((item) => (item.productId === productId ? { ...item, quantity } : item));
}

/**
 * Works out the shipping cost of an order with a flat rate and an optional
 * free shipping threshold.
 *
 * @param subtotal - The order subtotal.
 * @param rule - `flatRate`, and `freeThreshold` from which shipping is free.
 * @returns The shipping cost.
 *
 * @example
 * calculateShipping(30, { flatRate: 4.95, freeThreshold: 50 }) // 4.95
 * calculateShipping(60, { flatRate: 4.95, freeThreshold: 50 }) // 0
 */
export function calculateShipping(subtotal: number, rule: ShippingRule): number {
  if (rule.freeThreshold !== undefined && subtotal >= rule.freeThreshold) return 0;
  return roundMoney(rule.flatRate);
}

/**
 * Tells how far an order is from free shipping, for messages such as
 * "Add 12,50 EUR more for free shipping" and their progress bars.
 *
 * @param subtotal - The order subtotal.
 * @param freeThreshold - The subtotal from which shipping is free.
 * @returns Whether it qualifies, the amount remaining and the progress percentage.
 *
 * @example
 * freeShippingProgress(37.5, 50) // { qualified: false, remaining: 12.5, percent: 75 }
 */
export function freeShippingProgress(
  subtotal: number,
  freeThreshold: number
): FreeShippingProgress {
  if (freeThreshold <= 0 || subtotal >= freeThreshold) {
    return { qualified: true, remaining: 0, percent: 100 };
  }
  const covered = Math.max(0, subtotal);
  return {
    qualified: false,
    remaining: roundMoney(freeThreshold - covered),
    percent: roundMoney((covered / freeThreshold) * 100),
  };
}
