import { Box, useTheme } from '@mui/material';
import type { ReactNode } from 'react';

export type TopBarProps = {
  children?: ReactNode;
};

export const TopBar = ({ children }: TopBarProps) => {
  const { palette } = useTheme();
  return (
    <Box
      display={'flex'}
      gap={'4px'}
      alignItems={'center'}
      sx={{
        p: '4px',
        borderBottom: `1px solid ${palette.divider}`,
      }}
    >
      {children}
    </Box>
  );
};
