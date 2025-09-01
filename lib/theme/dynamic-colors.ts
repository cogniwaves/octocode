/**
 * Dynamic Color System for Material Design 3
 * Integrates with @material/material-color-utilities for dynamic theming
 */

import {
  argbFromHex,
  themeFromSourceColor,
  applyTheme,
  CustomColor,
  SchemeContent,
  DynamicScheme,
  MaterialDynamicColors,
  SchemeTonalSpot,
  Hct,
} from '@material/material-color-utilities';

export interface DynamicColorOptions {
  sourceColor?: string;
  customColors?: Array<{
    name: string;
    value: string;
    blend?: boolean;
  }>;
  contrast?: number; // -1 to 1, where 0 is standard contrast
  isDark?: boolean;
}

export interface GeneratedTheme {
  colors: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  customColors: Record<string, {
    light: Record<string, string>;
    dark: Record<string, string>;
  }>;
}

/**
 * Generates a complete Material Design 3 theme from a source color
 */
export function generateDynamicTheme(options: DynamicColorOptions = {}): GeneratedTheme {
  const {
    sourceColor = '#6750a4', // Default Material 3 purple
    customColors = [],
    contrast = 0,
    isDark = false,
  } = options;

  // Convert source color to ARGB
  const sourceColorArgb = argbFromHex(sourceColor);
  
  // Generate theme from source color
  const theme = themeFromSourceColor(sourceColorArgb, customColors.map(color => ({
    name: color.name,
    value: argbFromHex(color.value),
    blend: color.blend ?? true,
  })));

  // Create schemes for light and dark modes
  const lightScheme = theme.schemes.light;
  const darkScheme = theme.schemes.dark;

  // Convert schemes to hex colors
  const lightColors = extractSchemeColors(lightScheme);
  const darkColors = extractSchemeColors(darkScheme);

  // Handle custom colors
  const customColorsResult: Record<string, {
    light: Record<string, string>;
    dark: Record<string, string>;
  }> = {};

  theme.customColors.forEach((customColor, index) => {
    const colorName = customColors[index]?.name || `custom${index}`;
    customColorsResult[colorName] = {
      light: {
        color: customColor.light.color.toHex(),
        onColor: customColor.light.onColor.toHex(),
        colorContainer: customColor.light.colorContainer.toHex(),
        onColorContainer: customColor.light.onColorContainer.toHex(),
      },
      dark: {
        color: customColor.dark.color.toHex(),
        onColor: customColor.dark.onColor.toHex(),
        colorContainer: customColor.dark.colorContainer.toHex(),
        onColorContainer: customColor.dark.onColorContainer.toHex(),
      },
    };
  });

  return {
    colors: {
      light: lightColors,
      dark: darkColors,
    },
    customColors: customColorsResult,
  };
}

/**
 * Extracts colors from a scheme and converts them to hex strings
 */
function extractSchemeColors(scheme: any): Record<string, string> {
  return {
    primary: scheme.primary.toHex(),
    onPrimary: scheme.onPrimary.toHex(),
    primaryContainer: scheme.primaryContainer.toHex(),
    onPrimaryContainer: scheme.onPrimaryContainer.toHex(),
    
    secondary: scheme.secondary.toHex(),
    onSecondary: scheme.onSecondary.toHex(),
    secondaryContainer: scheme.secondaryContainer.toHex(),
    onSecondaryContainer: scheme.onSecondaryContainer.toHex(),
    
    tertiary: scheme.tertiary.toHex(),
    onTertiary: scheme.onTertiary.toHex(),
    tertiaryContainer: scheme.tertiaryContainer.toHex(),
    onTertiaryContainer: scheme.onTertiaryContainer.toHex(),
    
    error: scheme.error.toHex(),
    onError: scheme.onError.toHex(),
    errorContainer: scheme.errorContainer.toHex(),
    onErrorContainer: scheme.onErrorContainer.toHex(),
    
    background: scheme.background.toHex(),
    onBackground: scheme.onBackground.toHex(),
    
    surface: scheme.surface.toHex(),
    onSurface: scheme.onSurface.toHex(),
    surfaceVariant: scheme.surfaceVariant.toHex(),
    onSurfaceVariant: scheme.onSurfaceVariant.toHex(),
    
    surfaceDim: scheme.surfaceDim?.toHex() || scheme.surface.toHex(),
    surfaceBright: scheme.surfaceBright?.toHex() || scheme.surface.toHex(),
    surfaceContainerLowest: scheme.surfaceContainerLowest?.toHex() || scheme.surface.toHex(),
    surfaceContainerLow: scheme.surfaceContainerLow?.toHex() || scheme.surface.toHex(),
    surfaceContainer: scheme.surfaceContainer?.toHex() || scheme.surface.toHex(),
    surfaceContainerHigh: scheme.surfaceContainerHigh?.toHex() || scheme.surface.toHex(),
    surfaceContainerHighest: scheme.surfaceContainerHighest?.toHex() || scheme.surface.toHex(),
    
    outline: scheme.outline.toHex(),
    outlineVariant: scheme.outlineVariant.toHex(),
    
    inverseSurface: scheme.inverseSurface.toHex(),
    inverseOnSurface: scheme.inverseOnSurface.toHex(),
    inversePrimary: scheme.inversePrimary.toHex(),
    
    shadow: scheme.shadow?.toHex() || '#000000',
    scrim: scheme.scrim?.toHex() || '#000000',
    surfaceTint: scheme.primary.toHex(), // Surface tint uses primary color
  };
}

/**
 * Applies dynamic colors to CSS custom properties
 */
export function applyDynamicTheme(theme: GeneratedTheme, isDark: boolean = false) {
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const root = document.documentElement;

  // Apply main theme colors
  Object.entries(colors).forEach(([key, value]) => {
    const cssProperty = `--md-sys-color-${camelToKebab(key)}`;
    root.style.setProperty(cssProperty, value);
  });

  // Apply custom colors
  Object.entries(theme.customColors).forEach(([colorName, colorScheme]) => {
    const colorColors = isDark ? colorScheme.dark : colorScheme.light;
    Object.entries(colorColors).forEach(([key, value]) => {
      const cssProperty = `--md-custom-${colorName}-${camelToKebab(key)}`;
      root.style.setProperty(cssProperty, value);
    });
  });
}

/**
 * Converts camelCase to kebab-case
 */
function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Generates a color palette from an image
 * This is a placeholder for future implementation with image analysis
 */
export async function generateThemeFromImage(imageUrl: string): Promise<GeneratedTheme> {
  // This would typically use image analysis to extract a dominant color
  // For now, we'll return a default theme
  // In a real implementation, you'd use libraries like node-vibrant or similar
  
  console.warn('generateThemeFromImage is not yet implemented. Using default theme.');
  return generateDynamicTheme();
}

/**
 * Validates if a color string is valid hex
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Gets the contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  try {
    const argb1 = argbFromHex(color1);
    const argb2 = argbFromHex(color2);
    
    const hct1 = Hct.fromInt(argb1);
    const hct2 = Hct.fromInt(argb2);
    
    const l1 = hct1.tone;
    const l2 = hct2.tone;
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 5) / (darker + 5);
  } catch {
    return 1;
  }
}

/**
 * Ensures a color meets WCAG contrast requirements
 */
export function ensureContrast(
  foreground: string,
  background: string,
  targetRatio: number = 4.5
): string {
  const currentRatio = getContrastRatio(foreground, background);
  
  if (currentRatio >= targetRatio) {
    return foreground;
  }

  try {
    const bgArgb = argbFromHex(background);
    const bgHct = Hct.fromInt(bgArgb);
    const fgArgb = argbFromHex(foreground);
    const fgHct = Hct.fromInt(fgArgb);
    
    // Adjust the tone of the foreground color to meet contrast requirements
    let adjustedTone = fgHct.tone;
    const step = bgHct.tone > 50 ? -1 : 1;
    
    while (adjustedTone >= 0 && adjustedTone <= 100) {
      const adjustedHct = Hct.from(fgHct.hue, fgHct.chroma, adjustedTone);
      const adjustedColor = adjustedHct.toInt();
      const newRatio = getContrastRatio(
        `#${adjustedColor.toString(16).padStart(8, '0').substring(2)}`,
        background
      );
      
      if (newRatio >= targetRatio) {
        return `#${adjustedColor.toString(16).padStart(8, '0').substring(2)}`;
      }
      
      adjustedTone += step;
    }
    
    // If we can't achieve the target ratio, return black or white
    return bgHct.tone > 50 ? '#000000' : '#ffffff';
  } catch {
    // Fallback to black or white
    const bgArgb = argbFromHex(background);
    const bgHct = Hct.fromInt(bgArgb);
    return bgHct.tone > 50 ? '#000000' : '#ffffff';
  }
}