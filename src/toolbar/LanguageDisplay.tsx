import { Typography, useTheme } from '@mui/material';

export type LanguageDisplayProps = {
  value: string;
};

export const LanguageDisplay = ({ value }: LanguageDisplayProps) => {
  const { palette } = useTheme();

  return (
    <Typography
      sx={{
        fontSize: '0.85em',
        color: palette.action.active,
        userSelect: 'none',
      }}
    >
      {value}
    </Typography>
  );
};
