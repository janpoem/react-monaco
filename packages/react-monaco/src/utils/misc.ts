import { isInferObj, notEmptyStr } from '@zenstone/ts-utils';
import type {
  MonacoCodeInput,
  MonacoExtendEnvironment,
  MonacoFileCodeInput,
} from '../types';

export const extractExtname = (path: string): string | undefined => {
  const match = /.([^.]+)$/.exec(path);
  return match ? `.${match[1]}` : undefined;
};

export const isFileInput = (input: MonacoCodeInput) =>
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
