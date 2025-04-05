/// <reference types="monaco-editor/monaco.d.ts" />
import type { EventsDelegatorOptions } from '@react-monaco/core';

declare global {
  interface Window {
    MonacoLocales?: Record<string, unknown> | undefined;
  }
}

export type MonacoLocaleDeclaration = {
  key: string;
  name: string;
};

export type LocaleInjectionProps = EventsDelegatorOptions & {
  baseUrl?: string | URL;
  locale?: string;
};
