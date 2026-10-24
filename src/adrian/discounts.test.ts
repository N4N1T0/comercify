import { describe, expect, it } from 'vitest';
import { applyDiscount } from './discounts';
import { SimpleDiscount } from './types';

describe('applyDiscount', () => {
  it('applies a percentage discount', () => {
    const discount: SimpleDiscount = { type: 'percentage', amount: 20 };
    const result = applyDiscount(100, discount);
    expect(result.total).toBe(80);
    expect(result.savings).toBe(20);
  });

  it('applies a fixed discount', () => {
    const discount: SimpleDiscount = { type: 'fixed', amount: 15 };
    const result = applyDiscount(100, discount);
    expect(result.total).toBe(85);
    expect(result.savings).toBe(15);
  });

  it('does not apply below the minimum subtotal', () => {
    const discount: SimpleDiscount = {
      type: 'fixed',
      amount: 10,
      minSubtotal: 200,
    };
    const result = applyDiscount(150, discount);
    expect(result.total).toBe(150);
    expect(result.savings).toBe(0);
  });

  it('does not apply when expired', () => {
    const past = new Date(2000, 0, 1);
    const discount: SimpleDiscount = {
      type: 'percentage',
      amount: 50,
      expiresAt: past,
    };
    const result = applyDiscount(100, discount);
    expect(result.total).toBe(100);
    expect(result.savings).toBe(0);
  });

  it('does not apply when it saves nothing', () => {
    const discount: SimpleDiscount = { type: 'fixed', amount: 0 };
    const result = applyDiscount(100, discount);
    expect(result.total).toBe(100);
    expect(result.savings).toBe(0);
  });

  it('never leaves a negative total', () => {
    const discount: SimpleDiscount = { type: 'fixed', amount: 500 };
    const result = applyDiscount(100, discount);
    expect(result.total).toBe(0);
    // the customer saves the 100 they would have paid, not the 500 of the coupon
    expect(result.savings).toBe(100);
  });

  it('caps a percentage discount above 100% at the subtotal', () => {
    const discount: SimpleDiscount = { type: 'percentage', amount: 150 };
    expect(applyDiscount(80, discount)).toEqual({ total: 0, savings: 80 });
  });
});
