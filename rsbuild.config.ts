import { defineConfig } from '@rsbuild/core';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginReact } from '@rsbuild/plugin-react';

import pkg from './package.json';

export default defineConfig({
  plugins: [pluginReact(), pluginNodePolyfill()],
  html: {
    title: '@zenstone/react-monaco-rspack demo',
    template: './src/index.html',
  },
  output: {
    assetPrefix: `/react-monaco/${pkg.version}`,
  },
});
