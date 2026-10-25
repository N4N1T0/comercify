# 🛒 Comercify

Typed, dependency-free utility functions for e-commerce in TypeScript: prices and
taxes, discounts, carts, shipping and catalog data. Install it from npm, or copy the
source into your project with the CLI and own the code.

[![npm version](https://img.shields.io/npm/v/comercify.svg)](https://www.npmjs.com/package/comercify)
[![CI](https://img.shields.io/github/actions/workflow/status/N4N1T0/comercify/ci.yml?label=CI)](https://github.com/N4N1T0/comercify/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Contributors](https://img.shields.io/github/contributors/N4N1T0/comercify)](https://github.com/N4N1T0/comercify/graphs/contributors)

```typescript
import { formatPrice, removeTax, pickBestDiscount } from 'comercify/adrian';

formatPrice(1234.5, { currency: 'USD', locale: 'en-US' }); // "$1,234.50"
removeTax(121, 21); // { net: 100, tax: 21, gross: 121 }
pickBestDiscount(80, [
  { type: 'percentage', amount: 10 },
  { type: 'fixed', amount: 15, minSubtotal: 50 },
]); // { discount: { type: 'fixed', ... }, total: 65, savings: 15 }
```

## Why Comercify

Every store reimplements the same small pieces: rounding money without float noise,
taking VAT out of a gross price, picking the best discount, telling the shopper how
far they are from free shipping. Comercify keeps them in one place, tested.

- **Typed:** written in TypeScript, with declarations for every `moduleResolution`.
- **No dependencies:** nothing to audit beyond the package itself.
- **Tree-shakeable:** ESM and CommonJS builds, marked side-effect free.
- **Runs anywhere:** browsers and Node.js 20 or later.
- **Tested:** every function has unit tests, run in CI on Node.js 20, 22 and 24.

## Installation

```bash
pnpm add comercify
# or
npm install comercify
# or
yarn add comercify
```

## Usage

### Import from the package

Functions are grouped in modules, one per contributor, and each module is a subpath
of the package:

```typescript
import { cartSubtotal, freeShippingProgress } from 'comercify/adrian';

const items = [
  { price: 19.99, quantity: 2 },
  { price: 5, quantity: 1 },
];

cartSubtotal(items); // 44.98
freeShippingProgress(cartSubtotal(items), 50); // { qualified: false, remaining: 5.02, percent: 89.96 }
```

### Copy the source into your project

If you prefer to own and edit the code, the CLI copies a module's source files into
your project, the way shadcn/ui copies components:

```bash
npx comercify-cli --module adrian   # copies to ./src/lib/comercify/adrian
```

```typescript
import { eurilize, slugify } from './src/lib/comercify/adrian';
```

Run `npx comercify-cli --help` for every option, or see the
[CLI documentation](src/cli/README.md).

## Functions

The `adrian` module has 21 functions. Each one is documented with examples in the
[module documentation](src/adrian/README.md).

| Domain    | Functions                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| Money     | `formatPrice`, `eurilize`, `parsePrice`, `roundMoney`, `addTax`, `removeTax`, `calculateSavings`             |
| Discounts | `applyDiscount`, `isDiscountActive`, `pickBestDiscount`, `generateInviteCode`                                |
| Cart      | `cartSubtotal`, `cartItemCount`, `updateCartItem`, `mergeCarts`, `calculateShipping`, `freeShippingProgress` |
| Catalog   | `isValidGtin`, `generateSku`, `getStockStatus`, `slugify`                                                    |

## Modules

| Module                         | Author                               | Functions |
| ------------------------------ | ------------------------------------ | --------- |
| [adrian](src/adrian/README.md) | [@N4N1T0](https://github.com/N4N1T0) | 21        |

## Contributing

Comercify grows by modules: you add a folder under `src/` with your GitHub username,
your functions, their types, tests and a README, and the package exports it as
`comercify/<your-username>`.

The [contribution guide](.github/CONTRIBUTING.md) walks through every step. Before you
open a pull request, run the same checks as CI:

```bash
pnpm lint && pnpm typecheck && pnpm format:check && pnpm test && pnpm build
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md). Version 2.0.0 requires Node.js 20 or later.

## License

[MIT](LICENSE)

---

<div align="center">
  <p>Made with ❤️ by Adrian "Nano" Alvarez</p>
  <p>⭐ Star this repo if you found it helpful!</p>
  <p>☕ <a href="https://buymeacoffee.com/n4n1t0">Buy me a coffee</a></p>
</div>
