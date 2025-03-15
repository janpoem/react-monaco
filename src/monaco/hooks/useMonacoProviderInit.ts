import type { DownloadQueue } from '@zenstone/ts-utils/fetch-download';
import {
  mountRemote,
  type MountRemoteOptions,
} from '@zenstone/ts-utils/remote';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import {
  editorWorkerKey,
  localePrefix,
  mimeTypes,
  workerPrefix,
} from '../_constants';
import {
  type MonacoPreloadAsset,
  type MonacoProviderProps,
  MonacoReadyState,
} from '../types';
import { globalMonacoThrow, initMonacoEnvironment } from '../utils';

export const useMonacoProviderInit = ({
  baseUrl: iBaseUrl,
  locale: iLocale,
  assets,
  isFetchDownload,
  isCompressed,
  isBlobWorker,
  handlePrepareAssets,
  onPreload,
  handlePrepareMountAssets,
  onMounting,
}: MonacoProviderProps) => {
  const localeRef = useRef(iLocale);

  const baseUrl = useMemo(() => {
    try {
      return new URL(iBaseUrl || '', location.origin);
    } catch (e) {
      return new URL(location.origin);
    }
  }, [iBaseUrl]);

  const [error, setError] = useState<unknown>();
  const [readyState, setReadyState] = useState(MonacoReadyState.Init);
  const [assetsIds, setAssetsIds] = useState<string[]>([]);

  const [preloadAssets, setPreloadAssets] = useState<
    MonacoPreloadAsset[] | undefined
  >(undefined);

  const prepareAssets = useCallback(
    async (locale?: string) => {
      let _assets: MonacoPreloadAsset[] = [];

      for (const it of assets) {
        if (it == null || !it.url) continue;

        const url = new URL(it.url, baseUrl);
        const { key, labels } = it;
        let priority = it.priority ?? 0;
        let isRequired = priority < 0;

        if (key.startsWith(workerPrefix)) {
          if (isBlobWorker || url.origin !== location.origin) {
            isRequired = true;
          }
        } else if (key === `${localePrefix}${locale}`) {
          isRequired = true;
          priority = -100;
        }

        if (isRequired) {
          _assets.push({ key, url, priority, labels });
        }
      }

      if (_assets.length) {
        _assets = _assets.sort(orderAssets);
      }

      if (handlePrepareAssets != null) {
        return handlePrepareAssets({
          locale,
          assets,
          preloadAssets: _assets,
          isBlobWorker,
        });
      }

      return _assets;
    },
    [baseUrl, assets, isBlobWorker, handlePrepareAssets],
  );

  const handlePreload = useCallback(
    async (queue: DownloadQueue, preloadAssets: MonacoPreloadAsset[]) => {
      let remotes: MountRemoteOptions<unknown>[] = [];
      let workers: MonacoPreloadAsset[] = [];
      try {
        if (preloadAssets.length) {
          await onPreload?.({ queue, preloadAssets });
        }

        [remotes, workers] = prepareMountAssets(
          queue,
          preloadAssets,
          isBlobWorker,
        );

        if (handlePrepareMountAssets != null) {
          [remotes, workers] = await handlePrepareMountAssets({
            queue,
            preloadAssets,
            remotes,
            workers,
          });
        }

        if (workers.length) {
          initMonacoEnvironment(workers, iLocale);
        }
        if (remotes.length) {
          setAssetsIds(
            (await Promise.all(remotes.map((it) => mountRemote(it)))).map(
              (it) => it.id,
            ),
          );
        }
        const $monaco = globalMonacoThrow();
        setReadyState(MonacoReadyState.Mounting);
        await onMounting?.($monaco);
      } catch (err) {
        setError(err);
      }
    },
    [iLocale, isBlobWorker, onPreload, handlePrepareMountAssets, onMounting],
  );

  useIsomorphicLayoutEffect(() => {
    if (localeRef.current !== iLocale) {
      // 修改多语言环境，只允许在 Mounted 环境修改进行响应
      if (readyState !== MonacoReadyState.Mounted) return;
      localeRef.current = iLocale;
    } else {
      if (readyState !== MonacoReadyState.Init) return;
    }
    prepareAssets(iLocale)
      .then((res) => {
        setPreloadAssets(res);
        setReadyState(MonacoReadyState.Init);
      })
      .catch(setError);
  }, [iLocale, readyState, prepareAssets]);

  return {
    // props
    baseUrl,
    locale: iLocale,
    assets,
    isFetchDownload,
    isCompressed,
    isBlobWorker,
    // states
    error,
    setError,
    readyState,
    setReadyState,
    assetsIds,
    setAssetsIds,
    preloadAssets,
    setPreloadAssets,
    // complex vars
    inMonaco: true,
    shouldPreload: readyState === MonacoReadyState.Init,
    // apis
    prepareAssets,
    handlePreload,
  };

  function prepareMountAssets(
    queue: DownloadQueue,
    preloadAssets: MonacoPreloadAsset[],
    isBlobWorker?: boolean,
  ): [MountRemoteOptions<unknown>[], MonacoPreloadAsset[]] {
    const { origin } = location;
    const tasks = queue.tasks;

    const remotes: MountRemoteOptions<unknown>[] = [];
    let workers: MonacoPreloadAsset[] = [];

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const asset = preloadAssets[i];

      if (asset.key.startsWith(workerPrefix)) {
        if (task.chunks == null) continue;

        const it = { ...asset };
        const shouldBlob =
          // force to use blob worker
          isBlobWorker ||
          // when the server response content-type were missing
          task.mimeType === null ||
          // not the same origin
          asset.url.origin !== origin;

        if (shouldBlob) {
          const blob = new Blob([task.chunks], { type: mimeTypes.js });
          it.blobUrl = URL.createObjectURL(blob);
        }

        if (asset.key === editorWorkerKey) {
          // make sure editor/worker be the first one
          workers = [it].concat(workers);
        } else {
          workers.push(it);
        }
      } else {
        remotes.push({
          url: asset.url.toString(),
          id: `MonacoEditor_${asset.key}`,
          type: 'js',
        });
      }
    }
    return [remotes, workers];
  }
};

const orderAssets = <T extends { priority?: number }>(a: T, b: T) =>
  (a.priority ?? 0) - (b.priority ?? 0);
