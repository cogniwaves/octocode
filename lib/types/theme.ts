/**
 * TypeScript definitions for Material Design 3 theme system
 */

// Component size variants
export type ComponentSize = 'small' | 'medium' | 'large';

// Component variants
export type ButtonVariant = 'elevated' | 'filled' | 'filled-tonal' | 'outlined' | 'text';
export type CardVariant = 'elevated' | 'filled' | 'outlined';
export type FABVariant = 'primary' | 'surface' | 'secondary' | 'tertiary';

// Typography scales
export type TypographyScale = 
  | 'display-large'
  | 'display-medium' 
  | 'display-small'
  | 'headline-large'
  | 'headline-medium'
  | 'headline-small'
  | 'title-large'
  | 'title-medium'
  | 'title-small'
  | 'body-large'
  | 'body-medium'
  | 'body-small'
  | 'label-large'
  | 'label-medium'
  | 'label-small';

// Elevation levels
export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

// Shape tokens
export type ShapeToken = 
  | 'none'
  | 'extra-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'extra-large'
  | 'full';

// Spacing tokens
export type SpacingToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// Motion durations
export type MotionDuration = 
  | 'short1' | 'short2' | 'short3' | 'short4'
  | 'medium1' | 'medium2' | 'medium3' | 'medium4'
  | 'long1' | 'long2' | 'long3' | 'long4'
  | 'extra-long1' | 'extra-long2' | 'extra-long3' | 'extra-long4';

// Motion easing
export type MotionEasing = 
  | 'emphasized'
  | 'emphasized-decelerate'
  | 'emphasized-accelerate'
  | 'standard'
  | 'standard-decelerate'
  | 'standard-accelerate'
  | 'legacy';

// Theme mode
export type ThemeMode = 'light' | 'dark' | 'system';

// Color tokens
export interface ColorTokens {
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
  
  // Neutral colors
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
  
  // Special colors
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  shadow: string;
  scrim: string;
  surfaceTint: string;
}

// Component props interfaces
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

export interface InteractiveComponentProps extends BaseComponentProps {
  disabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  tabIndex?: number;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-disabled'?: boolean;
}

export interface ButtonProps extends InteractiveComponentProps {
  variant?: ButtonVariant;
  size?: ComponentSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
}

export interface CardProps extends BaseComponentProps {
  variant?: CardVariant;
  size?: ComponentSize;
  interactive?: boolean;
  loading?: boolean;
  header?: React.ReactNode;
  media?: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}

export interface FABProps extends InteractiveComponentProps {
  variant?: FABVariant;
  size?: 'small' | 'medium' | 'large';
  extended?: boolean;
  label?: string;
  icon: React.ReactNode;
  loading?: boolean;
  position?: 'fixed' | 'relative';
  placement?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left' | 'top-center';
  badge?: string | number;
}

// Form component props
export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  required?: boolean;
  disabled?: boolean;
}

export interface TextFieldProps extends FormFieldProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

// Layout component props
export interface StackProps extends BaseComponentProps {
  direction?: 'row' | 'column';
  spacing?: SpacingToken;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
}

export interface GridProps extends BaseComponentProps {
  cols?: number | string;
  rows?: number | string;
  gap?: SpacingToken;
  responsive?: boolean;
}

export interface ContainerProps extends BaseComponentProps {
  size?: 'narrow' | 'default' | 'wide' | 'full';
}

// Theme configuration
export interface ThemeConfig {
  mode: ThemeMode;
  colors: {
    light: ColorTokens;
    dark: ColorTokens;
  };
  typography: Record<TypographyScale, {
    fontFamily: string;
    fontSize: string;
    fontWeight: number;
    lineHeight: string;
    letterSpacing: string;
  }>;
  spacing: Record<SpacingToken, string>;
  elevation: Record<ElevationLevel, string>;
  shape: Record<ShapeToken, string>;
  motion: {
    duration: Record<MotionDuration, string>;
    easing: Record<MotionEasing, string>;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

// Utility types
export type ComponentState = 'default' | 'hover' | 'focus' | 'active' | 'disabled';
export type ComponentValidation = 'default' | 'error' | 'success' | 'warning';

// CSS-in-JS style object type
export type StyleObject = Record<string, string | number | StyleObject>;

// Animation types
export interface AnimationConfig {
  duration?: MotionDuration | string;
  easing?: MotionEasing | string;
  delay?: string;
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  iterationCount?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

// Responsive utilities
export interface ResponsiveValue<T> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  default: T;
}

// Design token utilities
export type TokenPath = string; // e.g., 'colors.primary' or 'spacing.md'
export type TokenValue = string | number;

// Component style variants
export interface ComponentStyles {
  base: StyleObject;
  variants?: Record<string, StyleObject>;
  sizes?: Record<ComponentSize, StyleObject>;
  states?: Record<ComponentState, StyleObject>;
}

// Accessibility types
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-hidden'?: boolean;
  'aria-disabled'?: boolean;
  'aria-pressed'?: boolean;
  'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-live'?: 'off' | 'assertive' | 'polite';
  role?: string;
  tabIndex?: number;
}

// Event handler types
export interface ComponentEvents {
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onKeyUp?: (event: React.KeyboardEvent) => void;
}

// Component ref types
export type ButtonRef = React.RefObject<HTMLButtonElement>;
export type DivRef = React.RefObject<HTMLDivElement>;
export type InputRef = React.RefObject<HTMLInputElement>;
export type TextAreaRef = React.RefObject<HTMLTextAreaElement>;

// Hook types
export interface UseThemeReturn {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
  colors: ColorTokens;
}

// Design system context
export interface DesignSystemContext {
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  tokens: Record<string, TokenValue>;
  getToken: (path: TokenPath) => TokenValue;
  components: Record<string, ComponentStyles>;
}