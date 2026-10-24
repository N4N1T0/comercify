import { describe, expect, it } from 'vitest';
import {
  calculateShipping,
  cartItemCount,
  cartSubtotal,
  freeShippingProgress,
  mergeCarts,
  updateCartItem,
} from './cart';
import { CartItem, PricedCartItem } from './types';

describe('mergeCarts', () => {
  it('merges carts without overlapping items', () => {
    const base: CartItem[] = [{ productId: 'p1', quantity: 1 }];
    const incoming: CartItem[] = [{ productId: 'p2', quantity: 2 }];
    const result = mergeCarts(base, incoming);
    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ productId: 'p1', quantity: 1 }),
        expect.objectContaining({ productId: 'p2', quantity: 2 }),
      ])
    );
  });

  it('adds up quantities of duplicated products', () => {
    const base: CartItem[] = [{ productId: 'p1', quantity: 2 }];
    const incoming: CartItem[] = [{ productId: 'p1', quantity: 3 }];
    const result = mergeCarts(base, incoming);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(5);
  });

  it('keeps the incoming metadata on conflict', () => {
    const base: CartItem[] = [{ productId: 'p1', quantity: 1, variant: 'red', price: 10 }];
    const incoming: CartItem[] = [{ productId: 'p1', quantity: 2, variant: 'blue' }];
    const result = mergeCarts(base, incoming);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(3);
    expect(result[0].variant).toBe('blue');
    expect(result[0].price).toBe(10);
  });

  it('drops items whose quantity ends at 0 or below', () => {
    const base: CartItem[] = [{ productId: 'p1', quantity: 1 }];
    const incoming: CartItem[] = [{ productId: 'p1', quantity: -1 }];
    const result = mergeCarts(base, incoming);
    expect(result).toHaveLength(0);
  });
});

describe('cartSubtotal', () => {
  it('adds up unit price times quantity, rounded to cents', () => {
    const cart: PricedCartItem[] = [
      { productId: 'p1', quantity: 3, price: 9.99 },
      { productId: 'p2', quantity: 1, price: 0.1 },
      { productId: 'p3', quantity: 2, price: 0.1 },
    ];
    expect(cartSubtotal(cart)).toBe(30.27);
  });

  it('returns 0 for an empty cart', () => {
    expect(cartSubtotal([])).toBe(0);
  });
});

describe('cartItemCount', () => {
  it('counts units, not lines', () => {
    expect(
      cartItemCount([
        { productId: 'p1', quantity: 2 },
        { productId: 'p2', quantity: 1 },
      ])
    ).toBe(3);
  });

  it('ignores lines with a quantity of 0 or below', () => {
    expect(
      cartItemCount([
        { productId: 'p1', quantity: 2 },
        { productId: 'p2', quantity: -4 },
      ])
    ).toBe(2);
  });
});

describe('updateCartItem', () => {
  const cart: PricedCartItem[] = [
    { productId: 'p1', quantity: 1, price: 10 },
    { productId: 'p2', quantity: 2, price: 5 },
  ];

  it('sets the quantity and keeps the other fields', () => {
    expect(updateCartItem(cart, 'p1', 4)[0]).toEqual({ productId: 'p1', quantity: 4, price: 10 });
  });

  it('removes the line when the quantity is 0 or below', () => {
    expect(updateCartItem(cart, 'p2', 0)).toEqual([cart[0]]);
    expect(updateCartItem(cart, 'p2', -1)).toEqual([cart[0]]);
  });

  it('does not mutate the original cart', () => {
    updateCartItem(cart, 'p1', 9);
    expect(cart[0].quantity).toBe(1);
  });

  it('leaves the cart as is for an unknown product', () => {
    expect(updateCartItem(cart, 'nope', 3)).toEqual(cart);
  });

  it('rejects fractional quantities', () => {
    expect(() => updateCartItem(cart, 'p1', 1.5)).toThrow(RangeError);
  });
});

describe('calculateShipping', () => {
  const rule = { flatRate: 4.95, freeThreshold: 50 };

  it('charges the flat rate below the threshold', () => {
    expect(calculateShipping(30, rule)).toBe(4.95);
  });

  it('is free from the threshold on', () => {
    expect(calculateShipping(50, rule)).toBe(0);
    expect(calculateShipping(80, rule)).toBe(0);
  });

  it('always charges the flat rate without a threshold', () => {
    expect(calculateShipping(1000, { flatRate: 3 })).toBe(3);
  });
});

describe('freeShippingProgress', () => {
  it('reports what is left to qualify', () => {
    expect(freeShippingProgress(37.5, 50)).toEqual({
      qualified: false,
      remaining: 12.5,
      percent: 75,
    });
  });

  it('qualifies at or above the threshold', () => {
    expect(freeShippingProgress(50, 50)).toEqual({ qualified: true, remaining: 0, percent: 100 });
  });

  it('treats an empty or negative subtotal as no progress', () => {
    expect(freeShippingProgress(-10, 50)).toEqual({ qualified: false, remaining: 50, percent: 0 });
  });
});
