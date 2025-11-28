/**
 * Brand-Aware Component Wrapper
 *
 * Dinamikusan betölti a megfelelő brand komponenseket a brand prop alapján.
 * Ez biztosítja, hogy minden komponens a helyes design tokeneket használja.
 *
 * Használat a komponensekben:
 * ```tsx
 * import { useBrandComponents } from '@/lib/brand-components';
 *
 * function MyComponent({ brand }: { brand: 'BOOM' | 'AIBOOST' }) {
 *   const { H1, H2, Body, Button, Card } = useBrandComponents(brand);
 *
 *   return (
 *     <div>
 *       <H1>Főcím</H1>
 *       <Body>Szöveg</Body>
 *       <Button variant="primary">Kattints</Button>
 *     </div>
 *   );
 * }
 * ```
 */

import { useMemo } from 'react';
import * as BoomComponents from '@/components/brand';
import * as AiBoostComponents from '@/components/aiboost';

export type Brand = 'BOOM' | 'AIBOOST';

/**
 * Hook a brand-specifikus komponensek betöltéséhez
 */
export function useBrandComponents(brand: Brand) {
  return useMemo(() => {
    return brand === 'BOOM' ? BoomComponents : AiBoostComponents;
  }, [brand]);
}

/**
 * Utility a brand-specifikus design tokenek lekéréséhez
 */
export function getBrandTokens(brand: Brand) {
  if (brand === 'BOOM') {
    const { boomTokens } = require('@/lib/design-tokens/boom-tokens');
    return boomTokens;
  } else {
    const { aiboostTokens } = require('@/lib/design-tokens/aiboost-tokens');
    return aiboostTokens;
  }
}

/**
 * Type-safe komponens exports mindkét brand számára
 */
export type BrandComponents = typeof BoomComponents;
