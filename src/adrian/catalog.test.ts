import { describe, expect, it } from 'vitest';
import { generateSku, getStockStatus, isValidGtin } from './catalog';

describe('isValidGtin', () => {
  it('accepts valid EAN-8, UPC-A, EAN-13 and GTIN-14 codes', () => {
    expect(isValidGtin('96385074')).toBe(true);
    expect(isValidGtin('036000291452')).toBe(true);
    expect(isValidGtin('4006381333931')).toBe(true);
    expect(isValidGtin('10012345678902')).toBe(true);
  });

  it('rejects a wrong check digit', () => {
    expect(isValidGtin('4006381333932')).toBe(false);
    expect(isValidGtin('036000291453')).toBe(false);
  });

  it('ignores spaces and hyphens, and accepts numbers', () => {
    expect(isValidGtin('036000 291452')).toBe(true);
    expect(isValidGtin('400-6381-33393-1')).toBe(true);
    expect(isValidGtin(4006381333931)).toBe(true);
  });

  it('rejects other lengths and non-digits', () => {
    expect(isValidGtin('12345')).toBe(false);
    expect(isValidGtin('40063813339A1')).toBe(false);
    expect(isValidGtin('')).toBe(false);
  });
});

describe('generateSku', () => {
  it('uppercases each part and strips accents, spaces and symbols', () => {
    expect(generateSku(['Camiseta Pádel', 'Azul', 'XL'])).toBe('CAMISETAPADEL-AZUL-XL');
  });

  it('shortens parts and uses a custom separator', () => {
    expect(generateSku(['T-shirt', 'Blue', 'XL'], { maxPartLength: 3 })).toBe('TSH-BLU-XL');
    expect(generateSku(['Mug', 350, undefined, 'ml'], { separator: '_' })).toBe('MUG_350_ML');
  });

  it('skips empty parts', () => {
    expect(generateSku(['Shoe', '', null, '!!!', '42'])).toBe('SHOE-42');
    expect(generateSku([])).toBe('');
  });

  it('rejects an invalid maxPartLength', () => {
    expect(() => generateSku(['a'], { maxPartLength: 0 })).toThrow(RangeError);
  });
});

describe('getStockStatus', () => {
  it('classifies stock with the default threshold of 5', () => {
    expect(getStockStatus(20)).toBe('in_stock');
    expect(getStockStatus(6)).toBe('in_stock');
    expect(getStockStatus(5)).toBe('low_stock');
    expect(getStockStatus(1)).toBe('low_stock');
    expect(getStockStatus(0)).toBe('out_of_stock');
  });

  it('honours a custom threshold', () => {
    expect(getStockStatus(8, { lowStockThreshold: 10 })).toBe('low_stock');
    expect(getStockStatus(3, { lowStockThreshold: 0 })).toBe('in_stock');
  });

  it('treats negative or invalid stock as out of stock', () => {
    expect(getStockStatus(-2)).toBe('out_of_stock');
    expect(getStockStatus(NaN)).toBe('out_of_stock');
  });
});
