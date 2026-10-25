import { describe, expect, it } from 'vitest';
import {
  addTax,
  calculateSavings,
  eurilize,
  formatPrice,
  parsePrice,
  removeTax,
  roundMoney,
} from './money';

describe('eurilize', () => {
  it('should format a positive number to EUR currency', () => {
    expect(eurilize(1234.56)).toBe('1.234,56\u00a0€');
  });

  it('should format a string number to EUR currency', () => {
    expect(eurilize('789.10')).toBe('789,10\u00a0€');
  });

  it('should handle null input and return 0,00 €', () => {
    expect(eurilize(null)).toBe('0,00\u00a0€');
  });

  it('should handle an invalid string and return 0,00 €', () => {
    expect(eurilize('abc')).toBe('0,00\u00a0€');
  });

  it('should format zero correctly', () => {
    expect(eurilize(0)).toBe('0,00\u00a0€');
  });

  it('should use default value of 0 when no argument is provided', () => {
    expect(eurilize()).toBe('0,00\u00a0€');
  });

  it('should format a large number correctly', () => {
    expect(eurilize(1000000)).toBe('1.000.000,00\u00a0€');
  });
});

describe('calculateSavings', () => {
  it('returns 0 when the original price is 0', () => {
    expect(calculateSavings(0, 0)).toEqual({ amountSaved: 0, percentSaved: 0 });
  });

  it('returns 0 when the discounted price is not lower than the original', () => {
    expect(calculateSavings(100, 120)).toEqual({
      amountSaved: 0,
      percentSaved: 0,
    });
    expect(calculateSavings(100, 100)).toEqual({
      amountSaved: 0,
      percentSaved: 0,
    });
  });

  it('calculates the absolute and percentage savings', () => {
    expect(calculateSavings(200, 150)).toEqual({
      amountSaved: 50,
      percentSaved: 25.0,
    });
    expect(calculateSavings(99.99, 49.99)).toEqual({
      amountSaved: 50.0,
      percentSaved: parseFloat(((50 / 99.99) * 100).toFixed(2)),
    });
  });

  it('rounds the amount saved to cents', () => {
    expect(calculateSavings(19.99, 14.99).amountSaved).toBe(5);
    expect(calculateSavings(0.3, 0.1).amountSaved).toBe(0.2);
  });
});

describe('roundMoney', () => {
  it('rounds to cents by default', () => {
    expect(roundMoney(0.1 + 0.2)).toBe(0.3);
    expect(roundMoney(19.999)).toBe(20);
  });

  it('rounds halves up where plain toFixed rounds down', () => {
    expect(roundMoney(1.005)).toBe(1.01);
    expect((1.005).toFixed(2)).toBe('1.00');
  });

  it('rounds negative halves away from zero', () => {
    expect(roundMoney(-2.675)).toBe(-2.68);
  });

  it('keeps any number of decimals', () => {
    expect(roundMoney(1.23456, 3)).toBe(1.235);
    expect(roundMoney(1234.5, 0)).toBe(1235);
  });
});

describe('formatPrice', () => {
  it('formats in euros with the German locale by default', () => {
    expect(formatPrice(1234.5)).toBe('1.234,50 €');
  });

  it('formats any currency and locale', () => {
    expect(formatPrice(1234.5, { currency: 'USD', locale: 'en-US' })).toBe('$1,234.50');
    expect(formatPrice(1234.5, { currency: 'GBP', locale: 'en-GB' })).toBe('£1,234.50');
    expect(formatPrice(1000, { currency: 'JPY', locale: 'ja-JP' })).toBe('￥1,000');
  });

  it('formats invalid input as zero', () => {
    expect(formatPrice('abc', { currency: 'USD', locale: 'en-US' })).toBe('$0.00');
    expect(formatPrice(null)).toBe('0,00 €');
  });
});

describe('parsePrice', () => {
  it('reads European and US formats', () => {
    expect(parsePrice('1.234,56 €')).toBe(1234.56);
    expect(parsePrice('$1,234.56')).toBe(1234.56);
    expect(parsePrice('1 234,56 zł')).toBe(1234.56);
    expect(parsePrice('1.234.567,89')).toBe(1234567.89);
  });

  it('reads a single separator as decimals unless three digits follow', () => {
    expect(parsePrice('12,5')).toBe(12.5);
    expect(parsePrice('9.99')).toBe(9.99);
    expect(parsePrice('1.234')).toBe(1234);
    expect(parsePrice('1,234')).toBe(1234);
  });

  it('reads integers and negative amounts', () => {
    expect(parsePrice('EUR 42')).toBe(42);
    expect(parsePrice('-12,50 €')).toBe(-12.5);
  });

  it('returns null when there is no number', () => {
    expect(parsePrice('Free')).toBeNull();
    expect(parsePrice('')).toBeNull();
  });
});

describe('addTax', () => {
  it('adds the tax to a net price', () => {
    expect(addTax(100, 21)).toEqual({ net: 100, tax: 21, gross: 121 });
    expect(addTax(8.26, 21)).toEqual({ net: 8.26, tax: 1.73, gross: 9.99 });
  });

  it('supports a zero rate', () => {
    expect(addTax(50, 0)).toEqual({ net: 50, tax: 0, gross: 50 });
  });

  it('rejects negative or invalid rates', () => {
    expect(() => addTax(100, -5)).toThrow(RangeError);
    expect(() => addTax(100, NaN)).toThrow(RangeError);
  });
});

describe('removeTax', () => {
  it('splits a gross price into net and tax', () => {
    expect(removeTax(121, 21)).toEqual({ net: 100, tax: 21, gross: 121 });
    expect(removeTax(9.99, 21)).toEqual({ net: 8.26, tax: 1.73, gross: 9.99 });
  });

  it('always adds back up to the gross price', () => {
    for (const gross of [0.99, 4.95, 19.99, 99.95, 1234.57]) {
      for (const rate of [4, 10, 21]) {
        const { net, tax } = removeTax(gross, rate);
        expect(roundMoney(net + tax)).toBe(gross);
      }
    }
  });

  it('rejects negative rates', () => {
    expect(() => removeTax(100, -1)).toThrow(RangeError);
  });
});
