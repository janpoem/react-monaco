import { MenuItem, Select } from '@mui/material';

export type LocaleSelectProps = {
  value?: string;
  onChange?: (value: string) => void;
};

export const LocaleSelect = ({ value, onChange }: LocaleSelectProps) => {
  return (
    <Select
      value={value || 'en'}
      onChange={(ev) => {
        onChange?.(ev.target.value);
      }}
    >
      <MenuItem value={'en'}>English</MenuItem>
      <MenuItem value={'zh-cn'}>简体中文</MenuItem>
    </Select>
  );
};
