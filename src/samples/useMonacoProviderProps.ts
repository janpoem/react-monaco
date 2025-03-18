import { useMemo } from 'react';
import { type MonacoProviderProps, workerLabels } from '../monaco';

export type CreateMonacoProviderPropsOptions = {
  version?: string;
  baseUrl?: string;
};

export const createMonacoProviderProps = ({
  version = '0.52.2',
  baseUrl = 'https://static.summererp.com/misc',
}: CreateMonacoProviderPropsOptions = {}): MonacoProviderProps => {
  return {
    baseUrl: `${baseUrl}/monaco-editor/${version}/`,
    // locale: 'zh-cn',
    isFetchDownload: true,
    isCompressed: true,
    isBlobWorker: true,
    // biome-ignore format: not formatter here
    assets: [
      { key: 'main', url: 'editor.main.umd.js', priority: -50 },
      { key: 'worker/editor', url: 'editor.worker.umd.js', labels: workerLabels.editor },
      { key: 'worker/ts', url: 'ts.worker.umd.js', labels: workerLabels.ts, },
      { key: 'worker/html', url: 'html.worker.umd.js', labels: workerLabels.html },
      { key: 'worker/json', url: 'json.worker.umd.js', labels: workerLabels.json },
      { key: 'worker/css', url: 'css.worker.umd.js', labels: workerLabels.css },
      { key: 'locale/zh-cn', url: '../locale/zh-cn.js' },
    ],
  };
};

export const useMonacoProviderProps = (
  props?: CreateMonacoProviderPropsOptions,
) => useMemo(() => createMonacoProviderProps(props), [props]);
