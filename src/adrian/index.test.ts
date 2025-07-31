import { describe, it, expect } from 'vitest';
import {
  applyDiscount,
  calculateSavings,
  eurilize,
  mergeCarts,
  slugify,
} from './index';
import { CartItem, SimpleDiscount } from './types';

// EURILIZE
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

// SLUGIFY
describe('slugify', () => {
  it('debería convertir texto simple en slug', () => {
    expect(slugify('Producto Nuevo')).toBe('producto-nuevo');
  });

  it('debería normalizar acentos y caracteres especiales', () => {
    expect(slugify('Camiseta de Pádel Premium!')).toBe(
      'camiseta-de-padel-premium'
    );
    expect(slugify('Árbol & Césped --- Verde')).toBe('arbol-cesped-verde');
  });

  it('debería colapsar múltiples espacios y guiones', () => {
    expect(slugify('  Hola   Mundo -- prueba ')).toBe('hola-mundo-prueba');
  });

  it('debería manejar textos con guiones al inicio o final', () => {
    expect(slugify('--Start and end--')).toBe('start-and-end');
  });

  it('debería devolver cadena vacía si el input no tiene caracteres válidos', () => {
    expect(slugify('!!! ### ---')).toBe('');
  });

  it('debería preservar números correctamente', () => {
    expect(slugify('Oferta 2025!')).toBe('oferta-2025');
  });
});

// CALCULATE SAVINGS
describe('calculateSavings', () => {
  it('debería devolver 0 si el precio original es 0', () => {
    expect(calculateSavings(0, 0)).toEqual({ amountSaved: 0, percentSaved: 0 });
  });

  it('debería devolver 0 si el precio con descuento es mayor o igual al original', () => {
    expect(calculateSavings(100, 120)).toEqual({
      amountSaved: 0,
      percentSaved: 0,
    });
    expect(calculateSavings(100, 100)).toEqual({
      amountSaved: 0,
      percentSaved: 0,
    });
  });

  it('debería calcular correctamente ahorro absoluto y porcentual', () => {
    expect(calculateSavings(200, 150)).toEqual({
      amountSaved: 50,
      percentSaved: 25.0,
    });
    expect(calculateSavings(99.99, 49.99)).toEqual({
      amountSaved: 50.0,
      percentSaved: parseFloat(((50 / 99.99) * 100).toFixed(2)),
    });
  });
});

// APPLY DISCOUNT
describe('applyDiscount (simple)', () => {
  it('aplica descuento porcentual correctamente', () => {
    const discount: SimpleDiscount = { type: 'percentage', amount: 20 };
    const result = applyDiscount(100, discount);
    expect(result.total).toBe(80);
    expect(result.savings).toBe(20);
  });

  it('aplica descuento fijo correctamente', () => {
    const discount: SimpleDiscount = { type: 'fixed', amount: 15 };
    const result = applyDiscount(100, discount);
    expect(result.total).toBe(85);
    expect(result.savings).toBe(15);
  });

  it('no aplica si el subtotal es menor que el mínimo', () => {
    const discount: SimpleDiscount = {
      type: 'fixed',
      amount: 10,
      minSubtotal: 200,
    };
    const result = applyDiscount(150, discount);
    expect(result.total).toBe(150);
    expect(result.savings).toBe(0);
  });

  it('no aplica si está expirado', () => {
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

  it('no aplica si no genera ahorro', () => {
    const discount: SimpleDiscount = { type: 'fixed', amount: 0 };
    const result = applyDiscount(100, discount);
    expect(result.total).toBe(100);
    expect(result.savings).toBe(0);
  });

  it('no deja total negativo', () => {
    const discount: SimpleDiscount = { type: 'fixed', amount: 500 };
    const result = applyDiscount(100, discount);
    expect(result.total).toBe(0);
    expect(result.savings).toBe(500);
  });
});

// MERGE CART
describe('mergeCarts', () => {
  it('combina carritos sin solapamientos', () => {
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

  it('suma cantidades cuando hay productos duplicados', () => {
    const base: CartItem[] = [{ productId: 'p1', quantity: 2 }];
    const incoming: CartItem[] = [{ productId: 'p1', quantity: 3 }];
    const result = mergeCarts(base, incoming);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(5);
  });

  it('preserva metadatos de incoming sobre base en conflicto', () => {
    const base: CartItem[] = [
      { productId: 'p1', quantity: 1, variant: 'rojo', price: 10 },
    ];
    const incoming: CartItem[] = [
      { productId: 'p1', quantity: 2, variant: 'azul' },
    ];
    const result = mergeCarts(base, incoming);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(3);
    expect(result[0].variant).toBe('azul');
    expect(result[0].price).toBe(10);
  });

  it('elimina items con cantidad resultante 0 o negativa', () => {
    const base: CartItem[] = [{ productId: 'p1', quantity: 1 }];
    const incoming: CartItem[] = [{ productId: 'p1', quantity: -1 }];
    const result = mergeCarts(base, incoming);
    expect(result).toHaveLength(0);
  });
});
