/**
 * Material Design 3 Design Tokens
 * This file defines all design tokens used throughout the application
 * Following Material Design 3 specifications
 */

export interface MD3ColorTokens {
  // Primary colors
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  // Secondary colors
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  // Tertiary colors
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  // Error colors
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  // Surface colors
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;

  // Surface containers
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;

  // Outline colors
  outline: string;
  outlineVariant: string;

  // Inverse and special colors
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  shadow: string;
  scrim: string;
  surfaceTint: string;
}

export interface MD3TypographyTokens {
  // Display
  displayLarge: {
    font: string;
    size: string;
    weight: number;
    lineHeight: string;
    tracking: string;
  };
  displayMedium: {
    font: string;
    size: string;
    weight: number;
    lineHeight: string;
    tracking: string;
  };
  displaySmall: {
    font: string;
    size: string;
    weight: number;
    lineHeight: string;
    tracking: string;
  };

  // Headline
  headlineLarge: {
    font: string;
    size: string;
    weight: number;
    lineHeight: string;
    tracking: string;
  };
  headlineMedium: {
    font: string;
    size: string;
    weight: number;
    lineHeight: string;
    tracking: string;
  };
  headlineSmall: {
    font: string;
    size: string;
    weight: number;
    lineHeight: string;
    tracking: string;
  };

  // Title
  titleLarge: {
    font: string;
    size: string;
    weight: number;
    lineHeight: string;
    tracking: string;
  };
  titleMedium: {
    font: string;
    size: string;
    weight: number;
    lineHeight: string;
    tracking: string;
  };
  titleSmall: {
    font: string;
    size: string;
    weight: number;
    lineHeight: string;
    tracking: string;
  };

  // Body
  bodyLarge: {
    font: string;
    size: string;
    weight: number;
    lineHeight: string;
    tracking: string;
  };
  bodyMedium: {
    font: string;
    size: string;
    weight: number;
    lineHeight: string;
    tracking: string;
  };
  bodySmall: {
    font: string;
    size: string;
    weight: number;
    lineHeight: string;
    tracking: string;
  };

  // Label
  labelLarge: {
    font: string;
    size: string;
    weight: number;
    lineHeight: string;
    tracking: string;
  };
  labelMedium: {
    font: string;
    size: string;
    weight: number;
    lineHeight: string;
    tracking: string;
  };
  labelSmall: {
    font: string;
    size: string;
    weight: number;
    lineHeight: string;
    tracking: string;
  };
}

export interface MD3ElevationTokens {
  level0: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  level5: string;
}

export interface MD3MotionTokens {
  easing: {
    emphasized: string;
    emphasizedDecelerate: string;
    emphasizedAccelerate: string;
    standard: string;
    standardDecelerate: string;
    standardAccelerate: string;
    legacy: string;
  };
  duration: {
    short1: string;
    short2: string;
    short3: string;
    short4: string;
    medium1: string;
    medium2: string;
    medium3: string;
    medium4: string;
    long1: string;
    long2: string;
    long3: string;
    long4: string;
    extraLong1: string;
    extraLong2: string;
    extraLong3: string;
    extraLong4: string;
  };
}

export interface MD3ShapeTokens {
  cornerNone: string;
  cornerExtraSmall: string;
  cornerSmall: string;
  cornerMedium: string;
  cornerLarge: string;
  cornerExtraLarge: string;
  cornerFull: string;
}

export interface MD3StateTokens {
  hoverStateLayerOpacity: number;
  focusStateLayerOpacity: number;
  pressedStateLayerOpacity: number;
  draggedStateLayerOpacity: number;
  disabledOpacity: number;
  focusIndicatorOpacity: number;
}

export interface MD3SpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface MD3SizeTokens {
  touchTarget: string;
  iconSmall: string;
  iconMedium: string;
  iconLarge: string;
}

export interface MD3Tokens {
  colors: {
    light: MD3ColorTokens;
    dark: MD3ColorTokens;
  };
  typography: MD3TypographyTokens;
  elevation: MD3ElevationTokens;
  motion: MD3MotionTokens;
  shape: MD3ShapeTokens;
  state: MD3StateTokens;
  spacing: MD3SpacingTokens;
  size: MD3SizeTokens;
}

// Light theme colors
export const lightColors: MD3ColorTokens = {
  primary: '#6750a4',
  onPrimary: '#ffffff',
  primaryContainer: '#eaddff',
  onPrimaryContainer: '#21005d',

  secondary: '#625b71',
  onSecondary: '#ffffff',
  secondaryContainer: '#e8def8',
  onSecondaryContainer: '#1d192b',

  tertiary: '#7d5260',
  onTertiary: '#ffffff',
  tertiaryContainer: '#ffd8e4',
  onTertiaryContainer: '#31111d',

  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#410002',

  background: '#fffbff',
  onBackground: '#1c1b1f',
  surface: '#fffbff',
  onSurface: '#1c1b1f',
  surfaceVariant: '#e7e0ec',
  onSurfaceVariant: '#49454f',

  surfaceDim: '#ded8e1',
  surfaceBright: '#fffbff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f7f2fa',
  surfaceContainer: '#f3edf7',
  surfaceContainerHigh: '#ece6f0',
  surfaceContainerHighest: '#e6e0e9',

  outline: '#79747e',
  outlineVariant: '#cac4d0',

  inverseSurface: '#313033',
  inverseOnSurface: '#f4eff4',
  inversePrimary: '#d0bcff',
  shadow: '#000000',
  scrim: '#000000',
  surfaceTint: '#6750a4',
};

// Dark theme colors
export const darkColors: MD3ColorTokens = {
  primary: '#d0bcff',
  onPrimary: '#381e72',
  primaryContainer: '#4f378b',
  onPrimaryContainer: '#eaddff',

  secondary: '#ccc2dc',
  onSecondary: '#332d41',
  secondaryContainer: '#4a4458',
  onSecondaryContainer: '#e8def8',

  tertiary: '#efb8c8',
  onTertiary: '#492532',
  tertiaryContainer: '#633b48',
  onTertiaryContainer: '#ffd8e4',

  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',

  background: '#101014',
  onBackground: '#e6e1e5',
  surface: '#101014',
  onSurface: '#e6e1e5',
  surfaceVariant: '#49454f',
  onSurfaceVariant: '#cac4d0',

  surfaceDim: '#101014',
  surfaceBright: '#36363b',
  surfaceContainerLowest: '#0b0b0f',
  surfaceContainerLow: '#1c1b1f',
  surfaceContainer: '#201f23',
  surfaceContainerHigh: '#2b2a2e',
  surfaceContainerHighest: '#363539',

  outline: '#938f99',
  outlineVariant: '#49454f',

  inverseSurface: '#e6e1e5',
  inverseOnSurface: '#313033',
  inversePrimary: '#6750a4',
  shadow: '#000000',
  scrim: '#000000',
  surfaceTint: '#d0bcff',
};

// Typography tokens
export const typography: MD3TypographyTokens = {
  displayLarge: {
    font: "'Roboto', system-ui, sans-serif",
    size: '3.5625rem', // 57px
    weight: 400,
    lineHeight: '4rem', // 64px
    tracking: '-0.25px',
  },
  displayMedium: {
    font: "'Roboto', system-ui, sans-serif",
    size: '2.8125rem', // 45px
    weight: 400,
    lineHeight: '3.25rem', // 52px
    tracking: '0px',
  },
  displaySmall: {
    font: "'Roboto', system-ui, sans-serif",
    size: '2.25rem', // 36px
    weight: 400,
    lineHeight: '2.75rem', // 44px
    tracking: '0px',
  },

  headlineLarge: {
    font: "'Roboto', system-ui, sans-serif",
    size: '2rem', // 32px
    weight: 400,
    lineHeight: '2.5rem', // 40px
    tracking: '0px',
  },
  headlineMedium: {
    font: "'Roboto', system-ui, sans-serif",
    size: '1.75rem', // 28px
    weight: 400,
    lineHeight: '2.25rem', // 36px
    tracking: '0px',
  },
  headlineSmall: {
    font: "'Roboto', system-ui, sans-serif",
    size: '1.5rem', // 24px
    weight: 400,
    lineHeight: '2rem', // 32px
    tracking: '0px',
  },

  titleLarge: {
    font: "'Roboto', system-ui, sans-serif",
    size: '1.375rem', // 22px
    weight: 400,
    lineHeight: '1.75rem', // 28px
    tracking: '0px',
  },
  titleMedium: {
    font: "'Roboto', system-ui, sans-serif",
    size: '1rem', // 16px
    weight: 500,
    lineHeight: '1.5rem', // 24px
    tracking: '0.15px',
  },
  titleSmall: {
    font: "'Roboto', system-ui, sans-serif",
    size: '0.875rem', // 14px
    weight: 500,
    lineHeight: '1.25rem', // 20px
    tracking: '0.1px',
  },

  bodyLarge: {
    font: "'Roboto', system-ui, sans-serif",
    size: '1rem', // 16px
    weight: 400,
    lineHeight: '1.5rem', // 24px
    tracking: '0.5px',
  },
  bodyMedium: {
    font: "'Roboto', system-ui, sans-serif",
    size: '0.875rem', // 14px
    weight: 400,
    lineHeight: '1.25rem', // 20px
    tracking: '0.25px',
  },
  bodySmall: {
    font: "'Roboto', system-ui, sans-serif",
    size: '0.75rem', // 12px
    weight: 400,
    lineHeight: '1rem', // 16px
    tracking: '0.4px',
  },

  labelLarge: {
    font: "'Roboto', system-ui, sans-serif",
    size: '0.875rem', // 14px
    weight: 500,
    lineHeight: '1.25rem', // 20px
    tracking: '0.1px',
  },
  labelMedium: {
    font: "'Roboto', system-ui, sans-serif",
    size: '0.75rem', // 12px
    weight: 500,
    lineHeight: '1rem', // 16px
    tracking: '0.5px',
  },
  labelSmall: {
    font: "'Roboto', system-ui, sans-serif",
    size: '0.6875rem', // 11px
    weight: 500,
    lineHeight: '1rem', // 16px
    tracking: '0.5px',
  },
};

// Elevation tokens
export const elevation: MD3ElevationTokens = {
  level0: 'none',
  level1: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
  level2: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
  level3: '0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
  level4: '0px 2px 3px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)',
  level5: '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
};

// Motion tokens
export const motion: MD3MotionTokens = {
  easing: {
    emphasized: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
    emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
    standard: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    standardDecelerate: 'cubic-bezier(0, 0, 0, 1.0)',
    standardAccelerate: 'cubic-bezier(0.3, 0.0, 1.0, 1.0)',
    legacy: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
  },
  duration: {
    short1: '50ms',
    short2: '100ms',
    short3: '150ms',
    short4: '200ms',
    medium1: '250ms',
    medium2: '300ms',
    medium3: '350ms',
    medium4: '400ms',
    long1: '450ms',
    long2: '500ms',
    long3: '550ms',
    long4: '600ms',
    extraLong1: '700ms',
    extraLong2: '800ms',
    extraLong3: '900ms',
    extraLong4: '1000ms',
  },
};

// Shape tokens
export const shape: MD3ShapeTokens = {
  cornerNone: '0px',
  cornerExtraSmall: '4px',
  cornerSmall: '8px',
  cornerMedium: '12px',
  cornerLarge: '16px',
  cornerExtraLarge: '28px',
  cornerFull: '9999px',
};

// State tokens
export const state: MD3StateTokens = {
  hoverStateLayerOpacity: 0.08,
  focusStateLayerOpacity: 0.12,
  pressedStateLayerOpacity: 0.12,
  draggedStateLayerOpacity: 0.16,
  disabledOpacity: 0.38,
  focusIndicatorOpacity: 1.0,
};

// Spacing tokens
export const spacing: MD3SpacingTokens = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

// Size tokens
export const size: MD3SizeTokens = {
  touchTarget: '48px',
  iconSmall: '16px',
  iconMedium: '24px',
  iconLarge: '32px',
};

// Complete token set
export const md3Tokens: MD3Tokens = {
  colors: {
    light: lightColors,
    dark: darkColors,
  },
  typography,
  elevation,
  motion,
  shape,
  state,
  spacing,
  size,
};