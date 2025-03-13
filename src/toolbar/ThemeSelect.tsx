import { MenuItem, Select } from '@mui/material';
import { customThemesKeys } from '../themes';

export type ThemeSelectProps = {
  value?: string;
  onChange?: (value?: string) => void;
};

const system = 'system';

const options = [system, 'vs-light', 'vs-dark', ...customThemesKeys];

export const ThemeSelect = ({ value, onChange }: ThemeSelectProps) => {
  return (
    <Select
      value={value || system}
      onChange={(ev) => {
        const value = ev.target.value;
        onChange?.(value === system ? undefined : value);
      }}
    >
      {options.map((it) => (
        <MenuItem key={it} value={it}>
          {it}
        </MenuItem>
      ))}
    </Select>
  );
};
