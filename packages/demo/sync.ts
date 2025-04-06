import { storeGithub } from '@semver-sync/store-github';
import type { ChangedFile } from '@semver-sync/sync';
import {
  type ChangedRecord,
  hashFile,
  loadJsonObj,
  sync,
} from '@semver-sync/sync';
import { lstatSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

type ManifestFile = {
  key: string;
  type: string;
  url: string;
  hash: string;
  priority: number;
};

type ManifestData = {
  assets: ManifestFile[];
  updatedAt: number;
};

const defaultManifest = (): ManifestData => ({
  assets: [],
  updatedAt: 0,
});

export const initManifest = (files: ChangedRecord) => {
  const relativePath = 'manifest.json';
  const path = resolve(process.cwd(), `logs/${relativePath}`);
  const data = loadJsonObj(path, defaultManifest()) || defaultManifest();

  let count = 0;
  for (const [, it] of Object.entries(files)) {
    const index = data.assets.findIndex((rec) => rec.key === it.key);
    const file = {
      key: it.key,
      type: it.type,
      url: it.verPath,
      hash: it.hash,
      priority: it.basename === 'js/modules' ? -100 : 0,
    };
    if (index < 0) {
      data.assets.push(file);
    } else {
      data.assets[index] = file;
    }
    count += 1;
  }

  if (count <= 0) {
    return;
  }
  data.assets = data.assets.sort((a, b) => a.priority - b.priority);
  data.updatedAt = Date.now();

  const text = JSON.stringify(data, null, 2);
  writeFileSync(path, text);

  const stats = lstatSync(path);

  const mock: ChangedFile = {
    key: relativePath,
    basename: basename(relativePath, '.json'),
    path,
    relativePath,
    // @ts-ignore
    hash: hashFile(path),
    size: '',
    filesize: stats.size,
    ver: '',
    verPath: relativePath,
    mtime: stats.mtime,
    type: 'json',
  };

  files[relativePath] = mock;
};

sync({
  cwd: process.cwd(),
  entry: 'dist',
  logFile: 'logs/sync.json',
  ext: '{js,css}',
  store: storeGithub({
    key: 'static.kephp',
    path: 'react-monaco-demo',
    onError: console.error,
  }),
  confirm: true,
  onChangeFiles: (files) => initManifest(files),
}).catch(console.error);
