import { notEmptyStr } from '@zenstone/ts-utils/string';
import { useMemo } from 'react';
import { MonacoLoaderProcess } from '../constants';
import { useMonacoPreset } from './useMonacoPreset';

export type UseMonacoLoaderTextOptions = {
  defaultText?: string;
  process: MonacoLoaderProcess;
  isFetchDownload?: boolean;
  percent: number;
};

export const useMonacoLoaderText = ({
  defaultText,
  process,
  isFetchDownload,
  percent,
}: UseMonacoLoaderTextOptions) => {
  const getText = useMonacoPreset().getText;
  return useMemo(() => {
    if (
      process === MonacoLoaderProcess.Initializing &&
      notEmptyStr(defaultText)
    ) {
      return defaultText;
    }
    return getText(
      process,
      MonacoLoaderProcess.Loading ? { isFetchDownload, percent } : {},
    );
  }, [getText, process, isFetchDownload, percent, defaultText]);
};
