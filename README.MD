# 🛒 Comercify

> **E-commerce utility functions by the community, for the community.**
> [![npm version](https://img.shields.io/npm/v/comercify.svg)](https://www.npmjs.com/package/comercify)
> [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
> [![CI](https://img.shields.io/github/actions/workflow/status/N4N1T0/comercify/ci.yml?label=CI)](https://github.com/N4N1T0/comercify/actions/workflows/ci.yml)

## [![Contributors](https://img.shields.io/github/contributors/N4N1T0/comercify)](https://github.com/N4N1T0/comercify/graphs/contributors)

## 📖 What is Comercify?

**Comercify** is a community-driven **open source** project providing a **collection of utility functions for e-commerce development**: prices and taxes, discounts, carts, shipping and catalog data.
Each contributor adds **their own module** with specific functions, which can be imported from the package or copied into your project with the CLI.

The functions are typed, dependency-free and tested, and they run in the browser and on Node.js 20 or later.

---

## 🚀 Installation

```bash
pnpm add comercify
# or
npm install comercify
# or
yarn add comercify
```

---

## ⚡ Usage

### Import from the package

```typescript
import { formatPrice, removeTax, pickBestDiscount } from 'comercify/adrian';

formatPrice(1234.5, { currency: 'USD', locale: 'en-US' }); // "$1,234.50"
removeTax(121, 21); // { net: 100, tax: 21, gross: 121 }
pickBestDiscount(80, [
  { type: 'percentage', amount: 10 },
  { type: 'fixed', amount: 15, minSubtotal: 50 },
]); // { discount: { type: 'fixed', ... }, total: 65, savings: 15 }
```

The package ships ESM and CommonJS builds with type declarations, so it works
with `import` and `require` and with every TypeScript `moduleResolution`.

### Copy the source into your project

If you prefer to own and edit the code, the CLI copies a module's source files
into your project, the way shadcn/ui copies components:

```bash
npx comercify-cli --module adrian   # copies to ./src/lib/comercify/adrian
```

```typescript
import { eurilize, slugify } from './src/lib/comercify/adrian';
```

Run `npx comercify-cli --help` for every option, or see the
[CLI documentation](src/cli/README.md).

---

## 🧰 Functions

The `adrian` module has 21 functions. Every one is documented with examples in
the [module documentation](src/adrian/README.md).

| Domain    | Functions                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| Money     | `formatPrice`, `eurilize`, `parsePrice`, `roundMoney`, `addTax`, `removeTax`, `calculateSavings`             |
| Discounts | `applyDiscount`, `isDiscountActive`, `pickBestDiscount`, `generateInviteCode`                                |
| Cart      | `cartSubtotal`, `cartItemCount`, `updateCartItem`, `mergeCarts`, `calculateShipping`, `freeShippingProgress` |
| Catalog   | `isValidGtin`, `generateSku`, `getStockStatus`, `slugify`                                                    |

---

## 📚 Module Documentation

Documentation for each module contributed by the community:

- [adrian](src/adrian/README.md)

---

## 🙌 How to Contribute

All contributions are welcome!
If you have a utility function that could help the community, follow these steps to add it:

1. **Fork the repository** and create a new branch for your feature.

2. **Create a new module**: inside `src`, create a folder with your GitHub
   username (e.g. `src/your-username`). Group related functions in files by
   domain (`money.ts`, `cart.ts`...) and re-export them from `index.ts`:

   ```typescript
   // src/your-username/index.ts
   export type * from './types';
   export { yourNewFunction } from './your-domain';
   ```

3. **Add types** for your module in `types.ts`.

4. **Add tests** next to each file (`your-domain.test.ts`) with
   [Vitest](https://vitest.dev).

5. **Add documentation** in `src/your-username/README.md` and link it in the
   **Module Documentation** section above.

6. **Export your module** in `package.json`, with the same shape as `adrian`:

   ```json
   "./your-username": {
     "import": {
       "types": "./dist/your-username/index.d.mts",
       "default": "./dist/your-username/index.mjs"
     },
     "require": {
       "types": "./dist/your-username/index.d.ts",
       "default": "./dist/your-username/index.js"
     }
   }
   ```

   and add it to `typesVersions` for TypeScript's `node10` resolution.

7. **Run the checks** that CI runs on every pull request:

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm format:check
   pnpm test
   pnpm build
   ```

8. **Submit a Pull Request** with your changes.
   See our [Contribution Guide](.github/CONTRIBUTING.md) for details.

---

## 📝 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for more information.

---

<div align="center">
  <p>Made with ❤️ by Adrian "Nano" Alvarez</p>
  <p>⭐ Star this repo if you found it helpful!</p>
  <p>☕ <a href="https://buymeacoffee.com/n4n1t0">Buy me a coffee</a></p>
</div>
