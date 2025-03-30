import { isInferObj, notEmptyStr } from '@zenstone/ts-utils';
import type { MonacoExtendEnvironment, MonacoFileCodeInput } from '../types';

export const extractExtname = (path: string): string | undefined => {
  const match = /.([^.]+)$/.exec(path);
  return match ? `.${match[1]}` : undefined;
};

export const isFileInput = (input: unknown) =>
  isInferObj<MonacoFileCodeInput>(input, (it) => notEmptyStr(it.filename));

export const updateMonacoEnvironment = (
  vars: Partial<MonacoExtendEnvironment>,
) => {
  if (isInferObj(window.MonacoEnvironment)) {
    Object.assign(window.MonacoEnvironment, vars);
  } else {
    window.MonacoEnvironment = vars;
  }
};

export const debugOutput = (
  scopeName?: string | string[],
  ...args: unknown[]
) => {
  let name: string | undefined;
  let style: string | undefined;
  if (notEmptyStr(scopeName)) {
    name = scopeName;
  } else if (Array.isArray(scopeName)) {
    [name, style] = scopeName;
  }
  if (name) {
    console.log(
      `%c[%c${name}%c]`,
      'color: gray',
      style || 'color: cyan',
      'color: gray',
      ...args,
    );
  } else {
    console.log(...args);
  }
};
