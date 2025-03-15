import {
  globalMonaco,
  type MonacoCustomTheme,
  type MonacoCustomThemeFn,
  type MonacoThemeColor,
} from '../monaco';
import clouds from './clouds';
import cloudsMidnight from './clouds-midnight';
import github from './github';
import githubDark from './github-dark';
import oceanicNext from './oceanic-next';
import pastelsOnDark from './pastels-on-dark';
import tomorrow from './tomorrow';
import tomorrowNight from './tomorrow-night';

const customThemes: Record<string, MonacoCustomThemeFn> = {
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

const themeColors: Record<string, MonacoThemeColor> = {
  'vs-light': {
    primary: '#0000ff',
    background: 'rgb(253, 253, 253)',
    text: '#333',
  },
  'vs-dark': {
    primary: '#569cd6',
    background: 'rgb(30, 30, 30)',
    text: '#dadada',
  },
};

const initCustomThemes: Record<string, boolean> = {};

export const isDarkMonacoTheme = (theme: string): boolean => {
  if (theme === 'vs-dark') return true;
  return darkThemes[theme];
};

export const getThemeColor = (
  name: string,
  isDark?: boolean,
): MonacoThemeColor => {
  if (customThemes[name] && themeColors[name] == null) {
    const tpl = themeColors[isDark ? 'vs-dark' : 'vs-light'];
    const color = customThemes[name]().color;
    if (typeof color === 'string') {
      return Object.assign({}, tpl, { primary: color });
    }
    return Object.assign({}, tpl, color);
  }
  return themeColors[name] ?? themeColors[isDark ? 'vs-dark' : 'vs-light'];
};

export const getCustomTheme = (name: string): MonacoCustomTheme | undefined => {
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

export const setupTheme = (
  _monaco: typeof monaco,
  theme?: MonacoCustomTheme,
) => {
  if (theme == null) return;
  if (initCustomThemes[theme.name]) return;
  const { name, isDark, data, color } = theme;
  darkThemes[name] = !!isDark;
  if (color != null) {
    const tpl = themeColors[isDark ? 'vs-dark' : 'vs-light'];
    if (typeof color === 'string') {
      themeColors[name] = Object.assign({}, tpl, { primary: color });
    } else {
      themeColors[name] = Object.assign({}, tpl, color);
    }
  }
  _monaco.editor.defineTheme(name, data);
};
