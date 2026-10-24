# adrian

E-commerce utilities for prices, taxes, discounts, carts, shipping and catalog
data. Every function is pure, typed and dependency-free.

```ts
import { formatPrice, cartSubtotal } from 'comercify/adrian';
```

All the types used below (`SimpleDiscount`, `CartItem`, `PricedCartItem`,
`TaxBreakdown`...) are exported from the same entry.

---

## Money

### `formatPrice(value, { currency = 'EUR', locale = 'de-DE' }?): string`

Formats an amount in any currency and locale with `Intl.NumberFormat`. Invalid
input formats as zero.

```ts
formatPrice(1234.5, { currency: 'USD', locale: 'en-US' }); // "$1,234.50"
formatPrice(1234.5, { currency: 'GBP', locale: 'en-GB' }); // "£1,234.50"
```

### `eurilize(value = 0): string`

Shortcut for euros in the German locale (`formatPrice` with its defaults).

```ts
eurilize(1000); // "1.000,00 €"
eurilize('50.5'); // "50,50 €"
eurilize(null); // "0,00 €"
```

### `parsePrice(text): number | null`

Reads a typed or scraped price. Understands currency symbols, spaces and both
decimal conventions. A lone separator followed by exactly three digits
(`"1.234"`) is read as a thousands separator. Returns `null` when there is no
number.

```ts
parsePrice('1.234,56 €'); // 1234.56
parsePrice('$1,234.56'); // 1234.56
parsePrice('12,5'); // 12.5
parsePrice('Free'); // null
```

### `roundMoney(value, decimals = 2): number`

Rounds without floating point surprises. Halves round away from zero.

```ts
roundMoney(1.005); // 1.01 (toFixed gives "1.00")
roundMoney(0.1 + 0.2); // 0.3
```

### `addTax(net, ratePercent): TaxBreakdown`

Adds VAT, IVA or sales tax to a net price.

```ts
addTax(100, 21); // { net: 100, tax: 21, gross: 121 }
```

### `removeTax(gross, ratePercent): TaxBreakdown`

Splits a price with tax included into net and tax. `net + tax` always equals
`gross`, cent for cent.

```ts
removeTax(9.99, 21); // { net: 8.26, tax: 1.73, gross: 9.99 }
```

Both throw a `RangeError` for a negative or `NaN` rate.

### `calculateSavings(originalPrice, discountedPrice): CalculateSavings`

The amount saved (rounded to cents) and the percentage saved. Returns zeros when
the original price is not positive or the discounted price is not lower.

```ts
calculateSavings(200, 150); // { amountSaved: 50, percentSaved: 25 }
```

---

## Discounts

`SimpleDiscount` is
`{ type: 'percentage' | 'fixed', amount, minSubtotal?, expiresAt? }`.

### `applyDiscount(subtotal, discount): { total, savings }`

Applies one discount. Returns the subtotal untouched when the discount has
expired, the subtotal is below `minSubtotal`, or it saves nothing. Savings never
exceed the subtotal.

```ts
applyDiscount(100, { type: 'percentage', amount: 10 }); // { total: 90, savings: 10 }
applyDiscount(100, { type: 'fixed', amount: 500 }); // { total: 0, savings: 100 }
```

### `isDiscountActive(discount, subtotal?, now = new Date()): boolean`

The expiry and minimum subtotal rules on their own, to tell whether a coupon can
be used before applying it.

```ts
isDiscountActive({ type: 'fixed', amount: 5, minSubtotal: 30 }, 20); // false
```

### `pickBestDiscount(subtotal, discounts): BestDiscount`

Keeps the discount that saves the most. The first one wins a tie; `discount` is
`null` when none applies.

```ts
pickBestDiscount(80, [
  { type: 'percentage', amount: 10 },
  { type: 'fixed', amount: 15, minSubtotal: 50 },
]); // { discount: { type: 'fixed', ... }, total: 65, savings: 15 }
```

### `generateInviteCode({ length = 8, prefix = '', alphabet }?): string`

Random invite, referral or coupon codes, easy to read aloud: no `0/O` or `1/I/L`
by default. Uses Web Crypto with rejection sampling, so codes are neither
predictable nor biased.

```ts
generateInviteCode(); // "K7MQ2XRT"
generateInviteCode({ prefix: 'FRIEND-', length: 6 }); // "FRIEND-H4W9PC"
```

---

## Cart

`CartItem` is `{ productId, quantity, ...metadata }` and `PricedCartItem` adds a
unit `price`.

### `cartSubtotal(items): number`

Unit price times quantity across the cart, rounded to cents.

```ts
cartSubtotal([{ productId: 'p1', quantity: 3, price: 9.99 }]); // 29.97
```

### `cartItemCount(items): number`

Units for the cart badge. Lines with a quantity of 0 or below do not count.

```ts
cartItemCount([
  { productId: 'p1', quantity: 2 },
  { productId: 'p2', quantity: 1 },
]); // 3
```

### `updateCartItem(items, productId, quantity): items`

Returns a new cart with the quantity changed. 0 or below removes the line,
unknown products are left out, and fractional quantities throw a `RangeError`.

```ts
updateCartItem(cart, 'p1', 4);
updateCartItem(cart, 'p1', 0); // removes p1
```

### `mergeCarts(base, incoming): CartItem[]`

Merges two carts (for example the anonymous one and the one after signing in),
adding up quantities of the same product. On conflict, the incoming fields win.
Lines that end at 0 or below are dropped.

### `calculateShipping(subtotal, { flatRate, freeThreshold? }): number`

A flat rate with an optional free shipping threshold.

```ts
calculateShipping(30, { flatRate: 4.95, freeThreshold: 50 }); // 4.95
calculateShipping(60, { flatRate: 4.95, freeThreshold: 50 }); // 0
```

### `freeShippingProgress(subtotal, freeThreshold): FreeShippingProgress`

For "add X more for free shipping" messages and progress bars.

```ts
freeShippingProgress(37.5, 50); // { qualified: false, remaining: 12.5, percent: 75 }
```

---

## Catalog

### `isValidGtin(code): boolean`

Checks EAN-8, UPC-A, EAN-13 and GTIN-14 barcodes against their check digit, the
check Google Merchant Center runs on product feeds. Spaces and hyphens are
ignored.

```ts
isValidGtin('4006381333931'); // true
isValidGtin('4006381333932'); // false
```

### `generateSku(parts, { separator = '-', maxPartLength }?): string`

Readable SKUs from product attributes. Accents, spaces and symbols are removed
and empty parts are skipped.

```ts
generateSku(['Camiseta Pádel', 'Azul', 'XL']); // "CAMISETAPADEL-AZUL-XL"
generateSku(['T-shirt', 'Blue', 'XL'], { maxPartLength: 3 }); // "TSH-BLU-XL"
```

### `getStockStatus(quantity, { lowStockThreshold = 5 }?): StockStatus`

`'in_stock'`, `'low_stock'` or `'out_of_stock'`, for stock badges.

```ts
getStockStatus(3); // "low_stock"
```

### `slugify(text): string`

SEO-friendly slugs: strips accents, lowercases and replaces spaces with hyphens.

```ts
slugify('Camiseta de Pádel Premium!'); // "camiseta-de-padel-premium"
```
