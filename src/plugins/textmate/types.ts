import type { MonacoModelPrepareParams } from '../../monaco';

export type TextmateActiveLanguage = {
  isActive: boolean;
  languageId: string;
  extname?: string;
  timestamp: number;
};

export type TextmateInjectionProps = {
  assetKey?: string;
  assetPriority?: number;
  onigasmWasmUrl?: string | URL;
  provider?: TextmateProviderCallback;
  tmBaseUrl?: string | URL;
  onChange?: (state: TextmateActiveLanguage) => void;
};

export type CurrentCodeRef = {
  isWired: boolean;
  extname?: string;
  language?: monaco.languages.ILanguageExtensionPoint;
  languageId: string;
  provider?: TextmateProvider;
};

export type TextmateProvider = {
  url: string | URL;
  format: 'json' | 'plist';
  languageId: string;
};

export type TextmateProviderCallback = (
  params: MonacoModelPrepareParams,
) => TextmateProvider | undefined;
