/// <reference types="monaco-editor/monaco.d.ts" />
import type { MonacoEventsDefinition } from '@react-monaco/core';

export type TextmateActiveLanguage = {
  isActive: boolean;
  languageId: string;
  extname?: string;
  timestamp: number;
};

export type TextmateProvider = {
  url: string | URL;
  format: 'json' | 'plist';
  languageId: string;
};

export type TextmateProviderCallback = (
  params: MonacoEventsDefinition['prepareModel'],
) => TextmateProvider | undefined;

export type TextmateInjectionProps = {
  onigasmWasmUrl?: string | URL;
  onigasmJsUrl?: string | URL;
  provider?: TextmateProviderCallback;
  tmBaseUrl?: string | URL;
  onChange?: (state: TextmateActiveLanguage) => void;
};

export type CurrentCode = {
  isWired: boolean;
  extname?: string;
  language?: monaco.languages.ILanguageExtensionPoint;
  languageId: string;
  provider?: TextmateProvider;
};
