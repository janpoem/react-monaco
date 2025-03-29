import { MonacoLoaderProcess } from '../constants';
import type { _PresetText, _PresetTextCallback } from '../types';

/**
 * 错误 Keys
 */
export type MonacoPresetErrorsKeys =
  | 'ERR_WORKERS_EMPTY'
  | 'ERR_NO_EDITOR_WORKER'
  | 'ERR_NO_CONTAINER'
  | 'ERR_INVALID_PRELOAD_PROCESS'
  | 'ERR_INVALID_CODE_INPUT'
  | 'ERR_MONACO_UNDEFINED'
  | 'ERR_UNKNOWN';

export type DownloadingParams = {
  isFetchDownload?: boolean;
  percent: number;
};

/**
 * 预设文本
 */
export type MonacoPresetTexts = Record<MonacoPresetErrorsKeys, _PresetText> & {
  [MonacoLoaderProcess.Initializing]: _PresetText;
  [MonacoLoaderProcess.Loading]: _PresetTextCallback<DownloadingParams>;
  [MonacoLoaderProcess.Preparing]: _PresetText;
  [MonacoLoaderProcess.Completed]: _PresetText; // will not use
};

export type MonacoTexts = MonacoPresetTexts & {
  [K in Exclude<string, keyof MonacoPresetTexts>]:
    | _PresetText
    | _PresetTextCallback;
};

export const initTexts = (): MonacoPresetTexts => ({
  ERR_WORKERS_EMPTY: 'Monaco workers cannot be empty',
  ERR_NO_EDITOR_WORKER: 'Editor worker URL not specified',
  ERR_NO_CONTAINER: 'Missing editor mount container',
  ERR_INVALID_PRELOAD_PROCESS: 'Invalid preload process state',
  ERR_INVALID_CODE_INPUT: 'Invalid code input',
  ERR_MONACO_UNDEFINED: 'Global monaco undefined',
  ERR_UNKNOWN: 'Unknown error',
  [MonacoLoaderProcess.Initializing]: 'Initializing...',
  [MonacoLoaderProcess.Loading]: ({
    isFetchDownload,
    percent,
  }: DownloadingParams) =>
    `Downloading${isFetchDownload ? ` ${percent}%` : ''}...`,
  [MonacoLoaderProcess.Preparing]: 'Preparing...',
  [MonacoLoaderProcess.Completed]: 'Completed',
});
