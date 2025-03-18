/// <reference types="monaco-editor/monaco.d.ts" />

import type {
  DownloadQueue,
  DownloadTask,
} from '@zenstone/ts-utils/fetch-download';
import type { MountRemoteOptions } from '@zenstone/ts-utils/remote';
import type Emittery from 'emittery';
import type { ComponentType, ReactNode } from 'react';
import type { PresetText } from '../preset-provider';
import type { MonacoRegistry } from './MonacoRegistry';

/******************************************************************************
 * utils
 ******************************************************************************/

type MaybePromise<T> = T | Promise<T>;

/******************************************************************************
 * MonacoAsset(s)
 ******************************************************************************/

export type MonacoAssetWorkerKey =
  `worker/${'editor' | 'ts' | 'html' | 'json' | 'css' | string}`;

export type MonacoAssetLocaleKey = `locale/${string}`;

export type MonacoAssetJsonKey = `json/${string}`;
export type MonacoAssetWasmKey = `wasm/${string}`;

export type MonacoAssetKey =
  | 'main'
  | MonacoAssetWorkerKey
  | MonacoAssetLocaleKey
  | `css`
  | `css/${string}`
  | MonacoAssetJsonKey
  | MonacoAssetWasmKey
  | string;

export type MonacoAsset = {
  key: MonacoAssetKey;
  url: string | URL;
  labels?: string[];
  baseUrl?: string;
  priority?: number;
  [key: string]: unknown;
};

export type MonacoPreloadAsset = {
  key: MonacoAssetKey;
  url: URL;
  priority: number;
  labels?: string[];
  blobUrl?: string;
};

export enum MonacoPreloadState {
  Download = 0,
  Prepare = 1,
}

export type MonacoPreloadProcess = {
  state: MonacoPreloadState.Download | MonacoPreloadState.Prepare;
  assets: MonacoPreloadAsset[];
  queue: DownloadQueue;
};

/******************************************************************************
 * Preset Components
 ******************************************************************************/
export type MonacoPresetProps<
  C extends MonacoPresetComponents = MonacoPresetComponents,
  T extends MonacoPresetTexts = MonacoPresetTexts,
> = {
  components?: Partial<C>;
  texts?: Partial<T>;
};

export type MonacoPresetComponents = {
  Loader: ComponentType<MonacoPresetLoaderProps>;
  ErrorInfo: ComponentType<MonacoPresetErrorInfoProps>;
};

export enum MonacoPresetError {
  WORKERS_EMPTY = 'WORKERS_EMPTY',
  NO_CONTAINER = 'NO_CONTAINER',
  INVALID_PRELOAD_PROCESS = 'INVALID_PRELOAD_PROCESS',
  INVALID_CODE_INPUT = 'INVALID_CODE_INPUT',
  MONACO_UNDEFINED = 'MONACO_UNDEFINED',
  UNKNOWN = 'UNKNOWN',
}

export type MonacoTextKeys = string | MonacoPresetError;

export type MonacoPresetTexts = {
  Initializing: PresetText;
  Downloading: PresetText;
  Preparing: PresetText;
  [key: MonacoTextKeys]: PresetText;
};

export type MonacoPresetLoaderProps<P = unknown> = {
  process?: MonacoPreloadProcess;
  percent: number;
  isFetchDownload?: boolean;
  withContainer?: boolean;
  defaultText?: ReactNode;
  className?: string;
  render?: ComponentType<Omit<MonacoPresetLoaderProps, 'render'>>;
} & P;

export type MonacoPresetErrorInfoProps = {
  scope?: string;
  error: unknown;
  withContainer?: boolean;
  defaultText?: ReactNode;
  className?: string;
};

/******************************************************************************
 * MonacoProvider
 ******************************************************************************/
export type DefaultRegistryData = {
  [key: PropertyKey]: unknown;
};

export enum MonacoReadyState {
  Init = 0,
  Mounting = 1,
  Mounted = 2,
}

export type MonacoProviderProps<
  C extends MonacoPresetComponents = MonacoPresetComponents,
  T extends MonacoPresetTexts = MonacoPresetTexts,
> = MonacoPresetProps<C, T> & {
  registry?: MonacoRegistry | DefaultRegistryData;
  events?: Emittery<MonacoEventsParams> | MonacoInputEvents;
  baseUrl?: string | URL;
  locale?: string;
  assets: MonacoAsset[];
  isFetchDownload?: boolean;
  isCompressed?: boolean;
  /**
   * 强制指定 worker 作为 blob 加载
   * monaco-editor worker 除了要求 same origin 以外，
   * 还要求服务器端要输出 content-type 必须起码是 application/javascript; charset=UTF-8 或 text/javascript; charset=utf-8
   * 所以额外提供一个配置参数，用于适配后端无法正确输出 content-type 的情况
   */
  isBlobWorker?: boolean;
  // handlePrepareAssets?: (params: {
  //   locale?: string | undefined;
  //   assets: MonacoAsset[];
  //   preloadAssets: MonacoPreloadAsset[];
  //   isBlobWorker?: boolean;
  // }) => MaybePromise<MonacoPreloadAsset[]>;
  // onPreload?: (params: {
  //   queue: DownloadQueue;
  //   preloadAssets: MonacoPreloadAsset[];
  // }) => MaybePromise<void>;
  // handlePrepareMountAssets?: (params: {
  //   queue: DownloadQueue;
  //   preloadAssets: MonacoPreloadAsset[];
  //   remotes: MountRemoteOptions<unknown>[];
  //   workers: MonacoPreloadAsset[];
  // }) => MaybePromise<[MountRemoteOptions<unknown>[], MonacoPreloadAsset[]]>;
  onMounting?: (params: MonacoMountingParams) => MaybePromise<void>;
};

/******************************************************************************
 * MonacoEvents
 ******************************************************************************/
export type MonacoPrepareAssetsParams = {
  baseUrl: URL;
  locale?: string | undefined;
  assets: MonacoAsset[];
  preloadAssets: MonacoPreloadAsset[];
  isBlobWorker?: boolean;
};

export type MonacoPrepareMountAssetsParams = {
  baseUrl: URL;
  locale?: string | undefined;
  isBlobWorker?: boolean;
  queue: DownloadQueue;
  preloadAssets: MonacoPreloadAsset[];
};

export type MonacoPrepareMountAssets = {
  remotes: MountRemoteOptions<unknown>[];
  workers: MonacoPreloadAsset[];
  data: DefaultRegistryData;
};

export type MonacoHandleAssetParams = {
  key: string;
  index: number;
  task: DownloadTask;
  asset: MonacoPreloadAsset;
  mount: MonacoPrepareMountAssets;
  handle: () => void;
};

export type MonacoModelPrepareParams = {
  input: MonacoCodeInput;
  language?: monaco.languages.ILanguageExtensionPoint;
  extname?: string;
  uri?: monaco.Uri;
  monaco: typeof monaco;
  editor?: monaco.editor.IStandaloneCodeEditor;
};

export type MonacoModelCreateParams = MonacoModelPrepareParams & {
  model: monaco.editor.ITextModel;
};

export type MonacoModelChangeParams = MonacoModelCreateParams & {
  event: monaco.editor.IModelContentChangedEvent;
};

export type MonacoMountingParams = {
  monaco: typeof monaco;
};

export type MonacoCodeEditorMountedParams = {
  monaco: typeof monaco;
  editor: monaco.editor.IStandaloneCodeEditor;
  model?: monaco.editor.ITextModel;
};

type HandleAssetKey = `asset:${string}`;

export type MonacoEventsParams = {
  /**
   * 预备预加载资产事件
   *
   * 如果希望对预加载资产进行添加和修改，可使用该事件
   */
  prepareAssets: MonacoPrepareAssetsParams;
  /**
   * 拦截预加载资产事件
   *
   * 如果希望对最终的预加载资产进行总体控制，可使用该事件
   */
  interceptPrepareAssets: MonacoPrepareAssetsParams;
  /**
   * 预加载完成事件
   *
   * 根据 preloadAssets ，生成下载任务 queue
   *
   * 此时 queue 应该是已下载完成的状态
   */
  preload: MonacoPrepareMountAssetsParams;
  /**
   * 自定义资源接管事件
   *
   * 如果接管该资源，请使用 `handle()` 函数，表示已接管
   *
   * 暂时只允许非 main* css* local* worker* 的资源接管
   *
   * ```ts
   * emittery.on('asset', ({ handle }) => {
   *   // 接管处理...
   *   handle(); // 表示正式接管该资源的处理
   * })
   * ```
   */
  asset: MonacoHandleAssetParams;
  /**
   * 自定义资源 key 接管事件
   *
   * 如果接管该资源，请使用 `handle()` 函数，表示已接管
   *
   * 暂时只允许非 main* css* local* worker* 的资源接管
   *
   * ```ts
   * emittery.on('asset:json/test', ({ handle }) => {
   *   // 接管处理...
   *   handle(); // 表示正式接管该资源的处理
   * })
   * ```
   */
  [key: HandleAssetKey]: MonacoHandleAssetParams;
  /**
   * 拦截即将要加载的资源事件
   */
  interceptMountAssets: MonacoPrepareMountAssetsParams & {
    mount: MonacoPrepareMountAssets;
  };
  /**
   * monaco 加载中事件
   *
   * 该事件表示 monaco 所需资产已全部加载完毕，但 monaco-editor 尚未挂载的状态
   */
  mounting: MonacoMountingParams;
  mounted: MonacoCodeEditorMountedParams;
  prepareModel: MonacoModelPrepareParams;
  createModel: MonacoModelCreateParams;
  changeModel: MonacoModelChangeParams;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: PropertyKey]: any;
};

type EventCallbacks<T> = (
  params: T,
) => MaybePromise<void> | ((params: T) => MaybePromise<void>[]);

export type MonacoInputEvents = Partial<{
  [Key in keyof MonacoEventsParams]: EventCallbacks<MonacoEventsParams[Key]>;
}>;

/******************************************************************************
 * Monaco Theme
 ******************************************************************************/
// 默认提供 vs/vs-dark 的
// 其他主题色，可以选择性实现
export type MonacoThemeColors = {
  primary: string; // activityBarBadge.background
  secondary: string; // editor.selectionHighlightBackground
  success: string; // ports.iconRunningProcessForeground
  error: string; // statusBarItem.errorBackground
  background: string; // editor.background
  text: string; // editor.foreground
  borderColor: string; // checkbox.border
};

export type MonacoCompleteTheme = {
  // theme 主题名称，请勿使用敏感字符，这个是用来 `monaco.editor.defineTheme(name, data)`
  name: string;
  displayName: string;
  colors: MonacoThemeColors;
  isDark: boolean;
  data: monaco.editor.IStandaloneThemeData;
};

export type MonacoCustomTheme = {
  // theme 主题名称，请勿使用敏感字符，这个是用来 `monaco.editor.defineTheme(name, data)`
  name: string;
  displayName: string;
  colors: Partial<MonacoThemeColors>;
  isDark: boolean;
  data: monaco.editor.IStandaloneThemeData;
};

export type MonacoCustomThemeCallback = () => MonacoCustomTheme;

/******************************************************************************
 * MonacoCodeEditor
 ******************************************************************************/
export type MonacoFileCodeInput = {
  filename: string;
  source?: string;
  uri?: string;
};

export type MonacoCodeInput = MonacoFileCodeInput;

export type MonacoCodeEditorProps = {
  input: MonacoCodeInput;
  options?: Partial<
    Omit<monaco.editor.IStandaloneEditorConstructionOptions, 'value' | 'model'>
  >;
  onModel?: (params: MonacoModelCreateParams) => void;
  onChange?: (params: MonacoModelChangeParams) => void;
  onMounted?: (params: MonacoCodeEditorMountedParams) => void;
};
