import { MenuItem, Select } from '@mui/material';
import { MonacoLocales } from '@react-monaco/plugin-locale';
import { useMemo } from 'react';

const defaultValue = 'default';

export type LocaleSelectProps = {
  value?: string;
  onChange?: (value?: string) => void;
};

export const LocaleSelect = ({ value, onChange }: LocaleSelectProps) => {
  const internalValue = useMemo(() => {
    const it = MonacoLocales.find((it) => it.key === value);
    return it?.key ?? defaultValue;
  }, [value]);

  return (
    <Select
      value={internalValue}
      onChange={(ev) => {
        onChange?.(
          ev.target.value === defaultValue ? undefined : ev.target.value,
        );
      }}
    >
      <MenuItem value={defaultValue}>Default</MenuItem>
      {MonacoLocales.map((it) => (
        <MenuItem key={it.key} value={it.key}>
          {it.name}
        </MenuItem>
      ))}
    </Select>
  );
};
