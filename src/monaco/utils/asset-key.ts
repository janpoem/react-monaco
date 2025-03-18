import { isStr } from '@zenstone/ts-utils/string';

const prefixCheck =
  (prefix: string, allowEquals?: boolean) =>
  (key: string, value?: string | null) => {
    if (isStr(value)) {
      return key === `${prefix}/${value}`;
    }
    if (allowEquals && key === prefix) {
      return true;
    }
    return key.startsWith(`${prefix}/`);
  };

export const isWorkerKey = prefixCheck('worker');

export const isLocalKey = prefixCheck('locale');

export const isJsonKey = prefixCheck('json');

export const isCssKey = prefixCheck('css', true);

export const isMainKey = prefixCheck('main', true);

export const convertKeyToId = (key: string) => key.replace(/\/+/gm, '_');
