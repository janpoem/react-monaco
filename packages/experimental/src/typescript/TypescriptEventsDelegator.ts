import {
  BaseEventsDelegator,
  type MonacoEventsDefinition,
} from '@react-monaco/core';
import { tsConfig } from './config';
import type { TypescriptInjectionProps } from './types';
import { parseSourceDeps } from './utils';

export class TypescriptEventsDelegator extends BaseEventsDelegator<MonacoEventsDefinition> {
  loadedLibs: Record<string, number> = {};

  constructor(public readonly props: TypescriptInjectionProps) {
    super();
    this.register('mounting').register('prepareModel');
  }

  get dtsBaseUrl() {
    return this.props.dtsBaseUrl || tsConfig('dtsBaseUrl');
  }

  mounting = (params: MonacoEventsDefinition['mounting']) => {
    (this.props.mounting || tsConfig('mounting'))(params);
    this.isDebug && console.log('Typescript: mounting');
  };

  prepareModel = ({
    language,
    extname,
    input,
  }: MonacoEventsDefinition['prepareModel']) => {
    let libs = new Set<string>();
    if (language?.id === 'typescript' || language?.id === 'javascript') {
      if (extname === '.tsx' || extname === '.jsx') {
        libs.add('react');
        libs.add('react/jsx-runtime');
        libs.add('react-dom');
      }
    }
    libs = parseSourceDeps(input.source ?? '', libs);
    this.fetchDts(Array.from(libs));
  };

  fetchDts = (libs: string[]) => {
    if (typeof monaco === 'undefined') return;
    for (const lib of libs) {
      if (this.loadedLibs[lib] != null) continue;
      const url = new URL(`${lib}`, this.dtsBaseUrl);
      fetch(url, { cache: 'force-cache' })
        .then((resp) =>
          resp.json().then((json) => {
            this.loadedLibs[lib] = Date.now();
            monaco.languages.typescript.typescriptDefaults.addExtraLib(
              `declare module '${lib}' {
${json.source}
}`,
              `file:///${lib}.d.ts`,
            );
          }),
        )
        .catch(console.error);
    }
  };
}
