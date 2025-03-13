import { CssBaseline, ThemeProvider } from '@mui/material';
import { type ReactNode, useMemo } from 'react';
import { createTheme } from './theme';

export type MuiWrapperProps = {
  children: ReactNode;
};

export const MuiWrapper = ({ children }: MuiWrapperProps) => {
  const theme = useMemo(() => createTheme(false), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
