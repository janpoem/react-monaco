/// <reference types="monaco-editor/monaco.d.ts" />
import type { MonacoEventsDefinition } from '@react-monaco/core';

export type TypescriptInjectionProps = {
  dtsBaseUrl?: string | URL;
  debug?: boolean;
  mounting?: (params: MonacoEventsDefinition['mounting']) => void;
};
