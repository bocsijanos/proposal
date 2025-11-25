/**
 * Brand-specific color utilities for BOOM Marketing and AIBOOST
 *
 * This utility provides centralized color management for different brands,
 * ensuring consistent styling across all block components.
 */

export type BrandType = 'BOOM' | 'AIBOOST';

export interface BrandColors {
  primary: string;
  secondary: string;
  headingPrimary: string;
  headingSecondary: string;
  textColor: string;
}

/**
 * Get brand-specific colors
 *
 * BOOM: Uses explicit hex colors for headings and text
 * - Heading Primary: Orange (#fa604a)
 * - Heading Secondary: Blue (#3e4581)
 * - Text Color: Blue (#3e4581)
 *
 * AIBOOST: Uses CSS variables for dynamic theming
 * - All colors use var(--color-*) CSS variables
 *
 * @param brand - The brand type ('BOOM' or 'AIBOOST')
 * @returns BrandColors object with all color values
 */
export function getBrandColors(brand: BrandType): BrandColors {
  if (brand === 'BOOM') {
    return {
      primary: '#fa604a',        // Orange (CTA buttons, accents)
      secondary: '#3e4581',      // Blue (secondary elements)
      headingPrimary: '#fa604a', // Main headings (h2) - Orange
      headingSecondary: '#3e4581', // Sub-headings (h3) - Blue
      textColor: '#3e4581',      // Body text, lists, paragraphs - Blue
    };
  }

  // AIBOOST and default fallback
  return {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    headingPrimary: 'var(--color-text)',
    headingSecondary: 'var(--color-text)',
    textColor: 'var(--color-text)',
  };
}

/**
 * Get heading color style based on brand and heading type
 *
 * @param brand - The brand type
 * @param type - The heading type ('primary' for h2, 'secondary' for h3)
 * @returns Inline style object with color property
 */
export function getHeadingStyle(
  brand: BrandType,
  type: 'primary' | 'secondary' = 'primary'
): { color: string } {
  const colors = getBrandColors(brand);
  return {
    color: type === 'primary' ? colors.headingPrimary : colors.headingSecondary
  };
}

/**
 * Get text color style based on brand
 *
 * @param brand - The brand type
 * @returns Inline style object with color property for body text
 */
export function getTextStyle(brand: BrandType): { color: string } {
  const colors = getBrandColors(brand);
  return {
    color: colors.textColor
  };
}
