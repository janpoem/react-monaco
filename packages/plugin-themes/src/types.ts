/// <reference types="monaco-editor/monaco.d.ts" />
import type { MonacoCustomTheme } from '@react-monaco/core';
import type { ComponentType } from 'react';

export type MonacoThemeDeclaration = {
  key: string;
  name: string;
  url?: string | URL;
  theme?: MonacoCustomTheme;
};

export type CreateThemesPluginOptions = {
  baseUrl?: string | URL;
  themes: MonacoThemeDeclaration[];
};

export type ThemesPlugin = {
  themes: MonacoThemeDeclaration[];
  ThemesInjection: ComponentType<ThemeInjectionProps>;
};

export type ThemeOnLoadSuccess = {
  isSuccess: true;
  theme: MonacoCustomTheme;
  isPreload?: boolean;
};

export type ThemeOnLoadFailure = {
  isSuccess: false;
  isPreload?: boolean;
};

export type ThemeInjectionProps = {
  theme?: string;
  debug?: boolean;
  onLoad?: (result: ThemeOnLoadSuccess | ThemeOnLoadFailure) => void;
  loadTheme?: string;
};
