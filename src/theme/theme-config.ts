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
      lighter: '#C5CAE9',
      light: '#5C6BC0',
      main: '#1A237E',
      dark: '#0D1559',
      darker: '#060A33',
      contrastText: '#FFFFFF',
    },
    secondary: {
      lighter: '#FFF8E1',
      light: '#FFD54F',
      main: '#F9A825',
      dark: '#F57F17',
      darker: '#E65100',
      contrastText: '#1A237E',
    },
    info: {
      lighter: '#D4EEF9',
      light: '#74C0E8',
      main: '#2F8FC7',
      dark: '#1C6A96',
      darker: '#0E4567',
      contrastText: '#FFFFFF',
    },
    success: {
      lighter: '#D3F5E5',
      light: '#72DBA9',
      main: '#22C55E',
      dark: '#118D47',
      darker: '#065E35',
      contrastText: '#FFFFFF',
    },
    warning: {
      lighter: '#FDEAD3',
      light: '#F5A468',
      main: '#EC671B',
      dark: '#B94E12',
      darker: '#7A3309',
      contrastText: '#FFFFFF',
    },
    error: {
      lighter: '#FFE2E0',
      light: '#FF8A80',
      main: '#E53935',
      dark: '#B71C1C',
      darker: '#7A0C0C',
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
