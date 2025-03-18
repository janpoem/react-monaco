import type { DownloadQueue } from '@zenstone/ts-utils/fetch-download';
import { isInferObj } from '@zenstone/ts-utils/object';
import { mountRemote } from '@zenstone/ts-utils/remote';
import Emittery from 'emittery';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useEventCallback, useIsomorphicLayoutEffect } from 'usehooks-ts';
import { usePresetProviderInit } from '../../preset-provider';
import {
  assetDefaultPriority,
  assetLocalePriority,
  localeDefault,
  mimeTypes,
} from '../_constants';
import { MonacoRegistry } from '../MonacoRegistry';
import { initComponents, initTexts } from '../presets';
import {
  type DefaultRegistryData,
  type MonacoEventsParams,
  type MonacoInputEvents,
  type MonacoPreloadAsset,
  type MonacoPrepareMountAssets,
  type MonacoPrepareMountAssetsParams,
  type MonacoPresetComponents,
  MonacoPresetError,
  type MonacoPresetTexts,
  type MonacoProviderProps,
  MonacoReadyState,
} from '../types';
import {
  convertKeyToId,
  isCssKey,
  isJsonKey,
  isLocalKey,
  isMainKey,
  isWorkerKey,
} from '../utils';

export const useMonacoProviderInit = <
  C extends MonacoPresetComponents = MonacoPresetComponents,
  T extends MonacoPresetTexts = MonacoPresetTexts,
>({
  baseUrl: iBaseUrl,
  locale,
  assets,
  isFetchDownload,
  isCompressed,
  isBlobWorker,
  onMounting,
  registry,
  events,
  components,
  texts,
}: MonacoProviderProps<C, T>) => {
  const preset = usePresetProviderInit<
    MonacoPresetComponents,
    MonacoPresetTexts
  >({
    initComponents,
    initTexts,
    components,
    texts,
  });
  const { getText } = preset;

  const registryRef = useRef(initRegistry(registry));
  const emitteryRef = useRef(initEmittery(events));

  const localeRef = useRef(locale);

  const onMountingFn = useEventCallback(onMounting);

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
    async (inputLocale = localeDefault) => {
      let _assets: MonacoPreloadAsset[] = [];

      for (const it of assets) {
        if (it == null || !it.url) continue;

        const url =
          it.url instanceof URL
            ? it.url
            : new URL(it.url, it.baseUrl || baseUrl);
        const { key, labels } = it;

        let priority = it.priority ?? assetDefaultPriority;
        let isRequired = priority < 0;

        if (isWorkerKey(key)) {
          if (isBlobWorker || url.origin !== location.origin) {
            isRequired = true;
          }
        } else if (isLocalKey(key, inputLocale)) {
          isRequired = true;
          priority = assetLocalePriority;
        }

        if (isRequired) {
          _assets.push({ key, url, priority, labels });
        }
      }

      const params = {
        baseUrl,
        locale: inputLocale,
        assets,
        preloadAssets: _assets,
        isBlobWorker,
      };

      await emitteryRef.current.emit('prepareAssets', params);

      if (_assets.length) _assets = _assets.sort(orderAssets);

      await emitteryRef.current.emit('interceptPrepareAssets', params);

      return _assets;
    },
    [baseUrl, assets, isBlobWorker],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handlePreload = useCallback(
    async (queue: DownloadQueue, preloadAssets: MonacoPreloadAsset[]) => {
      try {
        const params: MonacoPrepareMountAssetsParams = {
          baseUrl,
          locale: localeRef.current,
          isBlobWorker,
          queue,
          preloadAssets,
        };
        await emitteryRef.current.emit('preload', params);
        const mount = await prepareMountAssets(params);
        await emitteryRef.current.emit('interceptMountAssets', {
          ...params,
          mount,
        });

        const { remotes, workers, data } = mount;
        if (isInferObj(data) && Object.keys(data).length) {
          registryRef.current.assign(data);
        }
        if (!workers.length) {
          throw getText(MonacoPresetError.WORKERS_EMPTY);
        }
        initMonacoEnvironment(workers, localeRef.current);
        if (remotes.length) {
          setAssetsIds(
            (await Promise.all(remotes.map((it) => mountRemote(it)))).map(
              (it) => it.id,
            ),
          );
        }

        const $monaco = globalMonacoThrow();
        setReadyState(MonacoReadyState.Mounting);
        await onMountingFn?.({ monaco: $monaco });
        await emitteryRef.current.emit('mounting', { monaco: $monaco });
      } catch (err) {
        setError(err);
      }
    },
    [baseUrl, locale, isBlobWorker],
  );

  useIsomorphicLayoutEffect(() => {
    if (localeRef.current !== locale) {
      // 修改多语言环境，只允许在 Mounted 环境修改进行响应
      if (readyState !== MonacoReadyState.Mounted) return;
      localeRef.current = locale;
    } else {
      if (readyState !== MonacoReadyState.Init) return;
    }
    prepareAssets(locale)
      .then((res) => {
        setPreloadAssets(res);
        setReadyState(MonacoReadyState.Init);
      })
      .catch(setError);
  }, [locale, readyState, prepareAssets]);

  return {
    preset,
    // refs
    registryRef,
    emitteryRef,
    // props
    baseUrl,
    locale,
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
    globalMonaco,
    globalMonacoThrow,
    initMonacoEnvironment,
    findLanguage,
  };

  function initRegistry(input?: MonacoRegistry | DefaultRegistryData) {
    return input != null && input instanceof MonacoRegistry
      ? input
      : new MonacoRegistry(input);
  }

  function initEmittery(
    input?: Emittery<MonacoEventsParams> | MonacoInputEvents,
  ): Emittery<MonacoEventsParams> {
    if (input == null) return new Emittery<MonacoEventsParams>();
    if (input instanceof Emittery) return input;

    const emitter = new Emittery<MonacoEventsParams>();
    for (const [name, event] of Object.entries(input)) {
      if (!name || event == null) continue;
      if (Array.isArray(event)) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        event.forEach((ev) => emitter.on(name, ev));
      } else {
        // @ts-ignore
        emitter.on(name, event);
      }
    }
    return emitter;
  }

  async function prepareMountAssets({
    queue,
    preloadAssets,
    isBlobWorker,
  }: MonacoPrepareMountAssetsParams): Promise<MonacoPrepareMountAssets> {
    const { origin } = location;
    const tasks = queue.tasks;

    const mount: MonacoPrepareMountAssets = {
      remotes: [],
      workers: [],
      data: {},
    };

    for await (const [index, asset] of preloadAssets.entries()) {
      const task = tasks[index];
      const key = asset.key;

      /************************************************************************
       * main*, css*, local* 优先处理，不允许自定义处理
       ************************************************************************/
      if (isMainKey(key) || isCssKey(key) || isLocalKey(key)) {
        mount.remotes.push({
          url: asset.url.toString(),
          id: `monaco_assets_${convertKeyToId(key)}`,
          type: 'js',
        });
        continue;
      }

      /************************************************************************
       * worker，不允许自定义处理
       ************************************************************************/
      if (isWorkerKey(key)) {
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

        if (isWorkerKey(key, 'editor')) {
          // make sure editor/worker be the first one
          mount.workers = [it].concat(mount.workers);
        } else {
          mount.workers.push(it);
        }

        continue;
      }

      /************************************************************************
       * 其他资产处理
       ************************************************************************/
      if (task.chunks == null) continue;

      let isHandle = false;
      const handle = () => {
        isHandle = true;
      };

      const params = { key, index, asset, task, mount, handle };
      await emitteryRef.current.emit('asset', params);
      if (!isHandle) await emitteryRef.current.emit(`asset:${key}`, params);
      if (isHandle) continue;

      if (isJsonKey(key)) {
        // json 进行解析保存
        try {
          const text = new TextDecoder().decode(task.chunks);
          mount.data[key] = JSON.parse(text);
        } catch (err) {}
      } else {
        // 其他，保存 chunks，自行取用处理
        mount.data[key] = task.chunks;
      }
    }

    return mount;
  }

  function initMonacoEnvironment(
    workers: MonacoPreloadAsset[],
    locale?: string,
  ) {
    window.MonacoEnvironment = {
      // @ts-ignore locale
      locale,
      // baseUrl,
      getWorkerUrl: (_moduleId: string, label: string) => {
        const [editor, ...rest] = workers;
        for (const it of rest) {
          if (it.labels == null || !it.labels.length) continue;
          if (it.labels.includes(label)) {
            return it.blobUrl || it.url.toString();
          }
        }
        return editor.blobUrl || editor.url.toString();
      },
    };
  }

  function globalMonaco(): typeof monaco | undefined {
    return globalThis.monaco;
  }

  function globalMonacoThrow(): typeof monaco {
    const $monaco = globalMonaco();
    if ($monaco == null) {
      throw getText(MonacoPresetError.MONACO_UNDEFINED);
    }
    return $monaco;
  }

  function findLanguage(extname?: string | null) {
    const $monaco = globalMonaco();
    if ($monaco == null || !extname) return undefined;
    let ext = extname;
    if (!ext.startsWith('.')) ext = `.${ext}`;
    return $monaco.languages
      .getLanguages()
      .find((it) => it.extensions?.includes(ext));
  }
};

const orderAssets = <T extends { priority?: number }>(a: T, b: T) =>
  (a.priority ?? 0) - (b.priority ?? 0);
