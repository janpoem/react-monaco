import { isInferObj } from '@zenstone/ts-utils/object';
import { notEmptyStr } from '@zenstone/ts-utils/string';
import type { MonacoCodeInput, MonacoFileCodeInput } from '../types';

export const extractExtname = (path: string): string | undefined => {
  const match = /.([^.]+)$/.exec(path);
  return match ? `.${match[1]}` : undefined;
};

export const isFileInput = (input: MonacoCodeInput) =>
  isInferObj<MonacoFileCodeInput>(input, (it) => notEmptyStr(it.filename));
