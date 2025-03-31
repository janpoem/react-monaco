import { defineConfig, rspack } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  tools: {
    rspack: {
      plugins:
        process.env.NODE_ENV === 'production'
          ? []
          : [
              new rspack.CopyRspackPlugin({
                patterns: [{ from: '../assets/assets', to: 'assets' }],
              }),
            ],
    },
  },
  plugins: [pluginReact()],
  html: {
    title: '@react-monaco/core demo development on rsbuild',
    template: './src/index.html',
  },
  source:
    process.env.NODE_ENV === 'production'
      ? {
          entry: {
            main: './src/index.tsx',
          },
        }
      : undefined,
  output: {
    cleanDistPath: true,
    distPath: {
      root: 'dist',
      js: 'js',
      css: 'css',
    },
    filename: {
      js: '[name].js',
      css: '[name].css',
    },
    assetPrefix: '/react-monaco-demo',
  },
  performance: {
    chunkSplit: {
      strategy: 'custom',
      splitChunks: {
        cacheGroups: {
          modules: {
            test: /node_modules[\\/]/,
            name: 'modules',
            chunks: 'all',
            priority: -10,
          },
        },
      },
    },
  },
});
