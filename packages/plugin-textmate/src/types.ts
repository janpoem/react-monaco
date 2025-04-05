/// <reference types="monaco-editor/monaco.d.ts" />
import type {
  EventsDelegatorOptions,
  MonacoEventsDefinition,
} from '@react-monaco/core';

export type TextmateActiveLanguage = {
  isActive: boolean;
  languageId: string;
  extname?: string;
  timestamp: number;
};

export type TextmateProvider = {
  url: string | URL;
  // format: 'json' | 'plist';
  languageId: string;
  scopeName?: string;
};

export type TextmateProviderCallback = (
  params: MonacoEventsDefinition['prepareModel'],
) => TextmateProvider | undefined;

export type TextmateFilterCodeSetCallback = (
  code: TextmateCodeSet,
) => TextmateCodeSet;

export type TextmateInjectionProps = EventsDelegatorOptions & {
  onigurumaWasmUrl?: string | URL;
  provider?: TextmateProviderCallback;
  baseUrl?: string | URL;
  onChange?: (state: TextmateActiveLanguage) => void;
  filter?: TextmateFilterCodeSetCallback;
};

export type TextmateScope = {
  scopeName: string;
  tmName: string;
};

export type TextmateCodeSet = {
  isWired: boolean;
  extname?: string;
  language?: monaco.languages.ILanguageExtensionPoint;
  languageId: string;
  provider?: TextmateProvider;
} & TextmateScope;
