/// <reference types="monaco-editor/monaco.d.ts" />
import type { RemoteLoaderEventsDefinition } from '@zenstone/use-remote-loader';
import type { CSSProperties, ReactNode } from 'react';

export type _MaybePromise<T> = T | Promise<T>;

export type _CommonProps = {
  className?: string;
  style?: CSSProperties;
};

export type _CommonWithChildrenProps = _CommonProps & {
  children?: ReactNode;
};

////////////////////////////////////////////////////////////////////////////////
// 事件抽象化表达
// 我们不应该依托于任何的具体实现，应该由抽象表达来决定一切
////////////////////////////////////////////////////////////////////////////////

/**
 * 事件定义
 *
 * 以 `Record<EventName, EventParams>` 表达
 *
 * 注意 `EventParams` 应该是一个 object 结构
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type EventsDefinition = Record<PropertyKey, any>;

/**
 * 事件添加监听器
 *
 * 只用于表达接口实现
 */
export interface EventEmitter<E extends EventsDefinition = EventsDefinition> {
  on: <N extends keyof E>(
    name: N,
    callback: (params: E[N]) => _MaybePromise<void>,
  ) => void;

  off: <N extends keyof E>(
    name: N,
    callback: (params: E[N]) => _MaybePromise<void>,
  ) => void;

  emit: <N extends keyof E, P = E[N]>(
    name: N,
    params: P,
  ) => _MaybePromise<void>;
}

/**
 * 单个事件以函数方式的声明
 *
 * 可以是单个函数，或者是多个函数的数组
 */
export type EventCallbackDeclaration<T> =
  | ((params: T) => _MaybePromise<void>)
  | ((params: T) => _MaybePromise<void>[]);

/**
 * 多个事件的函数式声明
 */
export type EventsCallbacks<E extends EventsDefinition = EventsDefinition> =
  Partial<{
    [Key in keyof E]: EventCallbackDeclaration<E[Key]>;
  }>;

/**
 * 事件委托者
 */
export interface EventsDelegator<
  E extends EventsDefinition = EventsDefinition,
> {
  inject(emitter?: EventEmitter<E>): void;
  eject(emitter?: EventEmitter<E>): void;
}

export type EventsRecord<
  O extends object,
  E extends EventsDefinition = EventsDefinition,
> = {
  [K in Exclude<keyof O, 'toString' | keyof EventsDelegator>]?:
    | keyof E
    | (keyof E)[];
};

/**
 * 有效的事件输入类型联合
 */
export type EventsInput<E extends EventsDefinition = EventsDefinition> =
  | EventEmitter<E>
  | EventsCallbacks<E>
  | EventsDelegator<E>;

////////////////////////////////////////////////////////////////////////////////
// Monaco 专属事件定义
////////////////////////////////////////////////////////////////////////////////
export type MonacoMountingParams = {
  monaco: typeof monaco;
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

export type MonacoEditorMountParams = {
  mode: 'code' | string;
  monaco: typeof monaco;
  editor: monaco.editor.IStandaloneCodeEditor;
  model?: monaco.editor.ITextModel;
};

export type MonacoEventsDefinition = RemoteLoaderEventsDefinition & {
  mounting: MonacoMountingParams;
  prepareModel: MonacoModelPrepareParams;
  createModel: MonacoModelCreateParams;
  changeModel: MonacoModelChangeParams;
  /**
   * Editor 挂载成功事件
   */
  editor: MonacoEditorMountParams;
};

////////////////////////////////////////////////////////////////////////////////
// Monaco 输入定义
////////////////////////////////////////////////////////////////////////////////
export type MonacoFileCodeInput = {
  filename: string;
  source?: string;
  uri?: string;
};

export type MonacoCodeInput = MonacoFileCodeInput;

////////////////////////////////////////////////////////////////////////////////
// Monaco Theme
////////////////////////////////////////////////////////////////////////////////
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
