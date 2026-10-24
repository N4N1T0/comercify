import { CartItem } from './types';

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
