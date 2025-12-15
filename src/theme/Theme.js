import merge from 'lodash/merge';
import { createTheme } from '@mui/material/styles';
import { CustomizerContext } from '../components/context/CustomizerContext';
import { useContext, useEffect } from 'react';

import components from './Components';
import typography from './Typography';
import { shadows, darkshadows } from './Shadows';
import { DarkThemeColors } from './DarkThemeColors';
import { LightThemeColors } from './LightThemeColors';
import * as locales from '@mui/material/locale';
import { baseDarkTheme, baselightTheme } from './DefaultColors';

/**
 * Generate MUI theme based on config
 */
export const BuildTheme = ({ theme: themeName, direction, mode, borderRadius, language }) => {
  const themeOptions = LightThemeColors.find((theme) => theme.name === themeName);
  const darkThemeOptions = DarkThemeColors.find((theme) => theme.name === themeName);

  const defaultTheme = mode === 'dark' ? baseDarkTheme : baselightTheme;
  const defaultShadow = mode === 'dark' ? darkshadows : shadows;
  const themeSelect = mode === 'dark' ? darkThemeOptions : themeOptions;

  const baseConfig = {
    palette: {
      mode,
    },
    shape: {
      borderRadius,
    },
    shadows: defaultShadow,
    typography,
  };

  const theme = createTheme(
    merge({}, baseConfig, defaultTheme, locales[language], themeSelect, {
      direction,
    }),
  );

  theme.components = components(theme);
  return theme;
};

/**
 * Hook to create theme from context
 */
export const ThemeSettings = () => {
  const { activeTheme, activeDir, activeMode, isBorderRadius, isLanguage } = useContext(CustomizerContext);

  const theme = BuildTheme({
    direction: activeDir,
    theme: activeTheme,
    mode: activeMode,
    borderRadius: isBorderRadius,
    language: isLanguage,
  });

  useEffect(() => {
    document.dir = activeDir;
  }, [activeDir]);

  return theme;
};
