import { Box } from '@mui/material';
import type { ReactNode } from 'react';

export type FootBarProps = {
  children?: ReactNode;
};

export const FootBar = ({ children }: FootBarProps) => {
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      sx={{
        px: '0.5em',
        py: '4px',
        fontSize: '0.85em',
        flex: '0 0 22px',
        lineHeight: '22px',
      }}
      gap={'0.5em'}
    >
      {children}
    </Box>
  );
};
