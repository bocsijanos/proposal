# Design Token Architecture

## Áttekintés

Az alkalmazás brand-aware design token rendszert használ, amely automatikusan alkalmazza a megfelelő brand (BOOM vagy AIBOOST) design tokeneket a komponensekre.

## Célok

✅ **Konzisztencia**: Minden komponens automatikusan a helyes brand design tokeneket használja
✅ **Skálázhatóság**: Új brandek könnyen hozzáadhatók (harmadik, negyedik cég)
✅ **Karbantarthatóság**: Egy helyen definiált design rendszer
✅ **Type Safety**: TypeScript típusok a design tokenekhez

## Architektúra

### 1. Design Token Files

#### BOOM Brand Tokens
**Fájl**: [`lib/design-tokens/boom-tokens.ts`](../lib/design-tokens/boom-tokens.ts)

```typescript
export const boomTokens = {
  colors: {
    primary: { hex: '#fa604a', name: 'BOOM Orange' },
    secondary: { hex: '#3e4581', name: 'BOOM Navy' }
  },
  typography: {
    fontFamily: { primary: 'Montserrat, sans-serif' },
    h1: { size: '60px', weight: 700, color: '#3e4581' }
  },
  // ...
} as const;
```

#### AIBOOST Brand Tokens
**Fájl**: [`lib/design-tokens/aiboost-tokens.ts`](../lib/design-tokens/aiboost-tokens.ts)

```typescript
export const aiboostTokens = {
  colors: {
    primary: { hex: '#D187FC', name: 'AI Boost Purple' },
    secondary: { hex: '#1F1F41', name: 'AI Boost Navy' }
  },
  typography: {
    fontFamily: { primary: 'Inter, sans-serif' },
    h1: { size: '60px', weight: 700, color: '#FFFFFF' }
  },
  // ...
} as const;
```

### 2. Brand Components

Minden brand számára külön komponens könyvtár létezik:

#### BOOM Components
**Könyvtár**: [`components/brand/`](../components/brand/)
- `Typography.tsx` - H1, H2, H3, H4, H5, H6, Body, Highlight, Small
- `Button.tsx` - Gomb komponens (primary, secondary, outline)
- `Card.tsx` - Kártya komponens
- `index.ts` - Barrel export

#### AIBOOST Components
**Könyvtár**: [`components/aiboost/`](../components/aiboost/)
- `Typography.tsx` - H1, H2, H3, H4, H5, H6, Body, Highlight, Small
- `Button.tsx` - Gomb komponens (primary, secondary, outline)
- `Card.tsx` - Kártya komponens
- `index.ts` - Barrel export

### 3. Brand-Aware Component Wrapper

**Fájl**: [`lib/brand-components.tsx`](../lib/brand-components.tsx)

Ez a központi utility biztosítja a brand-alapú komponens betöltést:

```typescript
import { useBrandComponents, getBrandTokens } from '@/lib/brand-components';

// Hook használata komponensekben
const { H1, H2, Body, Button, Card } = useBrandComponents(brand);

// Token lekérése
const tokens = getBrandTokens(brand);
```

**Működés**:
- `useBrandComponents(brand)`: React hook, amely a megfelelő komponenseket tölti be
- `getBrandTokens(brand)`: Utility a design tokenek lekéréséhez
- Memoizált, optimalizált teljesítményre

### 4. Block Components (Proposal Blocks)

A block komponensek (Hero, Service, Pricing, stb.) a brand-aware wrapper-t használják.

**Példa**: [`components/blocks/HeroBlock.tsx`](../components/blocks/HeroBlock.tsx)

```typescript
'use client';

import { useRef } from 'react';
import { useBrandComponents, getBrandTokens } from '@/lib/brand-components';

interface HeroBlockProps {
  content: { /* ... */ };
  brand: 'BOOM' | 'AIBOOST';
  proposalData?: { /* ... */ };
}

export function HeroBlock({ content, brand, proposalData }: HeroBlockProps) {
  // Design token komponensek betöltése brand alapján
  const { H1, Body, Button } = useBrandComponents(brand);
  const tokens = getBrandTokens(brand);

  // Brand-specifikus színek
  const primaryColor = tokens.colors.primary.hex;
  const secondaryColor = tokens.colors.secondary.hex;

  return (
    <section style={{
      background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
    }}>
      <H1 color="#FFFFFF">Főcím</H1>
      <Body color="#FFFFFF">Szöveg</Body>
      <Button variant="primary">CTA gomb</Button>
    </section>
  );
}
```

## Adatbázis Architektúra

### ComponentSource Table

A `ComponentSource` tábla tárolja a master komponens kódokat:

```prisma
model ComponentSource {
  id              String    @id @default(cuid())
  blockType       BlockType @unique
  name            String
  description     String?
  sourceCode      String    @db.Text
  compiledCode    String    @db.Text
  schema          Json
  dependencies    Json      @default("{}")
  version         Int       @default(1)
  // ...
}
```

**FONTOS**: A `ComponentSource` tábla **NEM** tartalmaz `brand` mezőt!
Egy `blockType`-onként egy univerzális, brand-aware komponens van.

### BlockTemplate Table

A `BlockTemplate` viszont **tartalmazza** a `brand` mezőt:

```prisma
model BlockTemplate {
  id             String    @id @default(cuid())
  blockType      BlockType
  name           String
  brand          Brand     @default(BOOM) // BOOM or AIBOOST
  defaultContent Json
  // ...
}
```

Ez lehetővé teszi, hogy brand-specifikus template-eket hozzunk létre ugyanahhoz a `blockType`-hoz.

## Komponens Rendering Flow

```
1. User creates Proposal with brand = 'BOOM' or 'AIBOOST'
   ↓
2. BlockRenderer receives block with brand prop
   ↓
3. Component loads from ComponentSource (brand-agnostic)
   ↓
4. Component executes:
   - useBrandComponents(brand) → loads BOOM or AIBOOST components
   - getBrandTokens(brand) → loads BOOM or AIBOOST tokens
   ↓
5. Component renders with correct brand styling
```

## Új Brand Hozzáadása

### 1. Design Token File létrehozása

```typescript
// lib/design-tokens/newbrand-tokens.ts
export const newbrandTokens = {
  colors: {
    primary: { hex: '#123456', name: 'NewBrand Primary' },
    // ...
  },
  // ...
} as const;
```

### 2. Brand Komponensek létrehozása

```
components/newbrand/
  ├── Typography.tsx
  ├── Button.tsx
  ├── Card.tsx
  └── index.ts
```

### 3. Brand Type frissítése

```typescript
// lib/brand-components.tsx
export type Brand = 'BOOM' | 'AIBOOST' | 'NEWBRAND';
```

### 4. Wrapper frissítése

```typescript
// lib/brand-components.tsx
import * as NewBrandComponents from '@/components/newbrand';

export function useBrandComponents(brand: Brand) {
  return useMemo(() => {
    if (brand === 'BOOM') return BoomComponents;
    if (brand === 'AIBOOST') return AiBoostComponents;
    if (brand === 'NEWBRAND') return NewBrandComponents;
  }, [brand]);
}

export function getBrandTokens(brand: Brand) {
  if (brand === 'BOOM') return boomTokens;
  if (brand === 'AIBOOST') return aiboostTokens;
  if (brand === 'NEWBRAND') return newbrandTokens;
}
```

### 5. Prisma Schema frissítése

```prisma
enum Brand {
  BOOM
  AIBOOST
  NEWBRAND
}
```

Majd migráció:
```bash
npx prisma db push
```

## Előnyök

### ✅ Automatikus Brand Switching
```typescript
<HeroBlock brand="BOOM" />    // → BOOM színek, Montserrat font
<HeroBlock brand="AIBOOST" /> // → AIBOOST színek, Inter font
```

### ✅ Nincs inline kód duplikáció
**Régi (BAD)**:
```typescript
const bgColor = brand === 'BOOM' ? '#fa604a' : '#D187FC';
```

**Új (GOOD)**:
```typescript
const tokens = getBrandTokens(brand);
const bgColor = tokens.colors.primary.hex;
```

### ✅ Type Safety
TypeScript automatikus autocomplete minden design token property-re.

### ✅ Konzisztencia
Minden komponens ugyanazt a design rendszert használja.

## Tesztelés

### Test Script futtatása

```bash
DATABASE_URL="..." npx tsx scripts/test-hero-brands.tsx
```

**Output**:
```
✅ Hero component loaded from database
🔍 Code Analysis:
   ✓ Uses useBrandComponents hook: ✅
   ✓ Uses getBrandTokens utility: ✅
   ✗ Contains inline colors (old): ✅ (GOOD)
🎨 Design Token Components:
   ✓ H1 component: ✅
   ✓ Body component: ✅
   ✓ Button component: ✅
✨ All checks passed!
```

### Manual Testing

1. Hozz létre BOOM árajánlatot: http://localhost:3000
2. Adj hozzá Hero blockot
3. Ellenőrizd: narancssárga (#fa604a) és navy (#3e4581) színek
4. Hozz létre AIBOOST árajánlatot
5. Adj hozzá Hero blockot
6. Ellenőrizd: lila (#D187FC) és dark navy (#1F1F41) színek

## Következő Lépések

### Még refaktorálandó komponensek:
- [ ] Service Block
- [ ] Pricing Table Block
- [ ] Process Timeline Block
- [ ] Stats Block
- [ ] CTA Block
- [ ] Text Block
- [ ] Two Column Block

Mindegyik komponenst ugyanezen a pattern-en kell átírni:
1. Import `useBrandComponents` és `getBrandTokens`
2. Cseréld le az inline színeket a token-ekre
3. Használd a design komponenseket (H1, H2, Body, Button, Card)
4. Futtasd a seed scriptet
5. Teszteld mindkét branddel

## Referenciák

- [BOOM Design Tokens](../lib/design-tokens/boom-tokens.ts)
- [AIBOOST Design Tokens](../lib/design-tokens/aiboost-tokens.ts)
- [Brand Components Wrapper](../lib/brand-components.tsx)
- [Hero Block Example](../components/blocks/HeroBlock.tsx)
- [Seed Script](../scripts/seed-hero-component.ts)
- [Test Script](../scripts/test-hero-brands.tsx)
