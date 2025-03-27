/// <reference types="monaco-editor/monaco.d.ts" />
declare global {
  interface Window {
    MonacoLocales?: Record<string, unknown> | undefined;
  }
}

export type MonacoLocaleDeclaration = {
  key: string;
  name: string;
};

export type LocaleInjectionProps = {
  baseUrl?: string | URL;
  locale?: string;
  debug?: boolean;
};
