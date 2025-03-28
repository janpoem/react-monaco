import type { DialogProps } from '@mui/material';
import type { MonacoThemeInput } from '@react-monaco/core';
import type { ReactNode } from 'react';

export type SampleStorageData = {
  locale?: string;
  filename?: string;
  theme?: MonacoThemeInput;
};

export type NextTheme = {
  name?: string;
  loading: boolean;
};

export type OpenDialog = {
  open: boolean;
  title?: string;
  children: ReactNode;
  props?: DialogProps;
};
