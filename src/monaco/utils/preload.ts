import { localePrefix, workerPrefix } from '../_constants';
import type { MonacoAsset, MonacoPreloadAsset } from '../types';

export const makePreloadAssets = (
  baseUrl: URL,
  monacoAssets: MonacoAsset[],
  locale?: string,
  isBlobWorker?: boolean,
): MonacoPreloadAsset[] => {
  const assets: MonacoPreloadAsset[] = [];

  for (const it of monacoAssets) {
    if (it == null || !it.url) continue;

    const url = new URL(it.url, baseUrl);
    const { key, labels } = it;
    let priority = it.priority ?? 0;
    let isRequired = priority < 0;

    if (key.startsWith(workerPrefix)) {
      if (isBlobWorker || url.origin !== location.origin) {
        isRequired = true;
      }
    } else if (key === `${localePrefix}${locale || ''}`) {
      isRequired = true;
      priority = -100;
    }

    if (isRequired) {
      assets.push({ key, url, priority, labels });
    }
  }

  if (assets.length) {
    return assets.sort(assetsOrder);
  }

  return assets;
};

export const assetsOrder = (a: MonacoPreloadAsset, b: MonacoPreloadAsset) =>
  a.priority - b.priority;
