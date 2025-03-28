import { MenuItem, Select } from '@mui/material';
import { MonacoPresetThemes } from '@react-monaco/core';
import type { MonacoThemeDeclaration } from '@react-monaco/plugin-themes';
import { useMemo } from 'react';

export type ThemeSelectProps = {
  disabled?: boolean;
  themes: MonacoThemeDeclaration[];
  value: string;
  onChange?: (value: string) => void;
};

export const ThemeSelect = ({
  disabled,
  themes,
  value,
  onChange,
}: ThemeSelectProps) => {
  const options = useMemo(() => {
    const items: MonacoThemeDeclaration[] = [];
    for (const [, theme] of Object.entries(MonacoPresetThemes)) {
      items.push({ key: theme.name, name: theme.displayName });
    }
    return items.concat(themes);
  }, [themes]);

  return (
    <Select
      value={value}
      onChange={(ev) => {
        onChange?.(ev.target.value);
      }}
      disabled={disabled}
    >
      {options.map((it) => (
        <MenuItem key={it.key} value={it.key}>
          {it.name}
        </MenuItem>
      ))}
    </Select>
  );
};
