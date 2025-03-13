import { isInferObj } from '@zenstone/ts-utils/object';
import { notEmptyStr } from '@zenstone/ts-utils/string';
import type {
  MonacoCodeInput,
  MonacoFileCodeInput,
  MonacoPreloadAsset,
} from '../types';

/**
 * 获取全局 monaco
 */
export const globalMonaco = (): typeof monaco | undefined => globalThis.monaco;

/**
 * 获取全局 monaco ，如果不存在，则抛出异常
 */
export const globalMonacoThrow = (): typeof monaco => {
  const $monaco = globalMonaco();
  if ($monaco == null) {
    throw new Error('Global monaco undefined');
  }
  return $monaco;
};

/**
 * 初始化全局的 MonacoEnvironment
 *
 * @param workers
 * @param locale
 */
export const initMonacoEnvironment = (
  workers: MonacoPreloadAsset[],
  locale?: string,
) => {
  window.MonacoEnvironment = {
    // @ts-ignore locale
    locale,
    // baseUrl,
    getWorkerUrl: (_moduleId: string, label: string) => {
      const [editor, ...rest] = workers;
      for (const it of rest) {
        if (it.labels == null || !it.labels.length) continue;
        if (it.labels.includes(label)) {
          return it.blobUrl || it.url.toString();
        }
      }
      return editor.blobUrl || editor.url.toString();
    },
  };
};

export const findLanguage = (extname?: string | null) => {
  const $monaco = globalMonaco();
  if ($monaco == null || !extname) return undefined;
  let ext = extname;
  if (!ext.startsWith('.')) ext = `.${ext}`;
  return $monaco.languages
    .getLanguages()
    .find((it) => it.extensions?.includes(ext));
};

export const extractExtname = (path: string): string | undefined => {
  const match = /.([^.]+)$/.exec(path);
  return match ? `.${match[1]}` : undefined;
};

export const isFileInput = (input: MonacoCodeInput) =>
  isInferObj<MonacoFileCodeInput>(input, (it) => notEmptyStr(it.filename));

export const createModel = (input: MonacoCodeInput) => {
  const $monaco = globalMonacoThrow();
  if (!isFileInput(input)) {
    throw new Error('Unsupported input type');
  }

  const { filename, source, uri } = input;
  const ext = extractExtname(filename);
  const language = findLanguage(ext);

  return $monaco.editor.createModel(
    source || '',
    language?.id,
    uri ? $monaco.Uri.parse(uri) : undefined,
  );
};
