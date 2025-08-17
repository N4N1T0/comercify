# Comercify CLI Tool

A command-line interface tool for copying user module files in the Comercify
project.

## Purpose

This CLI tool scans your project's `src/` directory for user folders (excluding
`cli` and `lib`), lets you select one interactively, and copies its `index.ts`
file to a specified location. This is useful for quickly duplicating module
structures or creating new modules based on existing ones.

## Installation

### Via npm scripts (Recommended)

```bash
# Run the CLI tool interactively
pnpm run cli
```

### Via npx (after publishing)

```bash
# Run interactively
npx comercify-cli
```

### Direct execution

```bash
# After building the project
node dist/cli/index.js
```

## Usage

### Interactive Mode

```bash
pnpm run cli
```

This will:

1. Scan the `src/` directory for user folders
2. Display available folders with their status (whether they have `index.ts`)
3. Let you select a folder interactively
4. Prompt for an output path (default: `./src/lib/comercify.ts`)
5. Copy the selected folder's `index.ts` file to the specified location

### Command Line Options

- `-h, --help`: Show help information

## Examples

### Example 1: Interactive Selection

```bash
pnpm run cli
```

**Output:**

```ts
🛒 Comercify CLI - Copy user module...
📁 Scanning user folders...

📁 Available user folders:
  1. adrian ✅ (has index.ts)
  2. utils ❌ (no index.ts)

🔢 Select a folder number (or press Enter to cancel): 1
✅ Selected folder: adrian

📝 Enter output path (default: ./src/lib/comercify.ts):
📝 Copying index.ts file...
✅ File copied successfully to: /path/to/project/src/lib/comercify.ts

📋 Summary:
   Source: /path/to/project/src/adrian/index.ts
   Destination: /path/to/project/src/lib/comercify.ts
```

### Example 2: Custom Output Path

When prompted for output path:

```ts
📝 Enter output path (default: ./src/lib/comercify.ts): ./src/new-module/index.ts
```

**Generated file content:**

```typescript
/**
 * Comercify - Copied from adrian module
 *
 * This file was copied by the Comercify CLI.
 * Source: /path/to/project/src/adrian/index.ts
 *
 * Generated on: 2024-01-15T10:30:00.000Z
 */

// Original content from adrian/index.ts follows...
import { CalculateSavings, CartItem, SimpleDiscount } from './types';

export function eurilize(value: number | string | null = 0): string {
  // ... rest of the original file content
}
```

## How It Works

1. **Folder Discovery**: Scans the `src/` directory for subdirectories
   (excluding `cli` and `lib`)
2. **Status Check**: Verifies which folders contain an `index.ts` file
3. **Interactive Selection**: Presents a numbered list for user selection
4. **Path Input**: Prompts for output location with a sensible default
5. **File Copy**: Copies the source file with a header comment indicating the
   source

## Folder Requirements

For a folder to be selectable:

- ✅ Must be located in the `src/` directory
- ✅ Must contain an `index.ts` file
- ❌ Cannot be named `cli` or `lib` (automatically excluded)

## Use Cases

### Creating New Modules

1. Use the CLI to copy an existing module as a starting point
2. Modify the copied file to implement new functionality
3. Update imports and exports as needed

### Backing Up Modules

1. Copy important modules to a backup location
2. Preserve the original structure and comments
3. Maintain development history through the header comments

### Module Templates

1. Create template modules with common patterns
2. Copy templates when starting new features
3. Ensure consistency across the codebase

## Benefits

- **Quick Module Duplication**: Copy existing modules as starting points
- **Preserves Structure**: Maintains original file organization
- **Source Tracking**: Header comments show the original source
- **Interactive UX**: User-friendly selection process
- **Flexible Output**: Choose any destination path

## Development

### Adding New User Folders

1. Create a new directory in `src/` (avoid names `cli` and `lib`)
2. Add an `index.ts` file with your code
3. The folder will automatically appear in the CLI selection list

### Modifying Excluded Folders

To change which folders are excluded, modify the scanning logic in
`scanUserFolders()` function.

## Troubleshooting

### No folders found

Ensure:

- You're running the command from the project root
- The `src/` directory exists
- There are subdirectories in `src/` other than `cli` and `lib`

### Selected folder has no index.ts

The CLI will show an error if you select a folder without an `index.ts` file.
Only select folders marked with ✅.

### Permission errors

Ensure you have:

- Read permissions for the source file
- Write permissions for the output directory
- The output directory will be created automatically if it doesn't exist
