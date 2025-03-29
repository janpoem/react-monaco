import {
  BaseEventsDelegator,
  makeConfigurable,
  type MonacoEventsDefinition,
  useMonaco,
} from '@react-monaco/core';
import { useLayoutEffect, useRef } from 'react';

export type TypescriptInjectionProps = {
  dtsBaseUrl?: string | URL;
  oxcParserWasmUrl?: string | URL;
  debug?: boolean;
  mounting?: (params: MonacoEventsDefinition['mounting']) => void;
};

export const [setupTypescript, tsConfig] = makeConfigurable({
  dtsBaseUrl: 'https://dts.kephp.com/pkg/',
  mounting: ({ monaco }: MonacoEventsDefinition['mounting']) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      // jsxFactory: 'React.createElement',
      // reactNamespace: 'React',
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      esModuleInterop: true,
      noEmit: true,
    });
  },
});

export const TypescriptInjection = (props: TypescriptInjectionProps) => {
  const { emitterRef, setError } = useMonaco();
  const delegatorRef = useRef<TypescriptEventsDelegator>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useLayoutEffect(() => {
    try {
      delegatorRef.current = new TypescriptEventsDelegator(props);
      delegatorRef.current.setOptions({
        debug: props.debug,
      });
      delegatorRef.current.inject(emitterRef.current);
    } catch (err) {
      setError(err);
    }

    return () => {
      delegatorRef.current?.eject(emitterRef.current);
      delegatorRef.current = null;
    };
  }, []);

  return null;
};

export class TypescriptEventsDelegator extends BaseEventsDelegator<MonacoEventsDefinition> {
  loadedLibs: Record<string, number> = {};

  constructor(public readonly props: TypescriptInjectionProps) {
    super();
    this.register('prepareAssets')
      .register('mounting')
      .register('prepareModel');
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
    const languageId = language?.id;
    if (languageId !== 'typescript' && languageId !== 'javascript') return;

    let libs = new Set<string>();

    if (extname === '.tsx' || extname === '.jsx') {
      libs.add('react');
      libs.add('react/jsx-runtime');
      libs.add('react-dom');
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

const getImportPattern = () =>
  /^(?:(import|export) .*|\})? from [\'\"]([^\"\']+)[\'\"];?$/gm;

export const parseSourceDeps = (source: string, libs: Set<string>) => {
  // 暂时这里先用粗暴的正则表达式
  const matches = source.matchAll(getImportPattern());

  for (const match of matches) {
    if (match[2] && !match[2].startsWith('.')) {
      libs.add(match[2]);
    }
  }

  return libs;
};
