import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
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
  'react/jsx-runtime',
  'emittery',
  'just-compare',
  'usehooks-ts',
  '@emotion/styled',
  '@emotion/sheet',
  '@emotion/react',
  '@emotion/css',
  '@zenstone/ts-utils',
  '@zenstone/preset-provider',
  '@zenstone/use-remote-loader',
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
      json(),
      nodeResolve({
        browser: true,
      }),
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
