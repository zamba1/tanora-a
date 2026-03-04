import type { PaletteColorNoChannels } from '../core';

import { primary, secondary } from '../core/palette';

// ----------------------------------------------------------------------

export type ThemeColorPreset =
  | 'default'
  | 'preset1'
  | 'preset2'
  | 'preset3'
  | 'preset4'
  | 'preset5';

export const primaryColorPresets: Record<ThemeColorPreset, PaletteColorNoChannels> = {
  default: {
    lighter: primary.lighter,
    light: primary.light,
    main: primary.main,
    dark: primary.dark,
    darker: primary.darker,
    contrastText: primary.contrastText,
  },
  preset1: {
    lighter: '#CEDAEC',
    light: '#7591B6',
    main: '#395276',
    dark: '#2A3E5B',
    darker: '#1C2A3D',
    contrastText: '#FFFFFF',
  },
  preset2: {
    lighter: '#FDEAD3',
    light: '#F5A468',
    main: '#EC671B',
    dark: '#B94E12',
    darker: '#7A3309',
    contrastText: '#FFFFFF',
  },
  preset3: {
    lighter: '#D4EEF9',
    light: '#74C0E8',
    main: '#2F8FC7',
    dark: '#1C6A96',
    darker: '#0E4567',
    contrastText: '#FFFFFF',
  },
  preset4: {
    lighter: '#D3F5E5',
    light: '#72DBA9',
    main: '#22C55E',
    dark: '#118D47',
    darker: '#065E35',
    contrastText: '#FFFFFF',
  },
  preset5: {
    lighter: '#FFE2E0',
    light: '#FF8A80',
    main: '#E53935',
    dark: '#B71C1C',
    darker: '#7A0C0C',
    contrastText: '#FFFFFF',
  },
};

export const secondaryColorPresets: Record<ThemeColorPreset, PaletteColorNoChannels> = {
  default: {
    lighter: secondary.lighter,
    light: secondary.light,
    main: secondary.main,
    dark: secondary.dark,
    darker: secondary.darker,
    contrastText: secondary.contrastText,
  },
  preset1: {
    lighter: '#C8EDDF',
    light: '#3DA87E',
    main: '#087557',
    dark: '#065A43',
    darker: '#043D2E',
    contrastText: '#FFFFFF',
  },
  preset2: {
    lighter: '#FDEAD3',
    light: '#F5A468',
    main: '#EC671B',
    dark: '#B94E12',
    darker: '#7A3309',
    contrastText: '#FFFFFF',
  },
  preset3: {
    lighter: '#D4EEF9',
    light: '#74C0E8',
    main: '#2F8FC7',
    dark: '#1C6A96',
    darker: '#0E4567',
    contrastText: '#FFFFFF',
  },
  preset4: {
    lighter: '#D3F5E5',
    light: '#72DBA9',
    main: '#22C55E',
    dark: '#118D47',
    darker: '#065E35',
    contrastText: '#FFFFFF',
  },
  preset5: {
    lighter: '#FFE2E0',
    light: '#FF8A80',
    main: '#E53935',
    dark: '#B71C1C',
    darker: '#7A0C0C',
    contrastText: '#FFFFFF',
  },
};
