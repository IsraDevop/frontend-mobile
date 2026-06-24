import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';

const brand = {
  primary: '#208AEF',
  secondary: '#F5A623',
};

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: brand.primary,
    secondary: brand.secondary,
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: brand.primary,
    secondary: brand.secondary,
  },
};
