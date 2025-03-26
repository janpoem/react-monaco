import useRemoteLoader, {
  type RemoteAsset,
  type RemoteLoaderAssetsProps,
  type RemoteLoaderCallbacks,
  RemoteLoadProcess,
  type RemoteShouldPreloadParams,
  RemoteState,
} from '@zenstone/use-remote-loader';
import { type ReactNode, useCallback, useMemo, useRef } from 'react';
import { LoaderWrapper } from './components';
import { MonacoLoaderProcess, MonacoWorkerLabels } from './constants';
import type { MonacoPresetLoaderSharedProps } from './presets';
import type { EventEmitter, MonacoEventsDefinition } from './types';
import { isMainKey, isWorkerKey } from './utils';

export type MonacoLoaderProps<Query = object> = (Omit<
  RemoteLoaderAssetsProps<Query>,
  'key' | 'assets'
> &
  RemoteLoaderCallbacks<Query>) & {
  assets?: RemoteAsset[];
  isBlobWorker?: boolean;
  children?: ReactNode;
  emitter?: EventEmitter<MonacoEventsDefinition>;
} & MonacoPresetLoaderSharedProps;

export const MonacoLoader = <Query = object>({
  baseUrl: iBaseUrl,
  assets: iAssets,
  query,
  isFetchDownload = true,
  isCompressed = true,
  isBlobWorker,
  showText,
  progressBar,
  dir,
  width,
  withContainer,
  defaultText,
  children,
  emitter,
  className,
  style,
  shouldPreload: iShouldPreload,
  ...props
}: MonacoLoaderProps<Query>) => {
  const baseUrl = useMemo(() => {
    try {
      return new URL(iBaseUrl || '', location.origin);
    } catch (e) {
      return new URL(location.origin);
    }
  }, [iBaseUrl]);
  const assets = useMemo(() => mergeAssets(iAssets), [iAssets]);

  const shouldPreloadRef = useRef(iShouldPreload);
  shouldPreloadRef.current = iShouldPreload;

  const shouldPreload = useCallback(
    (params: RemoteShouldPreloadParams) => {
      const { asset } = params;
      const { key, url } = asset;
      if (isMainKey(key)) return true;
      if (isWorkerKey(key)) {
        const assetUrl = new URL(url, baseUrl);
        if (isBlobWorker || assetUrl.origin !== location.origin) {
          asset.blobUrl = true;
          return true;
        }
      }
      if (shouldPreloadRef.current) return shouldPreloadRef.current(params);
      return false;
    },
    [baseUrl, isBlobWorker],
  );

  const state = useRemoteLoader(
    {
      ...props,
      key: 'monaco',
      baseUrl,
      assets,
      query,
      isFetchDownload,
      isCompressed,
      shouldPreload,
    },
    { emitter },
  );

  const process = useMemo(() => {
    if (state.state === RemoteState.Pending) {
      return MonacoLoaderProcess.Initializing;
    }
    if (state.state === RemoteState.Loading) {
      if (state.process === RemoteLoadProcess.Prepare) {
        return MonacoLoaderProcess.Initializing;
      }
      if (state.process === RemoteLoadProcess.Loaded) {
        return MonacoLoaderProcess.Preparing;
      }
      return MonacoLoaderProcess.Loading;
    }
    return MonacoLoaderProcess.Completed;
  }, [state]);

  return (
    <LoaderWrapper
      {...{
        showText,
        progressBar,
        dir,
        width,
        withContainer,
        defaultText,
        className,
        style,
      }}
      process={process}
      percent={state.percent}
      isFetchDownload={isFetchDownload}
      state={state}
    >
      {children}
    </LoaderWrapper>
  );

  function mergeAssets(input?: RemoteAsset[]): RemoteAsset[] {
    // biome-ignore format: not formatter here
    const presets: RemoteAsset[] = [
      { key: 'main', url: 'editor.main.umd.js', priority: -50, type: 'js' },
      { key: 'worker/editor', url: 'editor.worker.umd.js', labels: MonacoWorkerLabels.editor },
      { key: 'worker/ts', url: 'ts.worker.umd.js', labels: MonacoWorkerLabels.ts, },
      { key: 'worker/html', url: 'html.worker.umd.js', labels: MonacoWorkerLabels.html },
      { key: 'worker/json', url: 'json.worker.umd.js', labels: MonacoWorkerLabels.json },
      { key: 'worker/css', url: 'css.worker.umd.js', labels: MonacoWorkerLabels.css },
    ];
    if (input?.length) {
      const add: RemoteAsset[] = [];
      for (const preset of presets) {
        const it = input.find((it) => it.key === preset.key);
        if (it != null) add.push(it);
        else Object.assign(preset, it);
      }
      return presets.concat(add);
    }
    return presets;
  }
};
