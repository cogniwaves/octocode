/**
 * Utility functions for working with the Material Design 3 theme system
 */

import { type ClassValue, clsx } from 'clsx';
import { md3Tokens } from '../theme/tokens';
import type { 
  ColorTokens, 
  ThemeMode, 
  ComponentSize, 
  SpacingToken,
  ElevationLevel,
  ShapeToken,
  TypographyScale,
  MotionDuration,
  MotionEasing
} from '../types/theme';

/**
 * Combines class names using clsx
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Gets a CSS custom property value
 */
export function getCSSCustomProperty(property: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
}

/**
 * Sets a CSS custom property value
 */
export function setCSSCustomProperty(property: string, value: string): void {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(property, value);
}

/**
 * Gets the current theme from the DOM
 */
export function getCurrentTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light';
}

/**
 * Gets color tokens for the current theme
 */
export function getCurrentColors(): ColorTokens {
  const theme = getCurrentTheme();
  return md3Tokens.colors[theme];
}

/**
 * Converts a color token name to CSS custom property
 */
export function getColorToken(colorName: keyof ColorTokens): string {
  return `var(--md-sys-color-${camelToKebab(colorName)})`;
}

/**
 * Gets a spacing value by token
 */
export function getSpacing(token: SpacingToken): string {
  return `var(--md-sys-spacing-${token})`;
}

/**
 * Gets an elevation level
 */
export function getElevation(level: ElevationLevel): string {
  return `var(--md-sys-elevation-level${level})`;
}

/**
 * Gets a shape radius
 */
export function getShape(token: ShapeToken): string {
  return `var(--md-sys-shape-corner-${token.replace('_', '-')})`;
}

/**
 * Gets typography styles for a scale
 */
export function getTypography(scale: TypographyScale) {
  const scaleKey = scale.replace('-', '_');
  return {
    fontFamily: `var(--md-sys-typescale-${camelToKebab(scaleKey)}-font)`,
    fontSize: `var(--md-sys-typescale-${camelToKebab(scaleKey)}-size)`,
    fontWeight: `var(--md-sys-typescale-${camelToKebab(scaleKey)}-weight)`,
    lineHeight: `var(--md-sys-typescale-${camelToKebab(scaleKey)}-line-height)`,
    letterSpacing: `var(--md-sys-typescale-${camelToKebab(scaleKey)}-tracking)`,
  };
}

/**
 * Gets motion duration
 */
export function getMotionDuration(duration: MotionDuration): string {
  return `var(--md-sys-motion-duration-${duration.replace('_', '-')})`;
}

/**
 * Gets motion easing
 */
export function getMotionEasing(easing: MotionEasing): string {
  return `var(--md-sys-motion-easing-${easing.replace('_', '-')})`;
}

/**
 * Creates a complete animation CSS value
 */
export function createAnimation(
  name: string,
  duration: MotionDuration | string = 'medium2',
  easing: MotionEasing | string = 'standard',
  delay: string = '0s',
  fillMode: string = 'both'
): string {
  const durationValue = typeof duration === 'string' && duration.includes('ms') 
    ? duration 
    : getMotionDuration(duration as MotionDuration);
  const easingValue = typeof easing === 'string' && easing.includes('cubic-bezier') 
    ? easing 
    : getMotionEasing(easing as MotionEasing);
  
  return `${name} ${durationValue} ${easingValue} ${delay} ${fillMode}`;
}

/**
 * Converts camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Converts kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Generates component class names with variants
 */
export function createComponentClasses(
  base: string,
  variants?: Record<string, any>,
  size?: ComponentSize,
  disabled?: boolean,
  loading?: boolean,
  className?: string
): string {
  const classes = [base];
  
  // Add variant classes
  if (variants) {
    Object.entries(variants).forEach(([key, value]) => {
      if (value) {
        classes.push(`${base}--${kebabToCamel(key)}`);
      }
    });
  }
  
  // Add size class
  if (size && size !== 'medium') {
    classes.push(`${base}--${size}`);
  }
  
  // Add state classes
  if (disabled) {
    classes.push(`${base}--disabled`);
  }
  
  if (loading) {
    classes.push(`${base}--loading`);
  }
  
  // Add custom className
  if (className) {
    classes.push(className);
  }
  
  return cn(...classes);
}

/**
 * Checks if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Checks if the user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Gets the user's preferred color scheme
 */
export function getPreferredColorScheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Creates a media query listener for theme changes
 */
export function createThemeMediaQuery(callback: (isDark: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e: MediaQueryListEvent) => callback(e.matches);
  
  mediaQuery.addEventListener('change', handler);
  
  return () => mediaQuery.removeEventListener('change', handler);
}

/**
 * Validates if a hex color is valid
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Converts hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Converts RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Gets the luminance of a color
 */
export function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates the contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks if a color combination meets WCAG contrast requirements
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = getContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
  
  return size === 'large' ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Creates a focus ring style object
 */
export function createFocusRing(color?: string): Record<string, string> {
  return {
    outline: `2px solid ${color || getColorToken('primary')}`,
    outlineOffset: '2px',
    borderRadius: getShape('extra-small'),
  };
}

/**
 * Creates a state layer style object
 */
export function createStateLayer(
  color: string = 'currentColor',
  opacity: number = 0.08
): Record<string, string> {
  return {
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: "''",
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: color,
      opacity: '0',
      transition: `opacity ${getMotionDuration('short2')} ${getMotionEasing('standard')}`,
      pointerEvents: 'none',
      borderRadius: 'inherit',
    },
    '&:hover::before': {
      opacity: opacity.toString(),
    },
    '&:focus-visible::before': {
      opacity: (opacity * 1.5).toString(),
    },
    '&:active::before': {
      opacity: (opacity * 1.5).toString(),
    },
  };
}

/**
 * Debounce utility for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  }) as T;
}

/**
 * Throttle utility for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let inThrottle: boolean;
  
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), delay);
    }
  }) as T;
}