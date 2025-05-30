import {
  PresetProvider,
  usePresetProviderInit,
} from '@zenstone/preset-provider';
import type { RemoteOnMountAssetsParams } from '@zenstone/use-remote-loader';
import compare from 'just-compare';
import {
  createContext,
  type CSSProperties,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useEventCallback, useIsomorphicLayoutEffect } from 'usehooks-ts';
import { ErrorWrapper } from './components';
import { MonacoReadyState } from './constants';
import { MonacoLoader, type MonacoLoaderProps } from './MonacoLoader';
import {
  initComponents,
  initTexts,
  type MonacoComponents,
  type MonacoTexts,
} from './presets';
import {
  cssVerticalContainer,
  presetCls,
  type PresetStyleVars,
  presetStyleVars,
} from './styles';
import { MonacoPresetThemes } from './themes';
import type {
  EventEmitter,
  EventsCallbacks,
  MonacoEventsDefinition,
  MonacoUpdateLifecycleParams,
} from './types';
import {
  isWorkerAsset,
  isWorkerKey,
  updateMonacoEnvironment,
  useEventEmitterRef,
} from './utils';

export type MonacoContextType = {
  monacoRef: RefObject<typeof monaco | undefined>;
  emitterRef: RefObject<EventEmitter<MonacoEventsDefinition> | undefined>;
  error: unknown;
  setError: Dispatch<SetStateAction<unknown>>;
  readyState: MonacoReadyState;
  setReadyState: Dispatch<SetStateAction<MonacoReadyState>>;
  lifecycleId: number;
  findLanguage(
    extname?: string | null,
  ): monaco.languages.ILanguageExtensionPoint | undefined;
  refMonaco(): typeof monaco;
  extendThemes(): void;
};

const Context = createContext<MonacoContextType>({
  monacoRef: { current: undefined },
  emitterRef: { current: undefined },
  error: undefined,
  setError: () => void 0,
  readyState: MonacoReadyState.Prepare,
  setReadyState: () => void 0,
  lifecycleId: 0,
  findLanguage: () => void 0,
  refMonaco: () => {
    throw new Error('Invalid runtime');
  },
  extendThemes: () => void 0,
});

export type MonacoProviderProps = {
  texts?: Partial<MonacoTexts>;
  components?: Partial<MonacoComponents>;
  loader?: MonacoLoaderProps;
  events?:
    | EventEmitter<MonacoEventsDefinition>
    | EventsCallbacks<MonacoEventsDefinition>;
  style?: Partial<PresetStyleVars & CSSProperties>;
  className?: string;
  children?: ReactNode;
  // 增加这两个事件回调，用于调试 next.js context 割裂的问题
  onInit?: (params: MonacoUpdateLifecycleParams) => void;
  onUpdateLifecycle?: (params: MonacoUpdateLifecycleParams) => void;
};

const createReadyState = () => {
  if (typeof monaco === 'undefined') {
    return MonacoReadyState.Prepare;
  }
  return MonacoReadyState.Mounting;
};

const refGlobalMonaco = () => globalThis.monaco;

export const MonacoProvider = ({
  texts,
  components,
  loader,
  events,
  style,
  className,
  children,
  onInit,
  onUpdateLifecycle,
  ...props
}: MonacoProviderProps) => {
  const queryRef = useRef(loader?.query);
  const monacoRef = useRef(refGlobalMonaco());
  const emitterRef = useEventEmitterRef(events);
  const [error, setError] = useState<unknown>(undefined);
  const [readyState, setReadyState] = useState(createReadyState);

  const [lifecycleId, setLifecycleId] = useState(0);
  const lifecycleIdRef = useRef(lifecycleId);

  const onInitFn = useEventCallback(onInit);
  const onUpdateLifecycleFn = useEventCallback(onUpdateLifecycle);

  const container = useMemo(
    () =>
      cssVerticalContainer({ ...presetStyleVars(style), position: 'relative' }),
    [style],
  );

  const preset = usePresetProviderInit({
    initTexts,
    initComponents,
    texts,
    components,
  });

  useIsomorphicLayoutEffect(() => {
    if (!compare(queryRef.current, loader?.query)) {
      queryRef.current = loader?.query;
      setLifecycleId((prev) => prev + 1);
    }
  }, [loader?.query]);

  useIsomorphicLayoutEffect(() => {
    if (lifecycleIdRef.current !== lifecycleId) {
      onUpdateLifecycleFn?.({
        lifecycleId,
        query: queryRef.current,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        emitter: emitterRef.current!,
        monaco: monacoRef.current,
      });
    }
  }, [lifecycleId]);

  useIsomorphicLayoutEffect(() => {
    onInitFn?.({
      lifecycleId: lifecycleIdRef.current,
      query: queryRef.current,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      emitter: emitterRef.current!,
      monaco: monacoRef.current,
    });
  }, []);

  const shouldReload = useCallback(
    () => lifecycleId !== lifecycleIdRef.current,
    [lifecycleId],
  );

  return (
    <PresetProvider preset={preset}>
      <Context.Provider
        value={{
          monacoRef,
          emitterRef,
          error,
          setError,
          readyState,
          setReadyState,
          lifecycleId,
          findLanguage,
          refMonaco,
          extendThemes,
        }}
      >
        <div
          className={`${presetCls.container} ${container}${className ? ` ${className}` : ''}`}
        >
          <ErrorWrapper scope={'MonacoProvider'} error={error} withContainer>
            <MonacoLoader
              {...loader}
              withContainer
              emitter={emitterRef.current}
              onError={setError}
              onMount={onRemoteMount}
              shouldReload={shouldReload}
              onLoad={() => {
                // sync lifecycleIdRef
                lifecycleIdRef.current = lifecycleId;
                setReadyState(MonacoReadyState.Mounting);
              }}
            />
            {children}
          </ErrorWrapper>
        </div>
      </Context.Provider>
    </PresetProvider>
  );

  async function onRemoteMount(params: RemoteOnMountAssetsParams) {
    try {
      if (typeof monaco === 'undefined') {
        throw new Error(preset.getText('ERR_MONACO_UNDEFINED'));
      }
      monacoRef.current = refMonaco();
      initMonacoEnvironment(params);
      // extendThemes();
      emitterRef.current?.emit('mounting', { monaco: monaco });
    } catch (err) {
      setError(err);
    }
  }

  function extendThemes() {
    if (monacoRef.current == null) return;
    for (const [key, theme] of Object.entries(MonacoPresetThemes)) {
      monacoRef.current.editor.defineTheme(theme.name, theme.data);
    }
  }

  function initMonacoEnvironment({
    props: { assets, baseUrl },
    resultSet: { blobUrls },
    preloadAssets,
  }: RemoteOnMountAssetsParams) {
    type Worker = { url: string; labels: string[] };
    let editor: Worker | undefined;
    const workers: Worker[] = [];
    for (const it of assets) {
      if (!isWorkerAsset(it)) continue;
      const { key, labels } = it;
      const preloadAsset = preloadAssets.find((asset) => asset.key === it.key);
      const url = (
        preloadAsset
          ? preloadAsset.blobUrl
            ? (blobUrls[key] ?? preloadAsset.url)
            : preloadAsset.url
          : new URL(it.url, baseUrl)
      ).toString();
      if (isWorkerKey(key, 'editor')) {
        editor = { url, labels };
      } else {
        workers.push({ url, labels });
      }
    }
    if (editor == null) {
      throw new Error(preset.getText('ERR_NO_EDITOR_WORKER'));
    }
    if (!workers.length) {
      throw new Error(preset.getText('ERR_WORKERS_EMPTY'));
    }
    updateMonacoEnvironment({
      getWorkerUrl: (_moduleId: string, label: string) => {
        for (const it of workers) {
          if (!it.labels.length) continue;
          if (it.labels.includes(label)) {
            return it.url;
          }
        }
        return editor.url;
      },
    });
  }

  function refMonaco() {
    const _monaco = refGlobalMonaco();
    if (_monaco == null) {
      throw new Error(preset.getText('ERR_MONACO_UNDEFINED'));
    }
    return _monaco;
  }

  function findLanguage(extname?: string | null) {
    if (monacoRef.current == null || !extname) return undefined;
    let ext = extname;
    if (!ext.startsWith('.')) ext = `.${ext}`;
    return monacoRef.current.languages
      .getLanguages()
      .find((it) => it.extensions?.includes(ext));
  }
};

export const useMonaco = () => useContext(Context);
