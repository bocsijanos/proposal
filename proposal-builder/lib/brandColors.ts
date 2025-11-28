/**
 * Brand-specific color utilities for BOOM Marketing and AIBOOST
 *
 * This utility provides centralized color management for different brands,
 * ensuring consistent styling across all block components.
 *
 * NOW USES DESIGN TOKENS - automatically loads the correct brand tokens
 */

import { boomTokens } from './design-tokens/boom-tokens';
import { aiboostTokens } from './design-tokens/aiboost-tokens';

export type BrandType = 'BOOM' | 'AIBOOST';

export interface BrandColors {
  primary: string;
  secondary: string;
  headingPrimary: string;
  headingSecondary: string;
  textColor: string;
}

/**
 * Get brand-specific colors from design tokens
 *
 * BOOM: Uses BOOM design tokens
 * - Primary: #fa604a (Orange)
 * - Secondary: #3e4581 (Navy)
 *
 * AIBOOST: Uses AIBOOST design tokens
 * - Primary: #D187FC (Purple)
 * - Secondary: #1F1F41 (Dark Navy)
 *
 * @param brand - The brand type ('BOOM' or 'AIBOOST')
 * @returns BrandColors object with all color values from design tokens
 */
export function getBrandColors(brand: BrandType): BrandColors {
  if (brand === 'BOOM') {
    return {
      primary: boomTokens.colors.primary.hex,
      secondary: boomTokens.colors.secondary.hex,
      headingPrimary: boomTokens.colors.primary.hex,
      headingSecondary: boomTokens.colors.secondary.hex,
      textColor: boomTokens.colors.secondary.hex,
    };
  }

  // AIBOOST
  return {
    primary: aiboostTokens.colors.primary.hex,
    secondary: aiboostTokens.colors.secondary.hex,
    headingPrimary: aiboostTokens.colors.primary.hex,
    headingSecondary: aiboostTokens.colors.secondary.hex,
    textColor: aiboostTokens.colors.text.primary.hex,
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
