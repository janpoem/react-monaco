import { db } from './db';
import {
  mimeTypes,
  type MonacoPreloadAsset,
  type MonacoProviderProps,
} from './monaco';

const labels = {
  editor: [],
  ts: ['typescript', 'javascript'],
  html: ['html', 'handlebars', 'razor'],
  json: ['json'],
  css: ['css', 'scss', 'less'],
};

export const createMonacoProviderProps = (
  version = '0.52.2',
): MonacoProviderProps => {
  let queryKeys: [string, string][] = [];
  let requiredAssets: MonacoPreloadAsset[] = [];

  return {
    baseUrl: `https://static.kephp.com/libs/monaco-editor/${version}/`,
    // baseUrl: `http://localhost:8787/libs/monaco-editor/${version}/`,
    // baseUrl: `http://localhost:3002/${version}/`,
    // baseUrl: 'http://localhost:3000/monaco-editor',
    // locale: 'zh-cn',
    isFetchDownload: true,
    isCompressed: true,
    isBlobWorker: true,
    handlePrepareAssets: async ({ preloadAssets }) => {
      requiredAssets = preloadAssets;
      queryKeys = preloadAssets.map((it) => [it.key, version]);
      const keys = (
        await db.sources
          .where('[key+version]')
          .anyOf(...queryKeys)
          .toArray()
      ).map((it) => it.key);
      return preloadAssets.filter((it) => !keys.includes(it.key));
    },
    onPreload: async ({ queue, preloadAssets }) => {
      const tasks = queue.tasks;
      const size = tasks.length;
      try {
        await db.transaction('rw', db.sources, async () => {
          for (let i = 0; i < size; i++) {
            const task = tasks[i];
            const asset = preloadAssets[i];
            const { key, url, priority } = asset;
            if (task.chunks == null) continue;
            const query = { key, version };
            const data = {
              ...query,
              priority,
              url: url.toString(),
              source: task.chunks,
              updatedAt: new Date(),
            };
            const it = await db.sources.get(query);
            if (it == null) {
              await db.sources.add(data);
            } else {
              await db.sources.update(it.id, data);
            }
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
    handlePrepareMountAssets: async ({ remotes, workers }) => {
      const caches = await db.sources
        .where('[key+version]')
        .anyOf(...queryKeys)
        .toArray();

      for (const cache of caches) {
        const blob = new Blob([cache.source], { type: mimeTypes.js });
        const blobUrl = URL.createObjectURL(blob);
        const asset = requiredAssets.find((it) => it.key === cache.key);
        if (asset == null) continue;
        const { key } = asset;
        if (key.startsWith('worker/')) {
          workers.push({ ...asset, url: new URL(blobUrl), blobUrl });
        } else {
          remotes.push({
            url: blobUrl,
            id: `Custom_${asset.key}`,
            type: 'js',
          });
        }
      }

      queryKeys = [];
      requiredAssets = [];
      return [remotes, workers];
    },
    // biome-ignore format: not formatter here
    assets: [
      { key: 'main', url: 'editor.main.umd.js', priority: -50 },
      { key: 'worker/editor', url: 'editor.worker.umd.js', labels: labels.editor },
      { key: 'worker/ts', url: 'ts.worker.umd.js', labels: labels.ts, },
      { key: 'worker/html', url: 'html.worker.umd.js', labels: labels.html },
      { key: 'worker/json', url: 'json.worker.umd.js', labels: labels.json },
      { key: 'worker/css', url: 'css.worker.umd.js', labels: labels.css },
      { key: 'locale/zh-cn', url: '../locale/zh-cn.js' },
    ],
  };
};

export const fontMonospace = '"JetBrains Mono", "Roboto Mono", monospace';

export const monacoCodeEditorOptions = {
  lineHeight: 1.5,
  tabSize: 2,
  fontSize: 14,
  fontFamily: fontMonospace,
  fontLigatures: 'no-common-ligatures, slashed-zero',
  minimap: { enabled: false },
};
