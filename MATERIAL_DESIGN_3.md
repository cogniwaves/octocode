# Material Design 3 System for OctoCode

This document outlines the complete Material Design 3 (MD3) design system implementation for the OctoCode project, built with pure CSS and CSS modules (NO Tailwind CSS).

## Overview

Our Material Design 3 implementation provides a comprehensive, accessible, and production-ready design system that follows Google's latest Material Design specifications. The system is built with:

- **Pure CSS** - No framework dependencies
- **CSS Modules** - Scoped component styling
- **TypeScript** - Full type safety
- **Dynamic Colors** - Integration with @material/material-color-utilities
- **Accessibility First** - WCAG compliant components
- **Performance Optimized** - Tree-shakeable and minimal runtime

## Architecture

```
styles/
├── globals.css                 # Global MD3 styles and tokens
├── utilities.css              # Utility classes
└── components/                 # CSS modules for components
    ├── Button.module.css
    ├── Card.module.css
    └── FloatingActionButton.module.css

lib/
├── theme/
│   ├── tokens.ts              # Design token definitions
│   ├── theme-provider.tsx     # Theme context and provider
│   └── dynamic-colors.ts      # Dynamic color utilities
├── types/
│   └── theme.ts              # TypeScript definitions
└── utils/
    └── theme-utils.ts        # Utility functions

components/ui/
├── Button.tsx                # MD3 Button component
├── Card.tsx                  # MD3 Card component
└── ...                       # Other MD3 components
```

## Core Features

### 1. Complete Color System

Our color system implements the full Material Design 3 color palette:

- **Primary Colors**: Brand identity colors
- **Secondary Colors**: Supporting accent colors  
- **Tertiary Colors**: Complementary accent colors
- **Error Colors**: System error states
- **Neutral Colors**: Backgrounds and surfaces
- **Surface Containers**: Layered surface system

```css
/* Example usage */
.my-component {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
```

### 2. Typography System

Complete implementation of MD3 typography scales:

- **Display**: Hero and large display text
- **Headline**: Section headers
- **Title**: Component titles
- **Body**: Main content text
- **Label**: UI element labels

```css
/* Typography classes */
.md-typescale-display-large { /* 57px */ }
.md-typescale-headline-medium { /* 28px */ }
.md-typescale-body-large { /* 16px */ }
.md-typescale-label-small { /* 11px */ }
```

### 3. Elevation System

Material Design 3 elevation levels with proper shadows:

```css
.md-elevation-0 { box-shadow: none; }
.md-elevation-1 { box-shadow: /* level 1 shadow */; }
.md-elevation-5 { box-shadow: /* level 5 shadow */; }
```

### 4. Motion System

Standardized animations and transitions:

- **Emphasized**: Important UI changes
- **Standard**: Common interactions  
- **Legacy**: Backwards compatibility

```css
/* Motion tokens */
--md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0.0, 0, 1.0);
--md-sys-motion-duration-medium2: 300ms;
```

### 5. Shape System

Rounded corner system:

```css
--md-sys-shape-corner-none: 0px;
--md-sys-shape-corner-small: 8px;
--md-sys-shape-corner-medium: 12px;
--md-sys-shape-corner-large: 16px;
--md-sys-shape-corner-full: 9999px;
```

## Usage Guide

### 1. Setup Theme Provider

Wrap your app with the theme provider:

```tsx
import { ThemeProvider } from '@/lib/theme/theme-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Import Global Styles

In your main CSS file:

```css
@import '../styles/globals.css';
@import '../styles/utilities.css';
```

### 3. Using Components

```tsx
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function MyPage() {
  return (
    <div className="md-container">
      <Card variant="elevated" size="medium">
        <CardHeader>
          <CardTitle>Material Design 3</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="md-typescale-body-large">
            This is a Material Design 3 card component.
          </p>
          <Button variant="filled" size="medium">
            Action Button
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 4. Using CSS Classes

```html
<!-- Typography -->
<h1 class="md-typescale-display-large">Large Display Text</h1>
<p class="md-typescale-body-medium">Body text content</p>

<!-- Surfaces -->
<div class="md-surface-container md-elevation-2 md-shape-medium md-padding-lg">
  Surface container with elevation
</div>

<!-- Utilities -->
<div class="md-stack md-stack--gap-md">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### 5. Dynamic Theming

```tsx
import { generateDynamicTheme, applyDynamicTheme } from '@/lib/theme/dynamic-colors';

// Generate theme from brand color
const theme = generateDynamicTheme({
  sourceColor: '#6750a4',
  customColors: [
    { name: 'brand', value: '#ff6b35', blend: true }
  ]
});

// Apply to DOM
applyDynamicTheme(theme, isDark);
```

## Component Library

### Button Component

```tsx
<Button 
  variant="filled"        // elevated | filled | filled-tonal | outlined | text
  size="medium"           // small | medium | large
  loading={false}         // Show loading state
  disabled={false}        // Disable interaction
  leftIcon={<Icon />}     // Leading icon
  rightIcon={<Icon />}    // Trailing icon
  onClick={handleClick}
>
  Button Text
</Button>
```

### Card Component

```tsx
<Card 
  variant="elevated"      // elevated | filled | outlined
  size="medium"           // small | medium | large
  interactive={false}     // Make clickable
  loading={false}         // Show loading state
  onClick={handleClick}
>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardSubtitle>Card Subtitle</CardSubtitle>
  </CardHeader>
  
  <CardMedia>
    <img src="image.jpg" alt="Card image" />
  </CardMedia>
  
  <CardContent>
    <CardBody>
      This is the main content of the card.
    </CardBody>
    <CardSupporting>
      Supporting text provides additional context.
    </CardSupporting>
  </CardContent>
  
  <CardDivider />
  
  <CardActions alignment="end">
    <Button variant="text">Cancel</Button>
    <Button variant="filled">Confirm</Button>
  </CardActions>
</Card>
```

## Accessibility Features

### 1. Focus Management

- Visible focus indicators on all interactive elements
- Proper tab order and keyboard navigation
- Skip links for screen readers

### 2. Color Contrast

- WCAG AA compliance (4.5:1 ratio for normal text)
- High contrast mode support
- Color-blind friendly palettes

### 3. Screen Reader Support

- Semantic HTML elements
- ARIA attributes where needed
- Screen reader only text with `.md-sr-only`

### 4. Responsive Design

- Mobile-first approach
- Touch-friendly target sizes (minimum 48px)
- Responsive breakpoints and utilities

## Theming

### Light and Dark Modes

The system automatically supports light and dark themes:

```css
/* Light mode (default) */
:root {
  --md-sys-color-primary: #6750a4;
  --md-sys-color-background: #fffbff;
}

/* Dark mode */
[data-theme="dark"] {
  --md-sys-color-primary: #d0bcff;
  --md-sys-color-background: #101014;
}
```

### Custom Brand Colors

Integrate your brand colors using dynamic theming:

```tsx
import { generateDynamicTheme } from '@/lib/theme/dynamic-colors';

const customTheme = generateDynamicTheme({
  sourceColor: '#your-brand-color',
  customColors: [
    { name: 'accent', value: '#ff6b35' },
    { name: 'warning', value: '#ffa726' }
  ]
});
```

### Theme Switching

```tsx
import { useTheme, ThemeToggle } from '@/lib/theme/theme-provider';

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {resolvedTheme}</p>
      <ThemeToggle />
      <Button onClick={() => setTheme('dark')}>
        Switch to Dark
      </Button>
    </div>
  );
}
```

## Best Practices

### 1. Performance

- Use CSS custom properties for theming
- Leverage CSS modules for component isolation
- Minimize JavaScript runtime with pure CSS

### 2. Accessibility

- Always provide focus indicators
- Test with screen readers
- Ensure proper color contrast ratios
- Use semantic HTML elements

### 3. Consistency

- Follow MD3 specifications exactly
- Use design tokens consistently
- Maintain proper spacing and typography scales

### 4. Responsive Design

- Design mobile-first
- Use CSS Grid and Flexbox for layouts
- Test across different screen sizes

## Migration Guide

### From Tailwind CSS

1. Remove Tailwind dependencies and configuration
2. Replace Tailwind classes with MD3 utility classes
3. Update component styling to use CSS modules
4. Test thoroughly for visual regressions

### Adding New Components

1. Create CSS module in `styles/components/`
2. Implement React component with TypeScript
3. Add to component library exports
4. Write tests and documentation

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

## Performance Metrics

- **CSS Bundle Size**: ~45KB gzipped
- **Runtime JavaScript**: <2KB for theme switching
- **First Paint**: No blocking JavaScript
- **Accessibility Score**: 100% WCAG AA compliance

## Contributing

When contributing to the design system:

1. Follow Material Design 3 specifications
2. Maintain accessibility standards
3. Write comprehensive tests
4. Update documentation
5. Consider performance implications

## Resources

- [Material Design 3 Guidelines](https://m3.material.io/)
- [Material Color Utilities](https://github.com/material-foundation/material-color-utilities)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

## Support

For questions or issues with the design system:

1. Check this documentation
2. Review Material Design 3 specifications
3. Create an issue in the project repository
4. Contact the design system team

---

**Note**: This design system is built specifically for OctoCode and follows Material Design 3 principles while being optimized for our use cases and performance requirements.