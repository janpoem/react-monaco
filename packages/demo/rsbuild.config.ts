import { defineConfig, rspack } from '@rsbuild/core';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginReact } from '@rsbuild/plugin-react';
import pkg from './package.json';

export default defineConfig({
  tools: {
    rspack: {
      plugins: [
        new rspack.CopyRspackPlugin({
          patterns: [{ from: '../assets/assets', to: 'assets' }],
        }),
      ],
    },
  },
  plugins: [pluginReact(), pluginNodePolyfill()],
  html: {
    title: '@react-monaco/core demo',
    template: './src/index.html',
  },
  output: {
    assetPrefix: `/react-monaco/${pkg.version}`,
  },
});
