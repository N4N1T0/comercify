#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { createInterface } from 'readline';

let __dirname: string;
try {
  const __filename = fileURLToPath(import.meta.url);
  __dirname = dirname(__filename);
} catch {
  // eslint-disable-next-line
  __dirname = process.cwd();
}

interface UserFolder {
  name: string;
  path: string;
  hasIndex: boolean;
}

/**
 * Finds the project root directory by looking for package.json
 */
function findProjectRoot(): string {
  let currentDir = process.cwd();

  while (currentDir !== dirname(currentDir)) {
    if (existsSync(join(currentDir, 'package.json'))) {
      return currentDir;
    }
    currentDir = dirname(currentDir);
  }

  return process.cwd();
}

/**
 * Scans the src directory for user folders (directories with index.ts files)
 */
function scanUserFolders(srcDir: string): UserFolder[] {
  const folders: UserFolder[] = [];

  try {
    const entries = readdirSync(srcDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'lib' && entry.name !== 'cli') {
        const folderPath = join(srcDir, entry.name);
        const indexPath = join(folderPath, 'index.ts');

        folders.push({
          name: entry.name,
          path: folderPath,
          hasIndex: existsSync(indexPath),
        });
      }
    }
  } catch (error) {
    console.error('❌ Error scanning folders:', error);
  }

  return folders;
}

/**
 * Creates a readline interface for user input
 */
function createReadlineInterface() {
  return createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Prompts user to select a folder
 */
function promptFolderSelection(folders: UserFolder[]): Promise<UserFolder | null> {
  return new Promise((resolve) => {
    const rl = createReadlineInterface();

    console.log('\n📁 Available user folders:');
    folders.forEach((folder, index) => {
      const status = folder.hasIndex ? '✅' : '❌';
      console.log(
        `  ${index + 1}. ${folder.name} ${status} ${folder.hasIndex ? '(has index.ts)' : '(no index.ts)'}`
      );
    });

    rl.question('\n🔢 Select a folder number (or press Enter to cancel): ', (answer) => {
      rl.close();

      if (!answer.trim()) {
        resolve(null);
        return;
      }

      const selection = parseInt(answer.trim());
      if (isNaN(selection) || selection < 1 || selection > folders.length) {
        console.log('❌ Invalid selection.');
        resolve(null);
        return;
      }

      const selectedFolder = folders[selection - 1];
      if (!selectedFolder.hasIndex) {
        console.log('❌ Selected folder does not have an index.ts file.');
        resolve(null);
        return;
      }

      resolve(selectedFolder);
    });
  });
}

/**
 * Prompts user for output path
 */
function promptOutputPath(defaultPath: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createReadlineInterface();

    rl.question(`\n📝 Enter output path (default: ${defaultPath}): `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultPath);
    });
  });
}

/**
 * Copies the index.ts file from selected folder to output path
 */
function copyIndexFile(sourceFolder: UserFolder, outputPath: string): boolean {
  try {
    const sourcePath = join(sourceFolder.path, 'index.ts');

    let absoluteOutputPath: string;
    if (outputPath.startsWith('./') || outputPath.startsWith('../') || !outputPath.includes(':')) {
      absoluteOutputPath = join(process.cwd(), outputPath);
    } else {
      absoluteOutputPath = outputPath;
    }

    const outputDir = dirname(absoluteOutputPath);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const sourceContent = readFileSync(sourcePath, 'utf-8');

    const header = `/**
 * Comercify - Copied from ${sourceFolder.name} module
 * 
 * This file was copied by the Comercify CLI.
 * Source: ${sourcePath}
 * 
 * Generated on: ${new Date().toISOString()}
 */

`;

    writeFileSync(absoluteOutputPath, header + sourceContent);

    return true;
  } catch (error) {
    console.error('❌ Error copying file:', error);
    return false;
  }
}

/**
 * Shows help information
 */
function showHelp() {
  console.log(`
Comercify CLI - Copy user module

Usage:
  npx comercify-cli [options]

Options:
  -h, --help            Show this help message

Description:
  This CLI tool scans for user folders in the src directory,
  lets you select one, and copies its index.ts file to a
  specified location (default: ./src/lib/comercify.ts)

Examples:
  npx comercify-cli
  pnpm run cli`);
}

/**
 * Main CLI function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('-h') || args.includes('--help')) {
    showHelp();
    process.exit(0);
  }

  console.log('🛒 Comercify CLI - Copy user module...');

  const projectRoot = findProjectRoot();
  if (!projectRoot) {
    console.error('❌ Error: Could not find project root (package.json not found)');
    process.exit(1);
  }

  const srcDir = join(projectRoot, 'src');

  if (!existsSync(srcDir)) {
    console.error('❌ Error: src directory not found');
    process.exit(1);
  }

  console.log('📁 Scanning user folders...');
  const folders = scanUserFolders(srcDir);

  if (folders.length === 0) {
    console.log('⚠️  No user folders found in src directory');
    process.exit(0);
  }

  const selectedFolder = await promptFolderSelection(folders);
  if (!selectedFolder) {
    console.log('❌ Operation cancelled.');
    process.exit(0);
  }

  console.log(`✅ Selected folder: ${selectedFolder.name}`);

  const defaultOutputPath = './src/lib/comercify.ts';
  const outputPath = await promptOutputPath(defaultOutputPath);

  console.log('📝 Copying index.ts file...');

  const success = copyIndexFile(selectedFolder, outputPath);

  if (success) {
    let finalOutputPath: string;
    if (outputPath.startsWith('./') || outputPath.startsWith('../') || !outputPath.includes(':')) {
      finalOutputPath = join(process.cwd(), outputPath);
    } else {
      finalOutputPath = outputPath;
    }

    console.log(`✅ File copied successfully to: ${finalOutputPath}`);
    console.log(`\n📋 Summary:`);
    console.log(`   Source: ${join(selectedFolder.path, 'index.ts')}`);
    console.log(`   Destination: ${finalOutputPath}`);
  } else {
    console.log('❌ Failed to copy file.');
    process.exit(1);
  }
}

// Run the CLI
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ CLI Error:', error);
    process.exit(1);
  });
}

export { main };
