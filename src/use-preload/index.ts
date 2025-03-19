import { useState } from 'react';
import { compare } from 'use-the-loader';
import { useInterval, useIsomorphicLayoutEffect } from 'usehooks-ts';

export type PreloadAssetType = 'js' | 'css' | 'json' | 'wasm' | string;

export type PreloadAsset = {
  key: string;
  url: string | URL;
  // default as js
  type?: PreloadAssetType;
  baseUrl?: string | URL;
  priority?: number;
  blobUrl?: string;
  [key: string]: unknown;
};

export type PreloadBasicQuery = {
  [key: PropertyKey]: unknown;
};

export type PreloadProps<Query = object> = {
  baseUrl?: string | URL;
  assets: PreloadAsset[];
  query?: Query;
  isFetchDownload?: boolean;
  isCompressed?: boolean;
  isBlobWorker?: boolean;
  shouldPreload: (asset: PreloadAsset, props: PreloadProps<Query>) => boolean;
};

export enum PreloadProcess {
  Preload = 0,
  Waiting = 1,
  Pending = 2,
  Complete = 3,
}

export type PreloadState<Query = object> = {
  process: PreloadProcess;
  props: PreloadProps<Query>;
};

export type PreloadEventsParams = {
  //
};

const loaded = new Map<string, number>();

// biome-ignore lint/suspicious/noExplicitAny: any to 泛型
let preloadRef: WeakRef<PreloadProps<any>> | null = null;

const createState = <Query = object>(
  props: PreloadProps<Query>,
): PreloadState<Query> => {
  let process = PreloadProcess.Waiting;
  if (preloadRef === null) {
    preloadRef = new WeakRef(props);
    process = PreloadProcess.Preload;
  } else if (!compare(preloadRef.deref(), props)) {
    process = PreloadProcess.Pending;
  }
  return { process, props };
};

const usePreload = <Query = object>({
  baseUrl,
  query,
  assets,
  isBlobWorker = false,
  isCompressed = false,
  isFetchDownload = false,
  shouldPreload,
}: PreloadProps<Query>) => {
  const inputProps = {
    baseUrl,
    query,
    assets,
    isBlobWorker,
    isCompressed,
    isFetchDownload,
    shouldPreload,
  };
  const [state, setState] = useState(() => createState(inputProps));

  useIsomorphicLayoutEffect(() => {
    if (!compare(state.props, inputProps)) {
      setState(createState(inputProps));
    }
  }, [inputProps, state.props]);

  useIsomorphicLayoutEffect(() => {
    if (state.process === PreloadProcess.Preload) {
      prepareAssets(state.props).then((res) => {
        // biome-ignore lint/complexity/noForEach: <explanation>
        res.forEach((it) => {
          loaded.set(it.url.toString(), Date.now());
        });
        preloadRef = null;
      });
    }
  }, [state]);

  useInterval(
    () => {
      if (preloadRef === null) {
        setState(createState(inputProps));
      }
    },
    state.process === PreloadProcess.Preload ? null : 50,
  );

  return {};

  function newUrl(url: string | URL, baseUrl?: string | URL) {
    if (url instanceof URL) return url;
    if (baseUrl != null) return new URL(url, baseUrl);
    return url;
  }

  async function prepareAssets(props: PreloadProps<Query>) {
    const preloadAssets: PreloadAsset[] = [];
    const { baseUrl, assets, shouldPreload } = props;
    for (const asset of assets) {
      const url = newUrl(asset.url, asset.baseUrl || baseUrl);
      const newAsset = { ...asset, url };
      if (loaded.has(url.toString())) continue;
      if (!shouldPreload(newAsset, props)) continue;
      preloadAssets.push(newAsset);
    }
    return preloadAssets;
  }
};

export type UsePreloadHook<Query = object> = ReturnType<
  typeof usePreload<Query>
>;

export default usePreload;
