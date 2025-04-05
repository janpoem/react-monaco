import { purgeHttpPath } from '@zenstone/ts-utils';

const cdnAssetsBaseUrl =
  'https://cdn.jsdelivr.net/npm/@react-monaco/assets/assets/';

const devAssetsBaseUrl = `${location.origin}/assets/`;

export const assetsBaseUrl =
  process.env.NODE_ENV === 'production' ? cdnAssetsBaseUrl : devAssetsBaseUrl;

export const assetsOf = (path: string) => {
  const _path = purgeHttpPath(path);
  if (_path) return `${assetsBaseUrl}${_path}/`; // make sure with the end /
  return assetsBaseUrl;
};

export const monacoBaseUrl =
  'https://static.summererp.com/misc/monaco-editor/0.52.2/';
