import { notEmptyStr } from '@zenstone/ts-utils';
import { makeConfigurable } from './utils';

type MonacoPresetRepos = {
  jsdelivr: string | URL;
  unpkg: string | URL;
  jsdmirror: string | URL;
};

type MonacoRepos = MonacoPresetRepos & {
  [K in Exclude<string, keyof MonacoPresetRepos>]: string | URL;
};

export const [setupMonacoRepos, monacoRepo] = makeConfigurable<MonacoRepos>({
  jsdelivr: 'https://cdn.jsdelivr.net/npm/',
  unpkg: 'https://unpkg.com/',
  jsdmirror: 'https://cdn.jsdmirror.com/npm/',
});

export const repoUrlOf = (repoName: keyof MonacoRepos, path?: string) => {
  const repo = monacoRepo(repoName);
  if (!repo) {
    throw new Error(
      `Invalid repository '${repoName}'. No valid url was specified.`,
    );
  }
  return new URL(path ?? '', repo);
};

export type MonacoConfiguration = {
  version: string;
  repo: keyof MonacoRepos;
  assetsBaseUrl?: string | URL;
  assetsOf: (path?: string) => URL;
};

const assetsPath = '@react-monaco/assets/assets/';

export const [setupMonaco, monacoConfig] =
  makeConfigurable<MonacoConfiguration>({
    version: '0.52.2',
    repo: 'jsdelivr',
    assetsOf: (path?: string): URL => {
      const base = monacoConfig('assetsBaseUrl');
      if (base) return new URL(path ?? '', base);

      return repoUrlOf(
        monacoConfig('repo'),
        `${assetsPath}${path ? `${path}` : ''}`,
      );
    },
  });

export const monacoAssetsOf = monacoConfig('assetsOf');

export const monacoBaseUrl = (ver = monacoConfig('version')) =>
  monacoAssetsOf(`monaco/${notEmptyStr(ver) ? `${ver}/` : ''}`);
