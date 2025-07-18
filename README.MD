# 🛒 Comercify

> E-commerce utility functions by the community, for the community.

[![npm version](https://img.shields.io/npm/v/comercify.svg)](https://www.npmjs.com/package/comercify)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/comercify-dev/comercify/ci.yml?branch=main)](https://github.com/comercify-dev/comercify/actions)
[![Contributors](https://img.shields.io/github/contributors/comercify-dev/comercify)](https://github.com/comercify-dev/comercify/graphs/contributors)

---

## 📖 Description

Comercify is a community-driven open-source project that provides a collection of utility functions for e-commerce development. The goal is to create a shared library of reusable functions that can simplify common tasks when building e-commerce applications.

Each contributor can add their own module with specific functions, which can be easily imported from the main package.

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

## Usage

Once installed, you can import the utility functions from the different modules. For example, to use a function from the `adrian` module:

```typescript
import { myFunction } from 'comercify/adrian';

// Use the function in your code
myFunction();
```

---

## 🙌 Contributing

We welcome contributions from everyone! If you have a utility function that you think would be useful for the community, here's how you can add it to Comercify:

1. **Fork the repository** and create a new branch for your feature.

2. **Create a new module**: Inside the `src` directory, create a new folder with your GitHub username (e.g., `src/your-username`).

3. **Add your functions**: Inside your new module folder, create an `index.ts` file and add your utility functions. Make sure to export them.

   ```typescript
   // src/your-username/index.ts
   export const yourNewFunction = () => {
     // Your function logic here
   };
   ```

4. **Export your module**: Open the `package.json` file and add your new module to the `exports` field. This will make it accessible to users of the package.

   ```json
   "exports": {
     "./adrian": "./dist/adrian/index.js",
     "./your-username": "./dist/your-username/index.js"
   },
   ```

5. **Build and test**: Make sure your changes work correctly by running the build and test commands:

   ```bash
   pnpm build
   pnpm test
   ```

6. **Submit a pull request**: Push your changes to your fork and open a pull request to the main repository.

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
