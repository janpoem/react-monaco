import { globalMonaco, type MonacoTheme, type MonacoThemeFn } from '../monaco';
import clouds from './clouds';
import cloudsMidnight from './clouds-midnight';
import github from './github';
import githubDark from './github-dark';
import oceanicNext from './oceanic-next';
import pastelsOnDark from './pastels-on-dark';
import tomorrow from './tomorrow';
import tomorrowNight from './tomorrow-night';

const customThemes: Record<string, MonacoThemeFn> = {
  github: () => github(),
  'github-dark': () => githubDark(),
  tomorrow: () => tomorrow(),
  'tomorrow-night': () => tomorrowNight(),
  clouds: () => clouds(),
  'clouds-midnight': () => cloudsMidnight(),
  'pastels-on-dark': () => pastelsOnDark(),
  'oceanic-next': () => oceanicNext(),
};

export const customThemesKeys = Object.keys(customThemes);

const darkThemes: Record<string, boolean> = {};

const initCustomThemes: Record<string, boolean> = {};

export const isDarkMonacoTheme = (theme: string): boolean => {
  if (theme === 'vs-dark') return true;
  return darkThemes[theme];
};

export const getCustomTheme = (name: string): MonacoTheme | undefined => {
  if (customThemes[name] != null) {
    const theme = customThemes[name]();
    darkThemes[theme.name] = !!theme.isDark;
    const _monaco = globalMonaco();
    if (_monaco) {
      setupTheme(_monaco, theme);
    }
    return theme;
  }
};

export const setupTheme = (_monaco: typeof monaco, theme?: MonacoTheme) => {
  if (theme == null) return;
  if (initCustomThemes[theme.name]) return;
  const { name, isDark, data } = theme;
  darkThemes[name] = !!isDark;
  _monaco.editor.defineTheme(name, data);
};
