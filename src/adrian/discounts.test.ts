import { describe, expect, it } from 'vitest';
import { applyDiscount, generateInviteCode, isDiscountActive, pickBestDiscount } from './discounts';
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

describe('isDiscountActive', () => {
  const now = new Date(2026, 5, 15);

  it('is active without expiry or minimum', () => {
    expect(isDiscountActive({ type: 'fixed', amount: 5 })).toBe(true);
  });

  it('is inactive once expired', () => {
    const discount: SimpleDiscount = { type: 'fixed', amount: 5, expiresAt: new Date(2026, 5, 1) };
    expect(isDiscountActive(discount, undefined, now)).toBe(false);
    expect(isDiscountActive(discount, undefined, new Date(2026, 4, 1))).toBe(true);
  });

  it('checks the minimum only when a subtotal is given', () => {
    const discount: SimpleDiscount = { type: 'fixed', amount: 5, minSubtotal: 30 };
    expect(isDiscountActive(discount, 20)).toBe(false);
    expect(isDiscountActive(discount, 30)).toBe(true);
    expect(isDiscountActive(discount)).toBe(true);
  });
});

describe('pickBestDiscount', () => {
  const tenPercent: SimpleDiscount = { type: 'percentage', amount: 10 };
  const fifteenOff: SimpleDiscount = { type: 'fixed', amount: 15, minSubtotal: 50 };

  it('picks the discount that saves the most', () => {
    expect(pickBestDiscount(80, [tenPercent, fifteenOff])).toEqual({
      discount: fifteenOff,
      total: 65,
      savings: 15,
    });
    expect(pickBestDiscount(200, [tenPercent, fifteenOff]).discount).toBe(tenPercent);
  });

  it('skips discounts that do not apply', () => {
    expect(pickBestDiscount(40, [tenPercent, fifteenOff]).discount).toBe(tenPercent);
  });

  it('keeps the first one on a tie', () => {
    const tenOff: SimpleDiscount = { type: 'fixed', amount: 10 };
    expect(pickBestDiscount(100, [tenPercent, tenOff]).discount).toBe(tenPercent);
  });

  it('returns no discount when none applies', () => {
    expect(pickBestDiscount(40, [fifteenOff])).toEqual({ discount: null, total: 40, savings: 0 });
    expect(pickBestDiscount(40, [])).toEqual({ discount: null, total: 40, savings: 0 });
  });
});

describe('generateInviteCode', () => {
  it('generates 8 unambiguous characters by default', () => {
    const code = generateInviteCode();
    expect(code).toMatch(/^[A-HJKMNP-Z2-9]{8}$/);
  });

  it('honours length, prefix and alphabet', () => {
    expect(generateInviteCode({ length: 6, prefix: 'FRIEND-' })).toMatch(/^FRIEND-[A-Z2-9]{6}$/);
    expect(generateInviteCode({ length: 12, alphabet: 'ab' })).toMatch(/^[ab]{12}$/);
  });

  it('does not repeat itself', () => {
    const codes = new Set(Array.from({ length: 500 }, () => generateInviteCode()));
    expect(codes.size).toBe(500);
  });

  it('rejects invalid options', () => {
    expect(() => generateInviteCode({ length: 0 })).toThrow(RangeError);
    expect(() => generateInviteCode({ length: 2.5 })).toThrow(RangeError);
    expect(() => generateInviteCode({ alphabet: 'aaaa' })).toThrow(RangeError);
    const tooLong = Array.from({ length: 300 }, (_, i) => String.fromCodePoint(0x4e00 + i)).join(
      ''
    );
    expect(() => generateInviteCode({ alphabet: tooLong })).toThrow(RangeError);
  });
});
