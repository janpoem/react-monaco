import { Box, useTheme } from '@mui/material';
import { fontMonospace } from '../preset';

export type LanguageDisplayProps = {
  value: string;
};

export const LanguageDisplay = ({ value }: LanguageDisplayProps) => {
  const { palette } = useTheme();

  return (
    <Box
      sx={{
        color: palette.primary[palette.mode],
        fontFamily: fontMonospace,
        userSelect: 'none',
        textTransform: 'capitalize',
        letterSpacing: '-0.065em',
      }}
    >
      {value}
    </Box>
  );
};
