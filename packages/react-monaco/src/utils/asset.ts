import { isStr } from '@zenstone/ts-utils/string';
import type { RemoteAsset } from '@zenstone/use-remote-loader';
import type { MonacoWorkerAsset } from '../types';

const prefixCheck =
  (prefix: string, allowEquals?: boolean) =>
  (key: string, value?: string | null) => {
    if (isStr(value)) {
      return key === `${prefix}/${value}`;
    }
    if (allowEquals && key === prefix) {
      return true;
    }
    return key.startsWith(`${prefix}/`);
  };

export const isWorkerKey = prefixCheck('worker');

export const isLocalKey = prefixCheck('locale');

export const isJsonKey = prefixCheck('json');

export const isCssKey = prefixCheck('css', true);

export const isMainKey = prefixCheck('main', true);

export const convertKeyToId = (key: string) => key.replace(/\/+/gm, '_');

export const isWorkerAsset = (
  asset: RemoteAsset,
): asset is RemoteAsset & { labels: string[] } =>
  isWorkerKey(asset.key) && asset.labels != null && Array.isArray(asset.labels);
