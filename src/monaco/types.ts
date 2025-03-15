/// <reference types="monaco-editor/monaco.d.ts" />

import type { DownloadQueue } from '@zenstone/ts-utils/fetch-download';
import type { MountRemoteOptions } from '@zenstone/ts-utils/remote';
import type { ComponentType, ReactNode } from 'react';

type MaybyPromise<T> = T | Promise<T>;

/******************************************************************************
 * MonacoAsset(s)
 ******************************************************************************/

export type MonacoWorkerKey =
  `worker/${'editor' | 'ts' | 'html' | 'json' | 'css' | string}`;

export type MonacoLocaleKey = `locale/${string}`;

export type MonacoAssetKey =
  | 'main'
  | `css`
  | `css/${string}`
  | MonacoWorkerKey
  | MonacoLocaleKey
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
export type PresetProviderProps = {
  components?: Partial<PresetComponents>;
  texts?: Partial<PresetTexts>;
};

export type PresetComponents<
  T extends Record<string, ComponentType> = Record<string, ComponentType>,
> = {
  Loader: ComponentType<PresetLoaderProps>;
  ErrorInfo: ComponentType<PresetErrorProps>;
} & T;

export type PresetTexts = Record<string, string>;

export type PresetLoaderProps<P = unknown> = {
  process?: MonacoPreloadProcess;
  percent: number;
  isFetchDownload?: boolean;
  withContainer?: boolean;
  defaultText?: ReactNode;
  className?: string;
  render?: ComponentType<Omit<PresetLoaderProps, 'render'>>;
} & P;

export type PresetErrorProps = {
  scope?: string;
  error: unknown;
  withContainer?: boolean;
  defaultText?: ReactNode;
  className?: string;
};

/******************************************************************************
 * MonacoProvider
 ******************************************************************************/
export enum MonacoReadyState {
  Init = 0,
  Mounting = 1,
  Mounted = 2,
}

export type MonacoProviderProps = PresetProviderProps & {
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
  /**
   * 接管预备 monaco-editor 资产函数
   *
   * 定义了该函数，仍然会根据 baseUrl/assets/locale 来生成该次所需的资产（包含在 `params` 中）
   *
   * 如需要自行接管资产，可对该函数的返回结果进行处理
   *
   * @param params
   */
  handlePrepareAssets?: (params: {
    locale?: string | undefined;
    assets: MonacoAsset[];
    preloadAssets: MonacoPreloadAsset[];
    isBlobWorker?: boolean;
  }) => MaybyPromise<MonacoPreloadAsset[]>;
  onPreload?: (params: {
    queue: DownloadQueue;
    preloadAssets: MonacoPreloadAsset[];
  }) => MaybyPromise<void>;
  handlePrepareMountAssets?: (params: {
    queue: DownloadQueue;
    preloadAssets: MonacoPreloadAsset[];
    remotes: MountRemoteOptions<unknown>[];
    workers: MonacoPreloadAsset[];
  }) => MaybyPromise<[MountRemoteOptions<unknown>[], MonacoPreloadAsset[]]>;
  onMounting?: ($monaco: typeof monaco) => MaybyPromise<void>;
};

/******************************************************************************
 * Monaco Theme
 ******************************************************************************/
export type MonacoThemeColor = {
  primary: string;
  background: string;
  text: string;
};

export type MonacoCustomTheme = {
  name: string;
  color?: string | Partial<MonacoThemeColor>;
  isDark?: boolean;
  data: monaco.editor.IStandaloneThemeData;
};

export type MonacoCustomThemeFn = () => MonacoCustomTheme;

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
  onCreateModel?: (model: monaco.editor.ITextModel) => void;
  onCreateEditor?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onChange?: (ev: monaco.editor.IModelContentChangedEvent) => void;
};
