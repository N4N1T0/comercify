# Funciones adrian

Este paquete ofrece una colección de funciones utilitarias para e-commerce, diseñadas para simplificar tareas comunes en el desarrollo de tiendas online.

---

## Funciones

### `eurilize(value: number | string | null = 0): string`

Formatea un valor numérico o texto como una cadena de moneda en euros con formato alemán (puntos para miles, comas para decimales).

- **Parámetro:**
  `value` - número, cadena o `null` que representa el valor a formatear.
- **Retorna:**
  Cadena formateada con símbolo y formato euro.
- **Ejemplo:**

  ```ts
  eurilize(1000); // "1.000,00 €"
  eurilize('50.5'); // "50,50 €"
  eurilize(null); // "0,00 €"
  ```

---

### `slugify(text: string): string`

Convierte un texto en un _slug_ optimizado para SEO. Normaliza acentos, pasa a minúsculas, reemplaza espacios por guiones y elimina caracteres especiales.

- **Parámetro:**
  `text` - cadena original que quieres convertir.
- **Retorna:**
  Cadena en formato slug.
- **Ejemplo:**

  ```ts
  slugify('Camiseta de Pádel Premium!'); // "camiseta-de-padel-premium"
  ```

---

### `calculateSavings(originalPrice: number, discountedPrice: number): CalculateSavings`

Calcula el ahorro absoluto y el porcentaje de ahorro respecto al precio original dado un precio con descuento.

- **Parámetros:**
  - `originalPrice` - precio original (debe ser mayor o igual a 0).
  - `discountedPrice` - precio tras descuento.

- **Retorna:**
  Un objeto con:
  - `amountSaved`: cantidad ahorrada absoluta.
  - `percentSaved`: porcentaje de ahorro con dos decimales.

- **Comportamiento:**
  Si el precio original es menor o igual a 0 o el precio con descuento es mayor o igual al original, retorna 0 en ambos valores.

---

### `applyDiscount(subtotal: number, discount: SimpleDiscount): { total: number; savings: number }`

Aplica un único descuento sobre un subtotal, considerando su tipo, monto, mínimo requerido y fecha de expiración.

- **Parámetros:**
  - `subtotal` - total antes del descuento.
  - `discount` - objeto con la información del descuento:
    - `type`: `'percentage'` (porcentaje) o `'fixed'` (cantidad fija).
    - `amount`: valor numérico del descuento.
    - Opcional `minSubtotal`: subtotal mínimo para aplicar.
    - Opcional `expiresAt`: fecha límite de validez.

- **Retorna:**
  Un objeto con:
  - `total`: total tras aplicar el descuento (no menor a 0).
  - `savings`: cantidad descontada (0 si no aplica).

- **Ejemplo:**

  ```ts
  applyDiscount(100, { type: 'percentage', amount: 10 }); // { total: 90, savings: 10 }
  applyDiscount(50, { type: 'fixed', amount: 5 }); // { total: 45, savings: 5 }
  ```

---

### `mergeCarts(base: CartItem[], incoming: CartItem[]): CartItem[]`

Combina dos carritos sumando cantidades de productos que estén repetidos y mezclando los datos de producto, priorizando la información del carrito `incoming` en caso de conflicto.

- **Parámetros:**
  - `base` - carrito original (ej. anónimo).
  - `incoming` - carrito nuevo (ej. usuario logueado).

- **Retorna:**
  Un arreglo con los productos combinados.
- **Comportamiento:**
  - Si un producto está en ambos carritos, suma las cantidades.
  - Para otros campos de producto (nombre, precio, variantes, etc.) se usa el dato del carrito `incoming`.
  - Se eliminan productos con cantidad ≤ 0.

- **Ejemplo:**

  ```ts
  const carrito1 = [{ productId: 'p1', quantity: 2, name: 'Camiseta' }];
  const carrito2 = [{ productId: 'p1', quantity: 1, name: 'Camiseta Azul' }];
  mergeCarts(carrito1, carrito2);
  // Resultado: [{ productId: 'p1', quantity: 3, name: 'Camiseta Azul' }]
  ```
