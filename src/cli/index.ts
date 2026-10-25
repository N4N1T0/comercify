#!/usr/bin/env node

import { createInterface } from 'readline';
import {
  DEFAULT_OUTPUT,
  ModuleInfo,
  copyModule,
  findPackageRoot,
  listModules,
  parseArgs,
} from './lib';

const HELP = `
Comercify CLI - copy a utility module into your project

Usage:
  npx comercify-cli [options]

Options:
  -m, --module <name>   Module to copy (e.g. adrian). Asked for when omitted.
  -o, --output <dir>    Destination folder (default: ${DEFAULT_OUTPUT})
  -l, --list            List the available modules and exit
  -f, --force           Overwrite files that already exist
  -h, --help            Show this help message

The module's source files are copied to <dir>/<module>/, so you own the code
and can edit it. Tests are not copied.

Examples:
  npx comercify-cli
  npx comercify-cli --module adrian
  npx comercify-cli -m adrian -o ./lib/shop --force`;

function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

async function pickModule(modules: ModuleInfo[]): Promise<ModuleInfo | null> {
  console.log('\n📁 Available modules:');
  modules.forEach((module, index) => {
    console.log(`  ${index + 1}. ${module.name} (${module.files.length} files)`);
  });

  const answer = await ask('\n🔢 Select a module number (or press Enter to cancel): ');
  if (!answer) return null;

  const selection = Number(answer);
  if (!Number.isInteger(selection) || selection < 1 || selection > modules.length) {
    throw new Error(`Invalid selection: ${answer}`);
  }
  return modules[selection - 1];
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    console.log(HELP);
    return;
  }

  const packageRoot = findPackageRoot(__dirname);
  if (!packageRoot) throw new Error('Could not find the comercify package files.');

  const modules = listModules(packageRoot);
  if (modules.length === 0) throw new Error('No modules found in the comercify package.');

  if (options.list) {
    modules.forEach((module) => console.log(`${module.name}  ${module.files.join(', ')}`));
    return;
  }

  let module: ModuleInfo | null | undefined;
  if (options.module) {
    module = modules.find((candidate) => candidate.name === options.module);
    if (!module) {
      const names = modules.map((candidate) => candidate.name).join(', ');
      throw new Error(`Unknown module "${options.module}". Available: ${names}`);
    }
  } else if (process.stdin.isTTY) {
    module = await pickModule(modules);
    if (!module) {
      console.log('❌ Operation cancelled.');
      return;
    }
  } else {
    throw new Error('No module given. Pass --module <name> when not running interactively.');
  }

  const output =
    options.output ??
    (process.stdin.isTTY
      ? (await ask(`\n📝 Destination folder (default: ${DEFAULT_OUTPUT}): `)) || DEFAULT_OUTPUT
      : DEFAULT_OUTPUT);

  const written = copyModule(module, output, options.force);
  console.log(`\n✅ Copied ${written.length} files from "${module.name}":`);
  written.forEach((file) => console.log(`   ${file}`));
}

main().catch((error: unknown) => {
  console.error(`❌ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
