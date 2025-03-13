import { createTheme as muiCreateTheme } from '@mui/material';
import { grey } from '@mui/material/colors';

export const createTheme = (darkMode: boolean) =>
  muiCreateTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      text: {
        primary: darkMode ? grey[400] : grey[700],
        secondary: grey[500],
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
      fontSize: 12,
      button: {
        textTransform: 'none',
      },
    },
  });
