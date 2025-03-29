import type { RemoteLoadState } from '@zenstone/use-remote-loader';
import type { ComponentType, CSSProperties } from 'react';
import type { MonacoLoaderProcess } from '../constants';
import type { _CommonProps } from '../types';
import type { MonacoPresetTexts } from './_texts';
import ErrorDisplay from './ErrorDisplay';
import Loader from './Loader';
import ProgressBar from './ProgressBar';

/**
 * 错误显示组件
 */
export type MonacoPresetErrorDisplayProps = _CommonProps & {
  scope?: string;
  error: unknown;
  withContainer?: boolean;
  defaultText?: string;
};

export type MonacoPresetLoaderSharedProps = _CommonProps & {
  showText?: boolean;
  progressBar?: MonacoPresetProgressBarProps['mode'];
  dir?: 'row' | 'column';
  width?: CSSProperties['width'];
  withContainer?: boolean;
  defaultText?: string;
};

/**
 * 加载器组件
 */
export type MonacoPresetLoaderProps<Q = object> =
  MonacoPresetLoaderSharedProps & {
    process: MonacoLoaderProcess;
    isFetchDownload?: boolean;
    percent: number;
    state: RemoteLoadState<Q>;
  };

export type MonacoPresetProgressBarProps = {
  mode?: boolean | 'linear' | 'circular';
  indeterminate?: boolean;
  percent?: number;
  width?: CSSProperties['width'];
};

/**
 * 预设组件
 */
export type MonacoPresetComponents = {
  ErrorDisplay: ComponentType<MonacoPresetErrorDisplayProps>;
  Loader: ComponentType<MonacoPresetLoaderProps>;
  ProgressBar: ComponentType<MonacoPresetProgressBarProps>;
};

export type MonacoComponents = MonacoPresetComponents & {
  [K in Exclude<string, keyof MonacoPresetTexts>]: ComponentType;
};

export const initComponents = (): MonacoPresetComponents => ({
  ErrorDisplay,
  Loader,
  ProgressBar,
});
