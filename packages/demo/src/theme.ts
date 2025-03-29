import { createTheme as muiCreateTheme } from '@mui/material';
import type { MonacoThemeColors } from '@react-monaco/core';

export const createTheme = (
  darkMode: boolean,
  {
    primary,
    secondary,
    success,
    error,
    background,
    text,
    borderColor,
  }: MonacoThemeColors,
) =>
  muiCreateTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: primary,
      },
      secondary: {
        main: secondary,
      },
      text: {
        primary: text,
      },
      success: {
        main: success,
      },
      error: {
        main: error,
      },
      divider: borderColor,
      background: {
        default: background,
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
      fontFamily: 'var(--font-sans)',
      button: {
        textTransform: 'none',
      },
    },
  });
