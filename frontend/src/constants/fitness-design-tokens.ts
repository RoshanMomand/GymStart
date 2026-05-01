/**
 * Fitness App Design Tokens
 * Colors, spacing, typography for onboarding and app
 */
import {ThemeContext} from "@react-navigation/core";

export const FitnessPalette = {
  background: '#0D0D0D',
  cardBg: '#1A1A1A',
  primary: 'rgba(74,222,128,0.75)',
  primaryDark: '#6D28D9',
  primaryLight: '#A78BFA',
  secondary: '#9333EA',
  text: {
    primary: '#FFFFFF',
    secondary: '#A3A3A3',
    tertiary: '#6B7280',
  },
  border: '#333333',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
};

export const FitnessSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FitnessTypography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
};
