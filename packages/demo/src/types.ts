import type {
  MonacoCodeEditorProps,
  MonacoThemeInput,
} from '@react-monaco/core';
import type { PresetTextCallback } from '@zenstone/preset-provider';

declare module '@react-monaco/core' {
  // @ts-ignore
  interface MonacoPresetTexts {
    tmStatus: PresetTextCallback<TmStatusParams>;
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
