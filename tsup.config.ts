import { defineConfig } from 'tsup';

// one source of truth for the build: `pnpm build` and `pnpm dev` only call tsup
//
// Library modules are browser-safe and must not pull in Node built-ins.
// `shims: true` made tsup inject an esm_shims chunk that calls
// `fileURLToPath(import.meta.url)` at module load, which crashes browsers.
// The CLI is the only consumer of `__dirname`, and it ships as a CJS bin
// (`dist/cli/index.js`) where `__dirname` exists natively.
export default defineConfig({
  entry: ['src/*/index.ts', 'src/cli/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
});
