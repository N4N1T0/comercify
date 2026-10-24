import { describe, expect, it } from 'vitest';
import { calculateSavings, eurilize } from './money';

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
