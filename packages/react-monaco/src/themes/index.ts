import { isInferObj, notEmptyStr } from '@zenstone/ts-utils';
import type {
  _ItOrCallback,
  MonacoCustomTheme,
  MonacoThemeColors,
  MonacoThemeInput,
  MonacoThemeSkeleton,
} from '../types';
import hcBlack from './hc-black';
import hcLight from './hc-light';
import vs from './vs';
import vsDark from './vs-dark';

export const MonacoPresetThemes = {
  vs: vs,
  'vs-dark': vsDark,
  'hc-light': hcLight,
  'hc-black': hcBlack,
} as const;

export const isMonacoBuiltinTheme = (
  name: string,
): name is keyof typeof MonacoPresetThemes => name in MonacoPresetThemes;

// 如果没有媒体查询，则默认视为 light
const mqColorSchemeDark = () =>
  'matchMedia' in window
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;

const completeThemeColors = (
  isDark: boolean,
  colors?: Partial<MonacoThemeColors>,
): MonacoThemeColors => ({
  ...MonacoPresetThemes[isDark ? 'vs-dark' : 'vs'].colors,
  ...(colors ?? {}),
});

export const revertMonacoThemeSkeleton = (
  input: _ItOrCallback<MonacoThemeInput>,
): MonacoThemeSkeleton => {
  const _input = typeof input === 'function' ? input() : input;
  if (_input == null) {
    return revertMonacoThemeSkeleton({});
  }
  if (typeof _input === 'string') {
    return revertMonacoThemeSkeleton({ name: _input.trim() });
  }
  if (typeof _input === 'boolean') {
    return revertMonacoThemeSkeleton({ isDark: _input });
  }

  let { name, isDark, colors } = _input;

  if (notEmptyStr(name)) {
    if (isMonacoBuiltinTheme(name)) {
      isDark = MonacoPresetThemes[name].isDark;
      colors = colors
        ? {
            ...MonacoPresetThemes[name].colors,
            ...colors,
          }
        : MonacoPresetThemes[name].colors;
    }
  }
  if (isDark == null) {
    isDark = mqColorSchemeDark();
  }
  if (!name) {
    name = isDark ? 'vs-dark' : 'vs';
  }

  return {
    name,
    isDark,
    colors: completeThemeColors(isDark, colors),
  };
};

export const isMonacoCustomTheme = (obj: unknown) =>
  isInferObj<MonacoCustomTheme>(
    obj,
    (it) =>
      notEmptyStr(it.name) &&
      'isDark' in it &&
      typeof it.isDark === 'boolean' &&
      isMonacoThemeData(it.data),
  );

export const isMonacoThemeData = (obj: unknown) =>
  isInferObj<monaco.editor.IStandaloneThemeData>(
    obj,
    (it) =>
      notEmptyStr(it.base) &&
      Array.isArray(it.rules) &&
      it.rules.length > 0 &&
      isInferObj(it.colors),
  );
