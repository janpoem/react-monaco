import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: '@zenstone/react-monaco-rspack demo',
  },
  output: {
    assetPrefix: '/react-monaco',
  },
});
