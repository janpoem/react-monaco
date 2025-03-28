import { isStr } from '@zenstone/ts-utils';
import type { RemoteAsset } from '@zenstone/use-remote-loader';

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

export const isMainKey = prefixCheck('main', true);

export const isWorkerAsset = (
  asset: RemoteAsset,
): asset is RemoteAsset & { labels: string[] } =>
  isWorkerKey(asset.key) && asset.labels != null && Array.isArray(asset.labels);
