import { mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { beforeEach, describe, expect, it } from 'vitest';
import { copyModule, findPackageRoot, listModules, parseArgs } from './lib';

let root: string;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'comercify-cli-'));
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'comercify' }));
  mkdirSync(join(root, 'src', 'adrian'), { recursive: true });
  mkdirSync(join(root, 'src', 'cli'), { recursive: true });
  mkdirSync(join(root, 'src', 'empty'), { recursive: true });
  for (const file of ['index.ts', 'money.ts', 'types.ts', 'money.test.ts', 'README.md']) {
    writeFileSync(join(root, 'src', 'adrian', file), `// ${file}`);
  }
  writeFileSync(join(root, 'src', 'cli', 'index.ts'), '// cli');
});

describe('findPackageRoot', () => {
  it('walks up to the comercify package.json', () => {
    expect(findPackageRoot(join(root, 'src', 'adrian'))).toBe(root);
  });

  it('skips package.json files that belong to other packages', () => {
    const nested = join(root, 'node_modules', 'other');
    mkdirSync(nested, { recursive: true });
    writeFileSync(join(nested, 'package.json'), JSON.stringify({ name: 'other' }));
    expect(findPackageRoot(nested)).toBe(root);
  });
});

describe('listModules', () => {
  it('lists modules with an index.ts, without cli and without tests or docs', () => {
    expect(listModules(root)).toEqual([
      {
        name: 'adrian',
        path: join(root, 'src', 'adrian'),
        files: ['index.ts', 'money.ts', 'types.ts'],
      },
    ]);
  });
});

describe('parseArgs', () => {
  it('reads flags in long, short and inline forms', () => {
    expect(parseArgs(['--module', 'adrian', '-o', './lib', '--force'])).toEqual({
      help: false,
      list: false,
      force: true,
      module: 'adrian',
      output: './lib',
    });
    expect(parseArgs(['--module=adrian', '-l']).module).toBe('adrian');
  });

  it('ignores the -- separator that package managers forward', () => {
    expect(parseArgs(['--', '--list']).list).toBe(true);
  });

  it('rejects unknown flags and missing values', () => {
    expect(() => parseArgs(['--outptu', 'x'])).toThrow('Unknown option');
    expect(() => parseArgs(['--module'])).toThrow('needs a value');
    expect(() => parseArgs(['--module', '--force'])).toThrow('needs a value');
  });
});

describe('copyModule', () => {
  it('copies every source file into <output>/<module>', () => {
    const [module] = listModules(root);
    const out = join(root, 'project', 'src', 'lib');
    const written = copyModule(module, out);

    expect(written).toHaveLength(3);
    expect(readdirSync(join(out, 'adrian')).sort()).toEqual(['index.ts', 'money.ts', 'types.ts']);
    expect(readFileSync(join(out, 'adrian', 'money.ts'), 'utf-8')).toBe('// money.ts');
  });

  it('refuses to overwrite without force and writes nothing', () => {
    const [module] = listModules(root);
    const out = join(root, 'project');
    mkdirSync(join(out, 'adrian'), { recursive: true });
    writeFileSync(join(out, 'adrian', 'money.ts'), 'my edits');

    expect(() => copyModule(module, out)).toThrow('--force');
    expect(readdirSync(join(out, 'adrian'))).toEqual(['money.ts']);
    expect(readFileSync(join(out, 'adrian', 'money.ts'), 'utf-8')).toBe('my edits');

    copyModule(module, out, true);
    expect(readFileSync(join(out, 'adrian', 'money.ts'), 'utf-8')).toBe('// money.ts');
  });
});
