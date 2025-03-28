import type { MonacoThemeInput } from '@react-monaco/core';
import type {
  MonacoUserCustomOptions,
} from './presets/MonacoUserCustomOptions';

export type SampleStorageData = {
  locale?: string;
  filename?: string;
  theme?: MonacoThemeInput;
  customOptions?: Partial<MonacoUserCustomOptions>;
};

export type NextTheme = {
  name?: string;
  loading: boolean;
};
