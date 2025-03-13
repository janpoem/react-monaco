import type { MonacoWorkerKey } from './types';

export const localePrefix = 'locale/';
export const workerPrefix = 'worker/';

export const editorWorkerKey: MonacoWorkerKey = 'worker/editor';

export const mimeTypes = {
  js: 'text/javascript; charset=utf-8',
  css: 'text/css',
  json: 'text/json',
};
