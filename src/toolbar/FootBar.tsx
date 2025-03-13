import { Box, useTheme } from '@mui/material';
import type { ReactNode } from 'react';

export type FootBarProps = {
  children?: ReactNode;
};

export const FootBar = ({ children }: FootBarProps) => {
  const { palette } = useTheme();
  return (
    <Box
      display={'flex'}
      sx={{ px: '0.5em', py: '4px', borderTop: `1px solid ${palette.divider}` }}
      gap={'0.5em'}
    >
      {children}
    </Box>
  );
};
