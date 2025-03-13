import { DownloadQueue, DownloadTask } from '@zenstone/ts-utils/fetch-download';
import { type ReactNode, useCallback, useRef, useState } from 'react';
import { useTheLoader } from 'use-the-loader';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { PresetComponent } from '../presets';
import {
  type MonacoPreloadAsset,
  type MonacoPreloadProcess,
  MonacoPreloadState,
} from '../types';

type MaybeItOrCallback<T> = T | (() => T | Promise<T>);

export type AssetsLoaderProps<P = unknown> = {
  shouldPreload?: boolean;
  assets: MaybeItOrCallback<MonacoPreloadAsset[]>;
  isFetchDownload?: boolean;
  isCompressed?: boolean;
  withContainer?: boolean;
  onError?: (err: unknown) => void;
  onLoad?: (
    queue: DownloadQueue,
    assets: MonacoPreloadAsset[],
  ) => void | Promise<void>;
  defaultText?: ReactNode;
  children?: ReactNode;
} & P;

export const AssetsLoader = <P = unknown>({
  shouldPreload,
  assets: inputAssets,
  isFetchDownload,
  isCompressed,
  withContainer,
  onError,
  onLoad,
  defaultText,
  children,
}: AssetsLoaderProps<P>) => {
  const assetsRef = useRef<MonacoPreloadAsset[] | undefined>(undefined);
  const abortRef = useRef<AbortController | undefined>(undefined);

  const percentRef = useRef(0);
  const [_ticks, setTicks] = useState(0);

  const [process, setProcess] = useState<MonacoPreloadProcess | undefined>(
    undefined,
  );

  const handleError = (err: unknown) => {
    abortRef.current?.abort();
    onError?.(err);
  };

  const newQueue = useCallback(
    (assets: MonacoPreloadAsset[]) => {
      assetsRef.current = assets;
      abortRef.current = new AbortController();
      percentRef.current = 0;
      if (!assets.length) {
        setProcess(undefined);
        onLoad?.(new DownloadQueue([]), assets);
        return;
      }

      const queue = new DownloadQueue(
        assets.map((it) =>
          new DownloadTask({
            url: it.url,
            cache: 'force-cache',
            signal: abortRef.current?.signal,
          }).setCompressed(isCompressed),
        ),
      );
      setProcess({
        state: MonacoPreloadState.Download,
        assets,
        queue,
      });
    },
    [isCompressed, onLoad],
  );

  useIsomorphicLayoutEffect(() => {
    filterAssets(inputAssets).then((assets) => {
      newQueue(assets);
    });
  }, [inputAssets, newQueue]);

  useTheLoader({
    canLoad: shouldPreload && process != null,
    loader: () => {
      if (process == null) {
        throw new Error('Invalid preload state');
      }
      return process.queue.read({
        onQueueError: handleError,
        onError: handleError,
        onProgress: (queue) => {
          if (queue.percent > percentRef.current) {
            percentRef.current = queue.percent;
            setTicks((prev) => prev + 1);
          }
        },
      });
    },
    params: [],
    onError: handleError,
    onLoad: (q) => {
      setProcess((prev) =>
        prev == null ? prev : { ...prev, state: MonacoPreloadState.Prepare },
      );
      onLoad?.(q, assetsRef.current ?? []);
    },
  });

  if (shouldPreload) {
    return (
      <PresetComponent
        name={'Loader'}
        props={{
          process,
          percent: percentRef.current,
          isFetchDownload,
          withContainer,
          defaultText,
        }}
      />
    );
  }

  return <>{children}</>;

  async function filterAssets(assets: AssetsLoaderProps['assets']) {
    return typeof assets === 'function' ? await assets() : assets;
  }
};
