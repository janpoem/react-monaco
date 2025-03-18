/// <reference types="@rsbuild/core/types" />
/// <reference types="monaco-editor/monaco.d.ts" />
/// <reference types="monaco-editor/monaco.d.ts" />

declare global {
  import JSONEditor from 'jsoneditor';

  export { JSONEditor };
}

declare interface Window {
  JSONEditor?: JSONEditor;
}
