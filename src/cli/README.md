# Comercify CLI

Copies a Comercify module's source files into your project, so you own the code
and can change it, the way shadcn/ui copies components.

## Usage

```bash
npx comercify-cli                      # pick a module and a folder interactively
npx comercify-cli --module adrian      # copy to ./src/lib/comercify/adrian
npx comercify-cli -m adrian -o ./lib   # copy to ./lib/adrian
npx comercify-cli --list               # list the modules and their files
```

The files land in `<output>/<module>/`. Tests are not copied. Import from the
folder like any local module:

```ts
import { eurilize, slugify } from './src/lib/comercify/adrian';
```

## Options

| Option                | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `-m, --module <name>` | Module to copy. Asked for when omitted in a terminal. |
| `-o, --output <dir>`  | Destination folder. Default: `./src/lib/comercify`.   |
| `-l, --list`          | List the available modules and exit.                  |
| `-f, --force`         | Overwrite files that already exist.                   |
| `-h, --help`          | Show the help message.                                |

Without `--force`, the CLI refuses to overwrite an existing file and copies
nothing, so local edits are never lost halfway through. Outside a terminal (CI,
scripts), `--module` is required.

## Development

```bash
pnpm run cli -- --list   # run the CLI from source with tsx
pnpm test                # the CLI logic lives in lib.ts and is unit tested
```
