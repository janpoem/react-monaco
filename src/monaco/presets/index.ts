import {
  type MonacoPresetComponents,
  MonacoPresetError,
  type MonacoPresetTexts,
} from '../types';
import ErrorInfo from './ErrorInfo';
import Loader from './Loader';

export * from '../components/PresetComponent';

export const initComponents: MonacoPresetComponents = {
  Loader,
  ErrorInfo,
};

export type PresetDownloadingParams = {
  isFetchDownload?: boolean;
  percent: number;
};

export const initTexts: MonacoPresetTexts = {
  [MonacoPresetError.WORKERS_EMPTY]: 'Monaco workers cannot be empty',
  [MonacoPresetError.NO_CONTAINER]: 'Missing editor mount container',
  [MonacoPresetError.INVALID_PRELOAD_PROCESS]: 'Invalid preload process state',
  [MonacoPresetError.INVALID_CODE_INPUT]: 'Invalid code input',
  [MonacoPresetError.MONACO_UNDEFINED]: 'Global monaco undefined',
  [MonacoPresetError.UNKNOWN]: 'Unknown error',
  Initializing: 'Initializing...',
  Downloading: ({ isFetchDownload, percent }: PresetDownloadingParams) =>
    `Downloading${isFetchDownload ? ` ${percent}%` : ''}...`,
  Preparing: 'Preparing...',
};
