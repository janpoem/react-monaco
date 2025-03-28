import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { existsSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { dts } from 'rollup-plugin-dts';
import swc from 'rollup-plugin-swc3';

const inWatchMode = process.argv.includes('--watch');
const outputDir = resolve(process.cwd(), './dist');
// const srcDir = resolve(process.cwd(), 'src');

const rmdir = (dir: string, enable = true) => {
  return {
    buildStart() {
      if (enable && dir) {
        existsSync(outputDir) &&
          statSync(outputDir).isDirectory() &&
          rmSync(outputDir, { recursive: true });
      }
    },
  };
};

const external = [
  'react',
  'just-compare',
  '@zenstone/ts-utils',
  '@zenstone/ts-utils/fetch-download',
  '@zenstone/ts-utils/remote',
];
const dtsExternal = external;
const entry = 'src/index.ts';

const fmtCurry = (dir: string, jsExt: string, dtsExt: string) => ({
  js: (path: string) => join(outputDir, dir, `${path}${jsExt}`),
  dts: (path: string) => join(outputDir, dir, `${path}${dtsExt}`),
});

const esm = fmtCurry('esm', '.js', '.d.ts');
const cjs = fmtCurry('cjs', '.cjs', '.d.cts');

export default [
  {
    input: entry,
    output: [
      {
        file: cjs.js('index'),
        format: 'cjs',
      },
      {
        file: esm.js('index'),
        format: 'es',
        exports: 'named',
      },
    ],
    plugins: [
      rmdir(outputDir, !inWatchMode),
      swc({
        include: /\.[mc]?[jt]sx?$/,
        exclude: /node_modules/,
        tsconfig: 'tsconfig.json',
        jsc: {
          target: 'es2022',
        },
      }),
      nodeResolve({}),
      commonjs({
        extensions: ['.node', '.cjs', '.js', '.mjs'],
      }),
    ],
    external,
  },
  {
    input: entry,
    output: [
      {
        file: cjs.dts('index'),
        format: 'es',
      },
      {
        file: esm.dts('index'),
        format: 'es',
      },
    ],
    plugins: [dts()],
    external: dtsExternal,
  },
];
