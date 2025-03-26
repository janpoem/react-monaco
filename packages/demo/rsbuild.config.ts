import { defineConfig } from '@rsbuild/core';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginReact } from '@rsbuild/plugin-react';
import pkg from './package.json';

export default defineConfig({
  tools: {
    rspack: {
      plugins: [
        // new rspack.CopyRspackPlugin({
        //   // patterns: [{ from: 'tm' }],
        // }),
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
