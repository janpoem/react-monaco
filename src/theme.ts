import { createTheme as muiCreateTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import type { MonacoThemeColor } from './monaco';

export const createTheme = (
  darkMode: boolean,
  { primary, background, text }: MonacoThemeColor,
) =>
  muiCreateTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: primary,
      },
      text: {
        primary: text,
        secondary: grey[500],
      },
      background: {
        default: background,
        paper: background,
      },
    },
    spacing: 2,
    shape: {
      borderRadius: 4,
    },
    components: {
      MuiButton: {
        defaultProps: {
          variant: 'contained',
          size: 'small',
        },
      },
      MuiSelect: {
        defaultProps: {
          // variant: 'standard',
          size: 'small',
          MenuProps: {
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
          },
        },
      },
    },
    typography: {
      fontSize: 14,
      htmlFontSize: 16,
      button: {
        textTransform: 'none',
      },
    },
  });
