import { defineConfig } from 'tsup';

// one source of truth for the build: `pnpm build` and `pnpm dev` only call tsup
export default defineConfig({
  entry: ['src/*/index.ts', 'src/cli/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
});
