import { describe, expect, it } from 'vitest';
import { mergeCarts } from './cart';
import { CartItem } from './types';

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
