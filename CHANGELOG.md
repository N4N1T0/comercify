# Changelog

## 2.0.0

### Breaking changes

- Node.js 20 or later is required (`generateInviteCode` uses the Web Crypto
  global). Node 18 reached end of life in April 2025.
- The CLI copies a whole module into `<output>/<module>/` instead of a single
  `index.ts` file. New options: `--module`, `--output`, `--list` and `--force`.
  It never overwrites files without `--force`.
- `main` and `types` are gone from `package.json`: they pointed at files that
  were never built. Import from `comercify/adrian`.

### New functions

- Money: `formatPrice`, `parsePrice`, `roundMoney`, `addTax`, `removeTax`
- Cart: `cartSubtotal`, `cartItemCount`, `updateCartItem`, `calculateShipping`,
  `freeShippingProgress`
- Discounts: `isDiscountActive`, `pickBestDiscount`, `generateInviteCode` (#1)
- Catalog: `isValidGtin`, `generateSku`, `getStockStatus`

### Fixes

- `eurilize` used a regular space instead of the locale's non-breaking space for
  invalid input.
- `calculateSavings` returned floating point noise (`50.00000000000001`).
- `applyDiscount` reported savings larger than the subtotal.
- Types (`SimpleDiscount`, `CartItem`...) are exported, and resolve under every
  TypeScript `moduleResolution`.
- The CLI crashed under ESM and looked for modules in the wrong project.
- The npm package no longer ships tests, configs and CI files.

### Tooling

- CI runs lint, typecheck, format check, tests, build and publint on every pull
  request, on Node 20, 22 and 24.
- Publishing checks that the tag matches `package.json`, runs the tests first
  and publishes with npm provenance.

## 1.2.0

- Interactive CLI to copy a module into a project.

## 0.1.0

- First release: `eurilize`, `slugify`, `calculateSavings`, `applyDiscount` and
  `mergeCarts`.
