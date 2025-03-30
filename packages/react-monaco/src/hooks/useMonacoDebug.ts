import { useCallback } from 'react';
import { debugOutput } from '../utils';

export const useMonacoDebug = (
  scopeName?: string | string[],
  isDebug?: boolean,
) => {
  const debug = useCallback(
    (...args: unknown[]) => {
      if (!isDebug) return;
      debugOutput(scopeName, ...args);
    },
    [scopeName, isDebug],
  );

  return { debug };
};
