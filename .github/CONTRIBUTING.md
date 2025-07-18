# Contributing to Comercify

First off, thank you for considering contributing to Comercify! It's people like you that make this project a valuable resource for the e-commerce community. We are excited to see your contributions.

## How to Add Your Utility Function

We've tried to make it as easy as possible to contribute your own utility functions. Here is a step-by-step guide to help you get started:

### Step 1: Fork the Repository

If you're new to contributing, you'll need to **[fork the repository](https://github.com/comercify-dev/comercify/fork)**. This will create a copy of the project in your own GitHub account that you can work on.

### Step 2: Clone Your Fork

Now, clone your forked repository to your local machine:

```sh
git clone https://github.com/YOUR_USERNAME/comercify.git
cd comercify
```

### Step 3: Create a New Branch

Create a new branch for your contribution. A good branch name is descriptive of the feature you're adding.

```sh
git checkout -b feat/add-my-new-function
```

### Step 4: Create Your Module

Inside the `src` directory, create a new folder with your GitHub username. This will be your personal module where you can add your functions.

```sh
mkdir src/YOUR_USERNAME
```

### Step 5: Add Your Function and Tests

Inside your new module folder (`src/YOUR_USERNAME`), create two files:

1. `index.ts`: This is where you'll add your utility function. Make sure to export it!
2. `index.test.ts`: This is where you'll add tests for your function using `vitest`.

**Example `index.ts`:**

```typescript
export const yourNewFunction = (name: string): string => {
  return `Hello, ${name}!`;
};
```

**Example `index.test.ts`:**

```typescript
import { describe, it, expect } from 'vitest';
import { yourNewFunction } from './index';

describe('yourNewFunction', () => {
  it('should return a greeting', () => {
    expect(yourNewFunction('World')).toBe('Hello, World!');
  });
});
```

### Step 6: Export Your Module

Open the `package.json` file and add your new module to the `exports` field. This makes your function available to everyone who uses the package.

```json
"exports": {
  "./adrian": "./dist/adrian/index.js",
  "./YOUR_USERNAME": "./dist/YOUR_USERNAME/index.js"
},
```

### Step 7: Build and Test Your Changes

Make sure everything is working correctly by running the build and test commands:

```sh
pnpm build
pnpm test
```

### Step 8: Submit a Pull Request

Once you're happy with your changes, commit them and push them to your fork:

```sh
git add .
git commit -m "feat: Add my new function"
git push origin feat/add-my-new-function
```

Finally, go to your fork on GitHub and **[open a pull request](https://github.com/comercify-dev/comercify/pulls)**. We'll review it as soon as we can!

## Code of Conduct

To ensure a welcoming and inclusive community, we have a **[Code of Conduct](./CODE_OF_CONDUCT.md)** that all contributors are expected to follow.

## License

By contributing, you agree that your contributions will be licensed under the **[MIT License](./LICENSE)** that covers the project.
