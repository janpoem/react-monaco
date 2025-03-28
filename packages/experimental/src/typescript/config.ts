import {
  makeConfigurable,
  type MonacoEventsDefinition,
} from '@react-monaco/core';

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
