import { defineConfig, rspack } from '@rsbuild/core';
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
  plugins: [pluginReact()],
  html: {
    title: '@react-monaco/core demo base on rsbuild',
    template: './src/index.html',
  },
  output: {
    assetPrefix: `/react-monaco/${pkg.version}`,
  },
});
