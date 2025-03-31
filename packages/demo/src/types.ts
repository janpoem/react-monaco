import type {
  _PresetTextCallback,
  MonacoCodeEditorProps,
  MonacoThemeInput,
} from '@react-monaco/core';

declare module '@react-monaco/core' {
  // @ts-ignore
  interface MonacoTexts {
    tmStatus: _PresetTextCallback<TmStatusParams>;
  }
}

export type TmStatusParams = { active: boolean };

export type SampleStorageData = {
  locale?: string;
  filename?: string;
  theme?: MonacoThemeInput;
  customOptions?: Partial<MonacoCodeEditorProps['options']>;
};

export type NextTheme = {
  name?: string;
  loading: boolean;
};
