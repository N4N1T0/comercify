import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from 'fs';
import { dirname, join, resolve } from 'path';

export interface ModuleInfo {
  name: string;
  path: string;
  files: string[];
}

export interface CliOptions {
  help: boolean;
  list: boolean;
  force: boolean;
  module?: string;
  output?: string;
}

/** Folders under src/ that are tooling, not utility modules */
const RESERVED_FOLDERS = new Set(['cli', 'lib']);

/** Default destination, relative to the directory the CLI runs in */
export const DEFAULT_OUTPUT = './src/lib/comercify';

/**
 * Walks up from `startDir` until it finds the comercify package.json.
 * The CLI ships inside the package, so this works both from the repo and
 * from node_modules/comercify in a consumer project.
 */
export function findPackageRoot(startDir: string): string | null {
  let dir = resolve(startDir);

  while (true) {
    const manifest = join(dir, 'package.json');
    if (existsSync(manifest)) {
      try {
        if (JSON.parse(readFileSync(manifest, 'utf-8')).name === 'comercify') return dir;
      } catch {
        // an unreadable package.json is not ours, keep walking up
      }
    }
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

/** Source files of a module that are worth copying: no tests, no docs */
function isModuleSource(file: string): boolean {
  return file.endsWith('.ts') && !file.endsWith('.test.ts') && !file.endsWith('.d.ts');
}

/** Lists the utility modules in the package's src/ folder */
export function listModules(packageRoot: string): ModuleInfo[] {
  const srcDir = join(packageRoot, 'src');
  if (!existsSync(srcDir)) return [];

  return readdirSync(srcDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !RESERVED_FOLDERS.has(entry.name))
    .map((entry) => {
      const path = join(srcDir, entry.name);
      return { name: entry.name, path, files: readdirSync(path).filter(isModuleSource).sort() };
    })
    .filter((module) => module.files.includes('index.ts'))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Parses the CLI arguments. Unknown flags throw so typos do not go unnoticed. */
export function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { help: false, list: false, force: false };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    // `pnpm run cli -- --list` forwards the separator itself
    if (arg === '--') continue;
    const [flag, inlineValue] = arg.split('=', 2);
    const takeValue = () => {
      const value = inlineValue ?? argv[++i];
      if (!value || value.startsWith('-')) throw new Error(`${flag} needs a value`);
      return value;
    };

    switch (flag) {
      case '-h':
      case '--help':
        options.help = true;
        break;
      case '-l':
      case '--list':
        options.list = true;
        break;
      case '-f':
      case '--force':
        options.force = true;
        break;
      case '-m':
      case '--module':
        options.module = takeValue();
        break;
      case '-o':
      case '--output':
        options.output = takeValue();
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

/**
 * Copies a module's source files into `outputDir/<module>`.
 * Refuses to overwrite existing files unless `force` is set, and copies
 * nothing in that case, so a project is never left half-updated.
 *
 * @returns The absolute paths of the files written.
 */
export function copyModule(module: ModuleInfo, outputDir: string, force = false): string[] {
  const target = resolve(outputDir, module.name);
  const pairs = module.files.map((file) => [join(module.path, file), join(target, file)]);

  const existing = pairs.filter(([, to]) => existsSync(to)).map(([, to]) => to);
  if (existing.length > 0 && !force) {
    throw new Error(
      `These files already exist, run again with --force to overwrite them:\n  ${existing.join('\n  ')}`
    );
  }

  mkdirSync(target, { recursive: true });
  for (const [from, to] of pairs) copyFileSync(from, to);
  return pairs.map(([, to]) => to);
}
