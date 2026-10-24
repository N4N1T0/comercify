import { describe, expect, it } from 'vitest';
import { slugify } from './text';

describe('slugify', () => {
  it('turns plain text into a slug', () => {
    expect(slugify('Producto Nuevo')).toBe('producto-nuevo');
  });

  it('strips accents and special characters', () => {
    expect(slugify('Camiseta de Pádel Premium!')).toBe('camiseta-de-padel-premium');
    expect(slugify('Árbol & Césped --- Verde')).toBe('arbol-cesped-verde');
  });

  it('collapses repeated spaces and hyphens', () => {
    expect(slugify('  Hola   Mundo -- prueba ')).toBe('hola-mundo-prueba');
  });

  it('trims hyphens at the start and the end', () => {
    expect(slugify('--Start and end--')).toBe('start-and-end');
  });

  it('returns an empty string when no valid characters are left', () => {
    expect(slugify('!!! ### ---')).toBe('');
  });

  it('keeps numbers', () => {
    expect(slugify('Oferta 2025!')).toBe('oferta-2025');
  });
});
