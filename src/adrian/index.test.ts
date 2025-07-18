import { describe, it, expect } from 'vitest';
import { eurilize } from './index';

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