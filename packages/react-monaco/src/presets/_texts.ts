import type { PresetText, PresetTextCallback } from '@zenstone/preset-provider';
import { MonacoLoaderProcess } from '../constants';

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
export type MonacoPresetTexts = Record<MonacoPresetErrorsKeys, PresetText> & {
  // ERR_WORKERS_EMPTY: PresetText;
  // ERR_NO_CONTAINER: PresetText;
  // ERR_INVALID_PRELOAD_PROCESS: PresetText;
  // ERR_INVALID_CODE_INPUT: PresetText;
  // ERR_MONACO_UNDEFINED: PresetText;
  // ERR_UNKNOWN: PresetText;
  [MonacoLoaderProcess.Initializing]: PresetText;
  [MonacoLoaderProcess.Loading]: PresetTextCallback<DownloadingParams>;
  [MonacoLoaderProcess.Preparing]: PresetText;
  [MonacoLoaderProcess.Completed]: PresetText; // will not use
  // [key: string]: PresetText;
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
