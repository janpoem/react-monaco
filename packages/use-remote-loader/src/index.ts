import { DownloadQueue, DownloadTask } from '@zenstone/ts-utils/fetch-download';
import {
  mountRemote,
  type MountRemoteResult,
  unmountRemote,
} from '@zenstone/ts-utils/remote';
import { notEmptyStr } from '@zenstone/ts-utils/string';
import { useRef, useState } from 'react';
import compare from './compare';
import { useInterval, useIsomorphicLayoutEffect } from './usehooks-ts';

type MaybePromise<T> = T | Promise<T>;

// biome-ignore lint/suspicious/noExplicitAny: 允许 any 用于类型推断
export type EmitterImpl<EventParams = Record<PropertyKey, any>> = {
  emit: <K extends keyof EventParams, P = EventParams[K]>(
    name: K,
    params: P,
  ) => MaybePromise<void>;
};

export type RemoteType = 'js' | 'css' | 'json' | 'wasm' | 'txt' | string;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type RemoteAsset = {
  key: string;
  url: string | URL;
  // default as js
  type?: RemoteType;
  baseUrl?: string | URL;
  priority?: number;
  blobUrl?: boolean;
  mimeType?: string;
  [key: string]: unknown;
};

/******************************************************************************
 * callback/event params
 ******************************************************************************/
export interface RemoteCommonParams<Query = object> {
  readonly props: RemoteLoaderAssetsProps<Query>;
}

export type RemotePrepareAssetsParams<Query = object> = {
  preloadAssets: RemoteAsset[];
} & RemoteCommonParams<Query>;

export type RemoteMakeIdParams = {
  asset: RemoteAsset;
  id: string;
};

export type RemoteShouldPreloadParams<Query = object> = {
  asset: RemoteAsset;
} & RemoteCommonParams<Query>;

export type RemoteShouldReloadParams<Query = object> = {
  asset: RemoteAsset;
} & RemoteCommonParams<Query>;

export type RemoteOnDownloadAssetParams<Query = object> = {
  preloadAssets: RemoteAsset[];
  queue: DownloadQueue;
  task: DownloadTask;
  asset: RemoteAsset;
} & RemoteCommonParams<Query>;

export type RemoteOnHandleAssetParams<Query = object> = {
  key: string;
  index: number;
  resultSet: RemoteResultSet;
  handle: () => void;
} & RemoteOnDownloadAssetParams<Query>;

export type RemotePreloadAssetsParams<Query = object> = {
  preloadAssets: RemoteAsset[];
  queue: DownloadQueue;
} & RemoteCommonParams<Query>;

export type RemoteWillMountAssetsParams<Query = object> = {
  resultSet: RemoteResultSet;
} & RemotePreloadAssetsParams<Query>;

export type RemoteOnMountAssetsParams<Query = object> = {
  resultSet: RemoteResultSet;
  mounted: MountRemoteResult[];
} & RemotePreloadAssetsParams<Query>;

export type RemoteOnLoadAssetsParams<Query = object> = {
  readonly props: RemoteLoaderAssetsProps<Query>;
  preloadAssets: RemoteAsset[] | null;
};

/******************************************************************************
 * RemoteResultSet
 ******************************************************************************/
export type RemoteResultSet = {
  mount: RemoteAsset[];
  wasm: Record<string, Uint8Array>;
  blobUrls: Record<string, string>;
  json: Record<string, unknown>;
  text: Record<string, string>;
  errors: Record<string, unknown>;
};

/******************************************************************************
 * props & callbacks
 ******************************************************************************/
export type RemoteLoaderAssetsProps<Query = object> = {
  key: string;
  baseUrl?: string | URL;
  assets: RemoteAsset[];
  query?: Partial<Query>;
  isFetchDownload?: boolean;
  isCompressed?: boolean;
};

export type RemoteLoaderCallbacks<Query = object> = {
  makeId?: (params: RemoteMakeIdParams) => string;
  onPrepare?: (params: RemotePrepareAssetsParams<Query>) => MaybePromise<void>;
  shouldPreload?: (params: RemoteShouldPreloadParams<Query>) => boolean;
  shouldReload?: (params: RemoteShouldReloadParams<Query>) => boolean;
  handlePreload?: (
    params: RemotePreloadAssetsParams<Query>,
  ) => MaybePromise<RemoteResultSet>;
  onDownloadAsset?: (
    params: RemoteOnDownloadAssetParams<Query>,
  ) => MaybePromise<void>;
  onPreload?: (params: RemotePreloadAssetsParams<Query>) => MaybePromise<void>;
  willMount?: (
    params: RemoteWillMountAssetsParams<Query>,
  ) => MaybePromise<void>;
  onMount?: (params: RemoteOnMountAssetsParams<Query>) => MaybePromise<void>;
  onUnmount?: () => void;
  onLoad?: (params: RemoteOnLoadAssetsParams<Query>) => MaybePromise<void>;
  onError?: (err: unknown) => void;
};

export type RemoteLoaderProps<Query = object> = RemoteLoaderAssetsProps<Query> &
  RemoteLoaderCallbacks<Query>;

/******************************************************************************
 * events
 ******************************************************************************/
type AssetWithKey = `asset:${string}`;

/**
 * RemoteLoader 事件定义
 *
 * 这里为了便于和其他的事件进行区分，所以事件名采用长一点的命名
 *
 * 特别注意，mount / load 事件进行了调整
 *
 * - mountAssets 仍处于 preload 的流程里，所以回调参数里取回 {@link DownloadQueue}，已挂载的内容，和结果集
 * - loadAssets 则已经脱离 preload 流程
 *
 * 所以需要根据实际情况，取决定取用哪个事件
 */
export type RemoteLoaderEventsDefinition<Query = object> = {
  prepareAssets: RemotePrepareAssetsParams<Query>;
  preloadAssets: RemotePreloadAssetsParams<Query>;
  willMountAssets: RemoteWillMountAssetsParams<Query>;
  mountAssets: RemoteOnMountAssetsParams<Query>;
  loadAssets: RemoteOnLoadAssetsParams<Query>;
  downloadAsset: RemoteOnDownloadAssetParams<Query>;
  asset: RemoteOnHandleAssetParams<Query>;
  [K: `asset:${string}`]: RemoteOnHandleAssetParams<Query>;
};

export type PreloadOptions<
  // biome-ignore lint/suspicious/noExplicitAny: 允许 any 用于类型推断
  EventParams extends RemoteLoaderEventsDefinition<any>,
> = {
  emitter?: EmitterImpl<EventParams>;
};

/******************************************************************************
 * internal state
 ******************************************************************************/
export enum RemoteState {
  Loading = 'loading',
  Pending = 'pending',
  Completed = 'completed',
}

export enum RemoteLoadProcess {
  Prepare = 'prepare',
  Preload = 'preload',
  Loaded = 'loaded',
}

export type RemoteCommonState = {
  key: string;
  error?: unknown;
  timestamp: number;
  percent: number;
};

export type RemotePreloadState<Query = object> = RemoteCommonState & {
  state: RemoteState.Loading | RemoteState.Completed;
  readonly props: RemoteLoaderAssetsProps<Query>;
  process: RemoteLoadProcess;
  preloadAssets: RemoteAsset[] | null;
};

export type RemotePendingState<Query = object> = RemoteCommonState & {
  state: RemoteState.Pending;
  readonly props: RemoteLoaderAssetsProps<Query>;
};

export type RemoteLoadState<Query = object> =
  | RemotePreloadState<Query>
  | RemotePendingState<Query>;

/******************************************************************************
 * Errors
 ******************************************************************************/
export type RemoteLoaderErrors = {
  RESP_CHUNKS_NULL: string;
  PRELOAD_ASSETS_NULL: string;
  TEXT_DECODE: string;
  JSON_PARSE: string;
  BLOB_URL: string;
};

const Errors: RemoteLoaderErrors = {
  RESP_CHUNKS_NULL: 'Response chunks null',
  PRELOAD_ASSETS_NULL: 'Preload assets null',
  TEXT_DECODE: 'Text decode error',
  JSON_PARSE: 'JSON parse error',
  BLOB_URL: 'Create blob url error',
};

export class AssetError extends Error {
  constructor(
    message: string,
    public readonly asset: RemoteAsset,
    public readonly error?: unknown,
  ) {
    super(message);
  }
}

/******************************************************************************
 * misc
 ******************************************************************************/
const loadedUrlMap = new Map<string, number>();

// biome-ignore lint/suspicious/noExplicitAny: any to 泛型
const loadingLoaderMap = new Map<string, RemoteLoaderAssetsProps<any>>();

export const mimeTypes: Record<string, string> = {
  js: 'text/javascript; charset=utf-8',
  css: 'text/css',
  json: 'text/json',
  wasm: 'application/wasm',
  default: 'text/plain',
};

const createState = <Query = object>(
  props: RemoteLoaderAssetsProps<Query>,
): RemoteLoadState<Query> => {
  Object.freeze(props);
  const { key } = props;
  const timestamp = Date.now();
  const percent = 0;
  if (!loadingLoaderMap.has(props.key)) {
    loadingLoaderMap.set(props.key, props);
    return {
      key,
      state: RemoteState.Loading,
      process: RemoteLoadProcess.Prepare,
      percent,
      preloadAssets: null,
      props,
      timestamp,
    };
  }
  return { key, state: RemoteState.Pending, percent: 0, props, timestamp };
};

const orderAssets = <T extends { priority?: number }>(a: T, b: T) =>
  (a.priority ?? 0) - (b.priority ?? 0);

const useRemoteLoader = <
  Query = object,
  EventParams extends
    RemoteLoaderEventsDefinition<Query> = RemoteLoaderEventsDefinition<Query>,
>(
  {
    key = '',
    baseUrl,
    query,
    assets,
    isCompressed = false,
    isFetchDownload = true,
    makeId,
    onPrepare,
    shouldPreload,
    shouldReload,
    handlePreload,
    onDownloadAsset,
    onPreload,
    willMount,
    onMount,
    onUnmount,
    onLoad,
    onError,
  }: RemoteLoaderProps<Query>,
  { emitter }: PreloadOptions<EventParams> = {},
) => {
  // key 不动态更新
  const keyRef = useRef(key);
  // biome-ignore format: no format here
  const props = {
    key: keyRef.current,
    baseUrl, query, assets, isCompressed, isFetchDownload,
  };

  const propsRef = useRef(props);
  const lastProcessRef = useRef<RemoteLoadProcess | null>(null);
  const [state, setState] = useState(() => createState(props));

  const mountedRef = useRef<string[]>([]);
  const abortRef = useRef<AbortController | undefined>(undefined);

  useIsomorphicLayoutEffect(() => {
    return () => {
      abortRef.current?.abort('RemoteLoader unmount');
      releaseLoading();
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!compare(propsRef.current, props)) {
      propsRef.current = props;
      // 只允许非 preload 的状态，去接受状态更改
      if (
        state.state !== RemoteState.Loading ||
        state.process !== RemoteLoadProcess.Preload
      ) {
        setState(createState(propsRef.current));
      }
    }
  }, [props, state]);

  useIsomorphicLayoutEffect(() => {
    if (state.state !== RemoteState.Loading) return;
    if (state.error != null) {
      lastProcessRef.current = null;
      releaseLoading();
      return;
    }
    next(state).then(updateState).catch(setError);
  }, [state]);

  useInterval(
    () => {
      if (!loadingLoaderMap.has(keyRef.current)) {
        setState(createState(propsRef.current));
      }
    },
    state.state === RemoteState.Pending ? 50 : null,
  );

  return state;

  function updateState<S extends RemoteLoadState<Query>>(data: Partial<S>) {
    if (Object.keys(data).length) {
      const timestamp = Date.now();
      setState((prev) => ({ ...prev, ...data, timestamp }));
    }
  }

  function setError(error?: unknown) {
    if (error != null) onError?.(error);
    updateState({ error });
  }

  function releaseLoading() {
    if (loadingLoaderMap.has(keyRef.current)) {
      loadingLoaderMap.delete(keyRef.current);
    }
  }

  function newUrl(url: string | URL, base?: string | URL) {
    if (url instanceof URL) return url;
    try {
      if (base != null) return new URL(url, base);
      return new URL(url);
    } catch (err) {
      return url;
    }
  }

  function newRemoteId(asset: RemoteAsset) {
    const id = `${keyRef.current || 'remote'}_${asset.key}_${Date.now()}`;
    if (makeId) return makeId({ asset, id });
    return id;
  }

  function canNext(process: RemoteLoadProcess) {
    const prevStates = {
      [RemoteLoadProcess.Prepare]: null,
      [RemoteLoadProcess.Preload]: RemoteLoadProcess.Prepare,
      [RemoteLoadProcess.Loaded]: RemoteLoadProcess.Preload,
    };
    return lastProcessRef.current === prevStates?.[process];
  }

  async function next(
    state: RemotePreloadState<Query>,
  ): Promise<Partial<RemotePreloadState<Query>>> {
    const methods = {
      [RemoteLoadProcess.Prepare]: prepare,
      [RemoteLoadProcess.Preload]: preload,
      [RemoteLoadProcess.Loaded]: complete,
    };
    if (canNext(state.process)) {
      lastProcessRef.current = state.process;
      return methods[state.process]?.(state);
    }
    return {};
  }

  async function prepare({
    props,
  }: RemotePreloadState<Query>): Promise<Partial<RemotePreloadState<Query>>> {
    const preloadAssets: RemoteAsset[] = [];
    const params = { props, preloadAssets };

    for (const origAsset of props.assets) {
      const url = newUrl(origAsset.url, origAsset.baseUrl || props.baseUrl);
      const asset = { ...origAsset, url };
      if (loadedUrlMap.has(url.toString())) {
        if (!shouldReload?.({ props, asset })) {
          continue;
        }
      }
      if (shouldPreload && !shouldPreload({ props, asset })) {
        continue;
      }
      preloadAssets.push(asset);
    }

    if (preloadAssets.length) preloadAssets.sort(orderAssets);

    await onPrepare?.(params);
    await emitter?.emit('prepareAssets', params);

    return { process: RemoteLoadProcess.Preload, preloadAssets };
  }

  async function preload(
    state: RemotePreloadState<Query>,
  ): Promise<Partial<RemotePreloadState<Query>>> {
    const { preloadAssets } = state;
    const process = RemoteLoadProcess.Loaded;

    if (preloadAssets == null) {
      throw new Error(Errors.PRELOAD_ASSETS_NULL);
    }
    if (!preloadAssets.length) {
      // 资产为空，直接跳去完成
      return { process, percent: 100 };
    }

    let percent = 0;
    abortRef.current = new AbortController();
    const queue = new DownloadQueue(
      preloadAssets.map((it) =>
        new DownloadTask({
          url: it.url,
          cache: 'force-cache',
          signal: abortRef.current?.signal,
        }).setCompressed(isCompressed),
      ),
    );
    await queue.read({
      onQueueError: setError,
      onError: setError,
      onProgress: (queue) => {
        if (queue.percent > percent) {
          percent = queue.percent;
          updateState({ percent });
        }
      },
      onComplete: async (queue, task) => {
        const index = queue.tasks.findIndex((it) => it.id === task.id);
        const asset = preloadAssets[index];
        if (asset != null) {
          loadAsset(task, asset);
          const _params = { props, preloadAssets, queue, task, asset };
          await onDownloadAsset?.(_params);
          await emitter?.emit('downloadAsset', _params);
        }
      },
    });
    abortRef.current = undefined;

    const params = { props, preloadAssets, queue };
    await onPreload?.(params);
    await emitter?.emit('preloadAssets', params);

    const resultSet = await (handlePreload ?? internalHandlePreload)({
      props,
      queue,
      preloadAssets,
    });

    await willMount?.({ ...params, resultSet });
    await emitter?.emit('willMountAssets', { ...params, resultSet });

    let mounted: MountRemoteResult[] = [];
    if (resultSet.mount.length) {
      if (mountedRef.current.length) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        mountedRef.current.forEach((id) => unmountRemote(id, onUnmount));
      }
      mounted = await Promise.all(
        resultSet.mount.map((it) =>
          mountRemote({
            id: newRemoteId(it),
            url: it.url.toString(),
            type: it.type ?? 'js',
          }),
        ),
      );
      mountedRef.current = mounted.map((it) => it.id);
    }

    await onMount?.({ ...params, resultSet, mounted });
    await emitter?.emit?.('mountAssets', { ...params, resultSet, mounted });

    return { process };
  }

  async function complete(
    state: RemotePreloadState<Query>,
  ): Promise<Partial<RemotePreloadState<Query>>> {
    const { props, preloadAssets } = state;
    lastProcessRef.current = null;
    if (!compare(propsRef.current, props)) {
      return {
        state: RemoteState.Loading,
        process: RemoteLoadProcess.Prepare,
        percent: 0,
        preloadAssets: null,
        props: propsRef.current,
      };
    }
    await onLoad?.({ props, preloadAssets });
    await emitter?.emit?.('loadAssets', { props, preloadAssets });
    releaseLoading();
    return { state: RemoteState.Completed, percent: 100 };
  }

  function loadAsset(_task: DownloadTask, asset: RemoteAsset) {
    if (asset == null) return;
    loadedUrlMap.set(asset.url.toString(), Date.now());
  }

  function inferAssetType(asset: RemoteAsset): RemoteType {
    if (notEmptyStr(asset.type)) return asset.type;
    // 后续待补充根据 url 后缀名来推断类型
    return 'js';
  }

  async function internalHandlePreload({
    props,
    queue,
    preloadAssets,
  }: RemotePreloadAssetsParams<Query>): Promise<RemoteResultSet> {
    const mount: RemoteAsset[] = [];
    const wasm: Record<string, Uint8Array> = {};
    const blobUrls: Record<string, string> = {};
    const json: Record<string, unknown> = {};
    const text: Record<string, string> = {};
    const errors: Record<string, unknown> = {};
    const resultSet = { mount, wasm, blobUrls, json, text, errors };

    for await (const [index, asset] of preloadAssets.entries()) {
      const type = inferAssetType(asset);
      const { key, mimeType } = asset;
      const task = queue.tasks[index];

      if (task == null || task.chunks == null) {
        errors[key] = new AssetError(Errors.RESP_CHUNKS_NULL, asset);
        continue;
      }

      if (emitter != null) {
        let isHandle = false;
        // biome-ignore format: not formatter here
        const params: RemoteOnHandleAssetParams<Query> = {
          props, preloadAssets, queue,
          key, index, asset, task, resultSet,
          handle: () => { isHandle = true }
        };
        await emitter.emit('asset', params);
        if (!isHandle) await emitter.emit(`asset:${key}`, params);
        if (isHandle) continue;
      }

      // blob 优先处理
      if (asset.blobUrl) {
        try {
          const mime = mimeType || (mimeTypes[type] ?? mimeTypes.default);
          const blob = new Blob([task.chunks], { type: mime });
          blobUrls[asset.key] = URL.createObjectURL(blob);
        } catch (err) {
          errors[key] = new AssetError(Errors.BLOB_URL, asset, err);
        }
        continue;
      }

      if (type === 'js' || type === 'css') {
        mount.push(asset);
        continue;
      }

      if (type === 'wasm') {
        wasm[asset.key] = task.chunks;
        continue;
      }

      // 文本类型处理
      try {
        const rawText = new TextDecoder().decode(task.chunks);
        if (type === 'json') {
          try {
            json[key] = JSON.parse(rawText);
          } catch (jsonErr) {
            errors[key] = new AssetError(Errors.JSON_PARSE, asset, jsonErr);
          }
        } else {
          text[key] = rawText;
        }
      } catch (err) {
        errors[key] = new AssetError(Errors.TEXT_DECODE, asset, err);
      }
    }

    return resultSet;
  }
};

export const setRemoteLoaderErrors = (errors: RemoteLoaderErrors) => {
  Object.assign(Errors, errors);
};

export type UseRemoteLoaderHook<
  Query = object,
  EventParams extends
    RemoteLoaderEventsDefinition<Query> = RemoteLoaderEventsDefinition<Query>,
> = ReturnType<typeof useRemoteLoader<Query, EventParams>>;

export default useRemoteLoader;
