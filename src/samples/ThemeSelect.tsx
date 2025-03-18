// theme select 作为示例组件，不作为默认提供
// monaco 内置的主题为：vs/vs-dark/hc-light/hc-black
// export type BuiltinTheme = 'vs' | 'vs-dark' | 'hc-black' | 'hc-light';
// 作为示例项目，将会默认内置若干主题，但这并不是 monaco 默认的官方内容，所以不放在 monaco 的目录下

import { MenuItem, Select } from '@mui/material';
import { notEmptyStr } from '@zenstone/ts-utils/string';
import { useMemo } from 'react';
import type { MonacoCustomTheme, MonacoThemeColors } from '../monaco';
import hcBlack from '../plugins/themes/hc-black';
import hcLight from '../plugins/themes/hc-light';
import vs from '../plugins/themes/vs';
import vsDark from '../plugins/themes/vs-dark';
import atomMaterialTheme from './themes/atom-material-theme';
import atomOneLight from './themes/atom-one-light';
import atomize from './themes/atomize';
import csbDefault from './themes/csb-default';
import githubLight from './themes/github-light';
import webstormDarcula from './themes/webstorm-darcula';
import webstormDark from './themes/webstorm-dark';

const system = 'system';
const themes = [
  vs,
  vsDark,
  atomOneLight,
  atomize,
  atomMaterialTheme,
  githubLight,
  webstormDark,
  webstormDarcula,
  csbDefault,
  hcLight,
  hcBlack,
];

export type ThemeSelectProps = {
  value?: string;
  onChange?: (value?: string) => void;
};

export const ThemeSelect = ({ value: iValue, onChange }: ThemeSelectProps) => {
  const value = useMemo(() => filterThemeName(iValue), [iValue]);

  return (
    <Select
      value={value}
      onChange={(ev) => {
        const next = ev.target.value;
        onChange?.(next === system ? undefined : next);
      }}
    >
      <MenuItem value={system}>System</MenuItem>
      {themes.map((it) => (
        <MenuItem key={it.name} value={it.name}>
          {it.displayName}
        </MenuItem>
      ))}
    </Select>
  );
};

export const filterThemeName = (name?: string) => {
  if (!name) return system;
  const it = themes.find((it) => it.name === name);
  return it?.name ?? system;
};

export const isBuiltinTheme = (name: string) =>
  ['vs', 'vs-dark', 'hc-black', 'hc-light'].includes(name.toLowerCase());

export const getCustomTheme = (
  name: string | undefined,
  mqDark: boolean,
): [MonacoCustomTheme, MonacoThemeColors] => {
  let it: MonacoCustomTheme | undefined;
  if (notEmptyStr(name)) it = themes.find((it) => it.name === name);
  if (it == null) {
    it = mqDark ? vsDark : vs;
  }

  const colors: MonacoThemeColors = Object.assign(
    {},
    it.isDark ? vsDark.colors : vs.colors,
    it.colors,
  );

  return [it, colors];
};

// export const completeColors = (theme?: MonacoCustomTheme) => {
//
// }
