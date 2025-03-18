import type { MonacoAssetWorkerKey } from './types';

export const localeDefault = 'en';

export const assetDefaultPriority = 0;
export const assetLocalePriority = -1000;

export const localePrefix = 'locale/';
export const workerPrefix = 'worker/';

export const editorWorkerKey: MonacoAssetWorkerKey = 'worker/editor';

export const mimeTypes = {
  js: 'text/javascript; charset=utf-8',
  css: 'text/css',
  json: 'text/json',
  wasm: 'application/wasm',
  default: 'application/octet-stream',
};

export const workerLabels = {
  editor: [],
  ts: ['typescript', 'javascript'],
  html: ['html', 'handlebars', 'razor'],
  json: ['json'],
  css: ['css', 'scss', 'less'],
};
