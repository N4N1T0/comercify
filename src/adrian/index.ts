import { CalculateSavings, CartItem, SimpleDiscount } from './types';

/**
 * Formats a value as a Euro currency string using German locale.
 *
 * @param value - The value to format (number, string, or null).
 * @returns The formatted Euro currency string.
 *
 * @example
 * eurilize(1000) // "1.000,00 €"
 * eurilize("50.5") // "50,50 €"
 * eurilize(null) // "0,00 €"
 */
export function eurilize(value: number | string | null = 0): string {
  const number = Number(value);

  if (isNaN(number)) return '0,00 €';

  return number.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Convierte un texto a un slug SEO-friendly.
 * Normaliza acentos, pasa a minúsculas, reemplaza espacios por guiones,
 * elimina caracteres no alfanuméricos y colapsa guiones repetidos.
 *
 * @param text - El texto original.
 * @returns El slug resultante.
 *
 * @example
 * slugify("Camiseta de Pádel Premium!") // "camiseta-de-padel-premium"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFKD') // descompone acentos
    .replace(/[\u0300-\u036f]/g, '') // elimina marcas diacríticas
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // espacios -> guiones
    .replace(/[^\w-]+/g, '') // elimina caracteres no alfanuméricos excepto guion
    .replace(/--+/g, '-') // colapsa guiones dobles o más
    .replace(/^-+|-+$/g, ''); // quita guiones al inicio/final
}

/**
 * Calcula el ahorro absoluto y porcentual dado el precio original y el precio con descuento.
 *
 * @param originalPrice - Precio original (debe ser >= 0).
 * @param discountedPrice - Precio con descuento.
 * @returns El ahorro en cantidad y porcentaje.
 */
export function calculateSavings(
  originalPrice: number,
  discountedPrice: number
): CalculateSavings {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) {
    return { amountSaved: 0, percentSaved: 0 };
  }
  const amountSaved = originalPrice - discountedPrice;
  const percentSaved = parseFloat(
    ((amountSaved / originalPrice) * 100).toFixed(2)
  );
  return { amountSaved, percentSaved };
}

/**
 * Aplica un solo descuento sobre un subtotal.
 * Si no aplica (expirado, subtotal insuficiente o no ahorra), devuelve el subtotal original.
 *
 * @param subtotal - Total antes del descuento.
 * @param discount - Descuento a aplicar.
 * @returns El total después del descuento y cuánto se ahorró.
 *
 * @example
 * applyDiscount(100, { type: 'percentage', amount: 10 }) // { total: 90, savings: 10 }
 * applyDiscount(50, { type: 'fixed', amount: 5 }) // { total: 45, savings: 5 }
 */
export function applyDiscount(
  subtotal: number,
  discount: SimpleDiscount
): { total: number; savings: number } {
  const now = new Date();

  if (discount.expiresAt && now > discount.expiresAt) {
    return { total: subtotal, savings: 0 };
  }

  if (discount.minSubtotal !== undefined && subtotal < discount.minSubtotal) {
    return { total: subtotal, savings: 0 };
  }

  let savings = 0;
  if (discount.type === 'percentage') {
    savings = parseFloat(((subtotal * discount.amount) / 100).toFixed(2));
  } else {
    savings = parseFloat(discount.amount.toFixed(2));
  }

  const total = Math.max(0, parseFloat((subtotal - savings).toFixed(2)));

  // Si no hay ahorro efectivo, no lo aplicamos
  if (savings <= 0) {
    return { total: subtotal, savings: 0 };
  }

  return { total, savings };
}

/**
 * Combina dos carritos sumando cantidades de productos con el mismo productId.
 * Si hay conflicto en otros campos, se toma el valor del carrito "incoming".
 *
 * @param base - Carrito original (por ejemplo, anónimo).
 * @param incoming - Carrito nuevo (por ejemplo, sesión iniciada).
 * @returns Carrito combinado.
 */
export function mergeCarts(base: CartItem[], incoming: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();

  // Agrega los del base primero
  base.forEach((item) => {
    map.set(item.productId, { ...item });
  });

  // Combina con incoming
  incoming.forEach((item) => {
    const existing = map.get(item.productId);
    if (existing) {
      // Sumar cantidades y mezclar, tomando campos adicionales de incoming
      const merged: CartItem = {
        ...existing,
        ...item,
        quantity: existing.quantity + item.quantity,
      };
      map.set(item.productId, merged);
    } else {
      map.set(item.productId, { ...item });
    }
  });

  // Filtrar cantidades no positivas (opcional)
  return Array.from(map.values()).filter((i) => i.quantity > 0);
}
