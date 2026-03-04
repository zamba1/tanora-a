import type { Theme, Direction, CommonColors, ThemeProviderProps } from '@mui/material/styles';
import type { ThemeCssVariables } from './types';
import type { PaletteColorKey, PaletteColorNoChannels } from './core/palette';

// ----------------------------------------------------------------------

export type ThemeConfig = {
  direction: Direction;
  classesPrefix: string;
  cssVariables: ThemeCssVariables;
  defaultMode: ThemeProviderProps<Theme>['defaultMode'];
  modeStorageKey: ThemeProviderProps<Theme>['modeStorageKey'];
  fontFamily: Record<'primary' | 'secondary', string>;
  palette: Record<PaletteColorKey, PaletteColorNoChannels> & {
    common: Pick<CommonColors, 'black' | 'white'>;
    grey: {
      [K in 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 as `${K}`]: string;
    };
  };
};

export const themeConfig: ThemeConfig = {
  /** **************************************
   * Base
   *************************************** */
  defaultMode: 'light',
  modeStorageKey: 'theme-mode',
  direction: 'ltr',
  classesPrefix: 'minimal',
  /** **************************************
   * Css variables
   *************************************** */
  cssVariables: {
    cssVarPrefix: '',
    colorSchemeSelector: 'data-color-scheme',
  },
  /** **************************************
   * Typography
   *************************************** */
  fontFamily: {
    primary: 'Public Sans Variable',
    secondary: 'Barlow',
  },
  /** **************************************
   * Palette
   *************************************** */
  palette: {
    primary: {
      lighter: '#D4D4D4',
      light: '#525252',
      main: '#1C1C1C',
      dark: '#0F0F0F',
      darker: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      lighter: '#FFFDE7',
      light: '#FFF176',
      main: '#FFED00',
      dark: '#E6D500',
      darker: '#CCBE00',
      contrastText: '#1C1C1C',
    },
    info: {
      lighter: '#E3F2FD',
      light: '#64B5F6',
      main: '#2196F3',
      dark: '#1565C0',
      darker: '#0D47A1',
      contrastText: '#FFFFFF',
    },
    success: {
      lighter: '#E8F5E9',
      light: '#81C784',
      main: '#4CAF50',
      dark: '#2E7D32',
      darker: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    warning: {
      lighter: '#FFF8E1',
      light: '#FFD54F',
      main: '#FFC107',
      dark: '#FF8F00',
      darker: '#E65100',
      contrastText: '#1C1C1C',
    },
    error: {
      lighter: '#FFEBEE',
      light: '#EF9A9A',
      main: '#F44336',
      dark: '#C62828',
      darker: '#B71C1C',
      contrastText: '#FFFFFF',
    },
    grey: {
      50: '#FAFBFC',
      100: '#F5F7FA',
      200: '#EEF1F6',
      300: '#DDE3EB',
      400: '#B8C2CE',
      500: '#8D99A8',
      600: '#5E6D7D',
      700: '#3E4C5C',
      800: '#1E2A36',
      900: '#141D26',
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
  },
};
