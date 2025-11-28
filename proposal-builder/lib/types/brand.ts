/**
 * Unified Brand type definition
 * Single source of truth for brand types across the application
 */

// Canonical brand type used throughout the application
export type Brand = 'BOOM' | 'AIBOOST';

// Theme key type (used in themes.ts object keys)
export type ThemeKey = 'boom' | 'aiboost';

// Conversion utilities
export function brandToThemeKey(brand: Brand): ThemeKey {
  return brand.toLowerCase() as ThemeKey;
}

export function themeKeyToBrand(key: ThemeKey): Brand {
  return key.toUpperCase() as Brand;
}

// Type guard
export function isBrand(value: string): value is Brand {
  return value === 'BOOM' || value === 'AIBOOST';
}

export function isThemeKey(value: string): value is ThemeKey {
  return value === 'boom' || value === 'aiboost';
}
