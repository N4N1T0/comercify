# 🛒 Comercify

> **E-commerce utility functions by the community, for the community.**
> [![npm version](https://img.shields.io/npm/v/comercify.svg)](https://www.npmjs.com/package/comercify)
> [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](../LICENSE)
> [![Build Status](https://img.shields.io/github/actions/workflow/status/N4N1T0/comercify/update-package.yml)](https://github.com/N4N1T0/comercify/actions)

## [![Contributors](https://img.shields.io/github/contributors/N4N1T0/comercify)](https://github.com/N4N1T0/comercify/graphs/contributors)

## 📖 What is Comercify?

**Comercify** is a community-driven **open source** project providing a **collection of utility functions for e-commerce development**.
Its goal is to create a shared library of reusable functions that simplify common tasks when building e-commerce applications.
Each contributor can add **their own module** with specific functions, which can then be easily imported from the main package.

---

## 🚀 Installation

Install Comercify with your favorite package manager:

```bash
pnpm add comercify
# or
npm install comercify
# or
yarn add comercify
```

---

## ⚡ Usage

Once installed, you can import functions from different modules in two ways:

### Import by individual module

```typescript
import { eurilize, slugify } from 'comercify/adrian';

// Use the functions in your project
const price = eurilize(1234.56); // "1.234,56 €"
const slug = slugify('New Product'); // "new-product"
```

### Consolidated import (recommended)

Generate a consolidated file with all exports:

```bash
# Generates ./src/lib/comercify.ts with all exports
npx comercify-cli

# Or specify a custom path
npx comercify-cli --output ./src/utils.ts
```

Then import from the local file:

```typescript
import { eurilize, slugify, calculateSavings } from './lib/comercify';

// All functions available from a single file
const price = eurilize(1234.56);
const slug = slugify('New Product');
const savings = calculateSavings(100, 80);
```

---

## 🛠️ CLI Tool

Comercify includes a command-line tool to copy user module files into your project.

### Purpose

The CLI scans user folders in the `src/` directory, lets you select one interactively, and copies its `index.ts` file to a specified location.
This is useful for duplicating module structures or creating new modules based on existing ones.

### CLI Usage

```bash
# Run the interactive CLI
pnpm run cli
```

**Interactive Process:**

1. Displays available user folders with status
2. Lets you select a folder by number
3. Prompts for the output path (default: `./src/lib/comercify.ts`)
4. Copies the selected folder's `index.ts` file

**Example Output:**

```ts
📁 Available user folders:
  1. adrian ✅ (has index.ts)
  2. utils ❌ (no index.ts)

🔢 Select a folder number: 1
📝 Enter the output path (default: ./src/lib/comercify.ts):
✅ File copied successfully!
```

### Use Cases

- **Module Templates**: Copy existing modules as a starting point for new features
- **Code Backup**: Create backups of important modules
- **Structure Duplication**: Maintain consistent patterns across modules
- **Rapid Prototyping**: Quickly create new modules based on tested structures

### Benefits

- **Interactive Selection**: User-friendly folder selection process
- **Source Tracking**: Header comments show original source and timestamp
- **Flexible Output**: Choose any destination path
- **Structure Preservation**: Maintains organization and comments of the original file

For more details, check the [CLI documentation](src/cli/README.md).

---

## 📚 Module Documentation

Here you can find specific documentation for each module/package contributed by the community:

- [adrian](src/adrian/README.md)

---

## 🙌 How to Contribute

All contributions are welcome!
If you have a utility function that could help the community, follow these steps to add it:

1. **Fork the repository** and create a new branch for your feature.

2. **Create a new module**: Inside `src`, create a folder with your GitHub username (e.g., `src/your-username`).

3. **Add your functions** in `index.ts` and export them:

   ```typescript
   // src/your-username/index.ts
   export const yourNewFunction = () => {
     // Your logic here
   };
   ```

4. **Add types** for your module in `types.ts`:

   ```typescript
   export interface YourNewFunctionParams {
     // Define your parameters here
   }
   ```

5. **Add tests** for your module in `index.test.ts`:

   ```typescript
   import { yourNewFunction } from './index';
   import { YourNewFunctionParams } from './types';
   ```

6. **Add documentation** for your module in `src/your-username/README.md` and link it in the **Module Documentation** section of the main README.

7. **Export your module** in `package.json`:

   ```json
   "exports": {
     "./adrian": "./dist/adrian/index.js",
     "./your-username": "./dist/your-username/index.js"
   }
   ```

8. **Build and test** your changes:

   ```bash
   pnpm build
   pnpm test
   ```

9. **Submit a Pull Request** with your changes.
   See our [Contribution Guide](../CONTRIBUTING.md) for details.

---

## 📝 License

This project is licensed under the **MIT License**.
See the [LICENSE](../LICENSE) file for more information.

<div align="center">
  <p>Made with ❤️ by Adrian "Nano" Alvarez</p>
  <p>⭐ Star this repo if you found it helpful!</p>
  <p>☕ <a href="https://buymeacoffee.com/n4n1t0">Buy me a coffee</a></p>
</div>
