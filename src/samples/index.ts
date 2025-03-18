import { lazy } from 'react';
import CodeEditorSample from './CodeEditorSample';

const ThemeConverter = lazy(() => import('./ThemeConverter'));

export { CodeEditorSample, ThemeConverter };
