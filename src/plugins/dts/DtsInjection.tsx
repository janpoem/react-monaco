import { useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import type {
  MonacoModelPrepareParams,
  MonacoMountingParams,
} from '../../monaco';
import { useMonacoProvider } from '../../monaco/_context';
import type { DtsInjectionProps } from './types';
import { parseSourceDeps } from './utils';

const DtsInjection = ({
  baseUrl = 'https://dts.kephp.com/pkg/',
}: DtsInjectionProps) => {
  const isInjectRef = useRef(false);
  const { emitteryRef } = useMonacoProvider();

  const monacoRef = useRef<typeof monaco | undefined>(undefined);
  const libsRecordRef = useRef<Record<string, number>>({});

  const [_libs, setLibs] = useState<Record<string, string>>({});
  // const libsRef = useRef(libs);

  useIsomorphicLayoutEffect(() => {
    if (isInjectRef.current) return;
    isInjectRef.current = true;
    mountDtsInjection();

    return () => {
      isInjectRef.current = false;
      unmountDtsInjection();
      monacoRef.current = undefined;
    };
  }, []);

  return null;

  function onMounting({ monaco }: MonacoMountingParams) {
    monacoRef.current = monaco;
    // init react env
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      jsxFactory: 'React.createElement',
      reactNamespace: 'React',
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      esModuleInterop: true,
      noEmit: true,
    });
  }

  function onPrepareModel({
    language,
    extname,
    input,
  }: MonacoModelPrepareParams) {
    let requireLibs = new Set<string>();
    if (language?.id === 'typescript' || language?.id === 'javascript') {
      if (extname === '.tsx' || extname === '.jsx') {
        requireLibs.add('react');
        requireLibs.add('react/jsx-runtime');
        requireLibs.add('react-dom');
      }
    }

    requireLibs = parseSourceDeps(input.source ?? '', requireLibs);
    fetchDts(Array.from(requireLibs));
  }

  function mountDtsInjection() {
    emitteryRef.current.on('mounting', onMounting);
    emitteryRef.current.on('prepareModel', onPrepareModel);

    // 后续扩展
    // emitteryRef.current.on('changeModel', ({ event }) => {
    // });
  }

  function unmountDtsInjection() {
    emitteryRef.current.off('mounting', onMounting);
    emitteryRef.current.off('prepareModel', onPrepareModel);
  }

  function fetchDts(libs: string[]) {
    if (monacoRef.current == null) return;
    for (const lib of libs) {
      if (libsRecordRef.current[lib] != null) continue;
      const url = new URL(`${lib}`, baseUrl);
      fetch(url, { cache: 'force-cache' })
        .then((resp) =>
          resp.json().then((json) => {
            libsRecordRef.current[lib] = Date.now();
            setLibs((prev) => ({ ...prev, [lib]: url.toString() }));
            monacoRef.current?.languages.typescript.typescriptDefaults.addExtraLib(
              `declare module '${lib}' {
${json.source}
}`,
              `file:///${lib}.d.ts`,
            );
          }),
        )
        .catch(console.error);
    }
  }
};

export default DtsInjection;
