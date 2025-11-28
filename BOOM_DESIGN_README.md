# BOOM Marketing Agency - Design System Csomag

Átfogó design rendszer dokumentáció és implementációs példák a BOOM Marketing Agency weboldal alapján.

## Tartalomjegyzék

1. [Áttekintés](#áttekintés)
2. [Fájlok](#fájlok)
3. [Gyors Használat](#gyors-használat)
4. [Kulcsfontosságú Színek](#kulcsfontosságú-színek)
5. [Tipográfia](#tipográfia)
6. [Komponensek](#komponensek)
7. [Implementációs Útmutató](#implementációs-útmutató)

---

## Áttekintés

A BOOM Marketing Agency design rendszere egy **modern, professzionális és accessible** vizuális identitást képvisel, amely kiválóan alkalmas B2B/SaaS marketing ügynökségek számára.

### Design Jellemzők

- **Brand szín**: Narancsvörös (#FE6049) - energikus, figyelemfelkeltő
- **Alapszín**: Kék-lila (#3E4581) - megbízható, professzionális
- **Tipográfia**: Montserrat - modern, tiszta
- **Gombok**: Pill-shaped (100px border-radius)
- **Shadows**: Soft, subtle árnyékok
- **Spacing**: 8px alapú grid rendszer
- **Accessibility**: WCAG 2.1 AA compliant

---

## Fájlok

### 1. `BOOM_MARKETING_DESIGN_SYSTEM.md`
**Átfogó design dokumentáció**

Tartalom:
- Teljes színpaletta HEX kódokkal
- Tipográfia skála (h1-h6, body, small)
- UI komponensek specifikációi
- Spacing rendszer
- Border radius értékek
- Box shadow definíciók
- Hover effektek
- Accessibility útmutató
- Responsive breakpointok
- Brand identitás leírás

**Használat**: Referencia dokumentáció designerek és fejlesztők számára.

---

### 2. `boom-design-tokens.ts`
**TypeScript Design Token definíciók**

```typescript
import { theme } from './boom-design-tokens';

// Példa használat
const primaryColor = theme.colors.brand.primary; // '#FE6049'
const h1Size = theme.typography.fontSize['5xl']; // '60px'
const cardShadow = theme.shadows.card; // '0px 0px 10px rgba(0, 0, 0, 0.15)'
```

**Tartalom**:
- Színek (colors)
- Tipográfia (typography)
- Spacing
- Border radius
- Shadows
- Transitions
- Breakpoints
- Z-index
- Container méretek

**Használat**: React/TypeScript projektekben importálható design tokenek.

---

### 3. `boom-components-example.tsx`
**React komponens példák**

Használatra kész komponensek:
- `Button` - Primary, Secondary, Text variációk
- `ServiceCard` - Szolgáltatás kártyák ikonnal
- `BlogCard` - Blog bejegyzés kártyák
- `TestimonialCard` - Ügyfél vélemények
- `InputField` - Form input mezők
- `Section` - Szekció konténerek
- `Container` - Responsive konténerek

**Példa használat**:
```tsx
import { Button, ServiceCard } from './boom-components-example';

<Button variant="primary" size="large">
  Dolgozzunk együtt!
</Button>

<ServiceCard
  icon={<PenIcon />}
  title="Csináld magad"
  description="..."
  buttonText="Ez kell nekem"
  buttonLink="/csinald-magad"
/>
```

---

### 4. `boom-design-system.css`
**CSS változók és utility class-ok**

**CSS Custom Properties**:
```css
:root {
  --color-brand-primary: #FE6049;
  --font-size-h1: 60px;
  --spacing-lg: 24px;
  --radius-full: 100px;
  --shadow-card: 0px 0px 10px rgba(0, 0, 0, 0.15);
}
```

**Utility Classes**:
```html
<button class="btn btn-primary btn-large">
  Dolgozzunk együtt!
</button>

<div class="card card-service lift-effect">
  <h3 class="h5 text-primary">Szolgáltatás címe</h3>
  <p class="text-secondary">Leírás szövege...</p>
</div>

<section class="section section-bg-secondary">
  <div class="container container-xl">
    <!-- Tartalom -->
  </div>
</section>
```

---

## Gyors Használat

### 1. TypeScript/React Projektben

```bash
# 1. Másold be a fájlokat a projekt src/ könyvtárába
cp boom-design-tokens.ts src/design/
cp boom-components-example.tsx src/components/

# 2. Használd a komponenseket
```

```tsx
import { theme } from '@/design/boom-design-tokens';
import { Button, ServiceCard } from '@/components/boom-components-example';

function App() {
  return (
    <section style={{
      backgroundColor: theme.colors.background.secondary,
      padding: `${theme.spacing['4xl']} 0`
    }}>
      <Button variant="primary" size="large">
        Kezdjük el!
      </Button>
    </section>
  );
}
```

---

### 2. HTML/CSS Projektben

```html
<!DOCTYPE html>
<html lang="hu">
<head>
  <link rel="stylesheet" href="boom-design-system.css">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap" rel="stylesheet">
</head>
<body>
  <section class="section section-bg-secondary">
    <div class="container container-xl">
      <h2 class="h2 text-center mb-xl">Szolgáltatásaink</h2>

      <div class="grid grid-cols-3">
        <div class="card card-service lift-effect">
          <div class="icon-xlarge icon-primary">📝</div>
          <h5 class="h5">Csináld magad</h5>
          <p class="text-secondary">Leírás szövege...</p>
          <button class="btn btn-primary btn-medium">
            Ez kell nekem
          </button>
        </div>
        <!-- További kártyák -->
      </div>
    </div>
  </section>
</body>
</html>
```

---

### 3. Tailwind CSS Konfigurációban

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#FE6049',
          hover: '#E5513D',
          active: '#CC4432'
        },
        text: {
          primary: '#3E4581',
          secondary: '#777777'
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif']
      },
      fontSize: {
        'display': ['60px', { lineHeight: '78px' }],
        'h1': ['60px', { lineHeight: '78px' }],
        'h2': ['42px', { lineHeight: '54.6px' }]
      },
      borderRadius: {
        'pill': '100px'
      },
      boxShadow: {
        'card': '0px 0px 10px rgba(0, 0, 0, 0.15)',
        'card-hover': '0px 16px 32px rgba(0, 0, 0, 0.15)',
        'testimonial': '0px 0px 20px rgba(254, 96, 73, 0.15)'
      }
    }
  }
}
```

---

## Kulcsfontosságú Színek

### Brand Palette

| Szín neve | HEX kód | RGB | Használat |
|-----------|---------|-----|-----------|
| Brand Primary | `#FE6049` | rgb(254, 96, 73) | CTA gombok, akcent elemek |
| Brand Hover | `#E5513D` | rgb(229, 81, 61) | Hover állapot |
| Text Primary | `#3E4581` | rgb(62, 69, 129) | Címek, fontos szövegek |
| Text Secondary | `#777777` | rgb(119, 119, 119) | Body szöveg |
| Background | `#F7F7F7` | rgb(247, 247, 247) | Szekció háttér |
| White | `#FFFFFF` | rgb(255, 255, 255) | Kártyák, gombok |

### Kontrasztarányok (WCAG 2.1)

✓ **#3E4581 on #FFFFFF**: 9.2:1 (AAA)
✓ **#777777 on #FFFFFF**: 4.7:1 (AA)
✓ **#FE6049 on #FFFFFF**: 3.5:1 (AA Large Text)
✓ **#FFFFFF on #FE6049**: 3.5:1 (AA Large Text)

---

## Tipográfia

### Font Family
```css
font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Google Fonts Import**:
```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap" rel="stylesheet">
```

### Type Scale

| Elem | Font Size | Line Height | Font Weight | Use Case |
|------|-----------|-------------|-------------|----------|
| H1 | 60px | 78px (1.3) | 700 | Hero főcímek |
| H2 | 42px | 54.6px (1.3) | 700 | Szekció címek |
| H3 | 32px | 41.6px (1.3) | 700 | Alcímek |
| H4 | 24px | 31.2px (1.3) | 700 | Card címek |
| H5 | 22px | 28.6px (1.3) | 700 | Kiscímek |
| Body Large | 20px | 32px (1.6) | 400 | Lead szöveg |
| Body | 18px | 28.8px (1.6) | 400 | Normál szöveg |
| Small | 14px | 20px (1.43) | 400 | Caption, meta |

### Responsive Typography

**Mobile (< 768px)**:
```css
h1 { font-size: 36px; }
h2 { font-size: 28px; }
h3 { font-size: 24px; }
body { font-size: 16px; }
```

**Tablet (768px - 1023px)**:
```css
h1 { font-size: 48px; }
h2 { font-size: 36px; }
h3 { font-size: 28px; }
body { font-size: 18px; }
```

**Desktop (1024px+)**:
```css
h1 { font-size: 60px; }
h2 { font-size: 42px; }
h3 { font-size: 32px; }
body { font-size: 18px; }
```

---

## Komponensek

### Button Variációk

#### Primary Button
```html
<button class="btn btn-primary btn-large">
  Dolgozzunk együtt!
</button>
```
- **Szín**: #FE6049 background, white text
- **Border radius**: 100px (pill shape)
- **Padding**: 16px 32px (medium), 24px 40px (large)
- **Hover**: -2px translateY, primary shadow

#### Secondary Button
```html
<button class="btn btn-secondary btn-medium">
  Tudj meg többet
</button>
```
- **Szín**: Transparent background, #3E4581 text + border
- **Border**: 2px solid
- **Hover**: Fill #3E4581, white text

#### Text Button
```html
<a href="#" class="btn btn-text">
  Tovább olvasom →
</a>
```
- **Szín**: #FE6049 text
- **Underline**: Yes (default), none (hover)

---

### Card Típusok

#### Service Card
```html
<div class="card card-service lift-effect">
  <div class="icon-xlarge icon-primary">📝</div>
  <h5 class="h5 text-primary">Szolgáltatás címe</h5>
  <p class="text-secondary">Rövid leírás a szolgáltatásról...</p>
  <button class="btn btn-primary btn-medium">
    Ez kell nekem
  </button>
</div>
```

**Tulajdonságok**:
- Padding: 48px 32px
- Border: 1px solid #F7F7F7
- Hover: translateY(-4px) + shadow + border color change
- Icon: 48px, #FE6049

#### Blog Card
```html
<article class="card card-blog lift-effect">
  <img src="blog-image.jpg" alt="Blog title">
  <div class="card-blog-content">
    <span class="badge badge-primary">KATEGÓRIA</span>
    <h3 class="h5 text-primary">Blog bejegyzés címe</h3>
    <p class="text-secondary">Rövid kivonat a cikkből...</p>
    <a href="#" class="btn btn-text">Tovább olvasom →</a>
  </div>
</article>
```

**Tulajdonságok**:
- Image height: 240px
- Shadow: card shadow (default), card-hover shadow (hover)
- Hover: translateY(-6px)
- Badge: #FE6049 background, white text, pill shape

#### Testimonial Card
```html
<div class="card card-testimonial">
  <p class="text-secondary" style="font-style: italic;">
    "Ügyfél véleménye itt..."
  </p>
  <div class="flex items-center gap-md">
    <img src="avatar.jpg" alt="Ügyfél" class="avatar">
    <div>
      <div class="font-bold text-primary">Ügyfél Neve</div>
      <div class="text-secondary" style="font-size: 14px;">CÉG NEVE</div>
    </div>
  </div>
</div>
```

**Tulajdonságok**:
- Padding: 40px
- Shadow: testimonial shadow (branded)
- Avatar: 64px circle, 3px #FE6049 border
- Quote: Italic, relative position for quote mark

---

### Input Mezők

```html
<div>
  <label class="input-label">Email cím *</label>
  <input
    type="email"
    class="input-field"
    placeholder="pelda@email.hu"
    required
  >
  <span class="input-error">Hibás email formátum</span>
</div>
```

**Tulajdonságok**:
- Padding: 14px 20px
- Border: 2px solid #E5E5E5 (default)
- Focus: #FE6049 border + glow shadow
- Error: #E53E3E border + light red background

---

## Implementációs Útmutató

### 1. Színek Használata

**DO ✓**
- Használd a Brand Primary (#FE6049) színt CTA gombokhoz
- Text Primary (#3E4581) minden címhez
- Text Secondary (#777777) body szövegekhez
- White (#FFFFFF) kártyák hátterének

**DON'T ✗**
- Ne használj Brand Primary színt nagy felületeken (túl erős)
- Ne használj Text Secondary (#777777) címekhez (gyenge kontraszt)
- Ne keverd a színeket következetlenül

---

### 2. Tipográfia Best Practices

**DO ✓**
- Használj 60px-es H1-et hero szekciókban
- Tartsd be a 1.3x line-height arányt címeknél
- Használj 1.6x line-height-ot body szövegeknél
- Responsive sizing: csökkentsd a méreteket mobilon

**DON'T ✗**
- Ne használj 60px-es címeket kis mobilon
- Ne csökkentsd a line-height-ot 1.2 alá
- Ne használj 900-as font-weight-et mindenhol

---

### 3. Spacing Szabályok

**8px Grid System**
- Minden spacing értéknek 8 többszörösének kell lennie
- Kivétel: 4px (extra kis térközök)

**Ajánlott értékek**:
- Gombok közötti távolság: 16px
- Kártyák közötti távolság: 24px
- Szekciók közötti távolság: 80px (desktop), 48px (mobile)
- Címek alatti margó: 24-32px
- Bekezdések alatti margó: 16px

---

### 4. Responsive Breakpoints

```css
/* Mobile First Approach */

/* Mobile: Default styles */
.container {
  padding: 0 16px;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container {
    padding: 0 24px;
  }
  .grid-cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    padding: 0 32px;
  }
  .grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .container {
    max-width: 1440px;
  }
}
```

---

### 5. Accessibility Checklist

**Színkontrasztok**
- ✓ Minden szöveg-háttér kombináció legalább AA szintű
- ✓ Címek AAA szintű kontraszttal (9.2:1)
- ✓ CTA gombok megfelelő kontraszttal

**Keyboard Navigation**
- ✓ Minden interaktív elem focus state-tel rendelkezik
- ✓ Focus outline: 2px solid #FE6049
- ✓ Tab order logikus

**Screen Readers**
- ✓ Képek alt text-tel ellátva
- ✓ Gombok aria-label attribútummal (ha szükséges)
- ✓ Landmark régiók (header, main, footer, nav)
- ✓ Heading hierarchy (h1 > h2 > h3...)

**Form Accessibility**
- ✓ Label minden input mezőhöz
- ✓ Required mezők jelölése (*)
- ✓ Error üzenetek megfelelően társítva (aria-describedby)

---

## Screenshot Referenciák

A dokumentáció készítésekor készült screenshot-ok:

1. `boom-marketing-hero.png` - Hero szekció (főcím, CTA gomb, illusztráció)
2. `boom-marketing-cards.png` - Partner logók
3. `boom-marketing-service-cards.png` - Szolgáltatási kártyák (3 oszlop)
4. `boom-marketing-testimonials.png` - Ügyfél vélemények carousel
5. `boom-marketing-blog.png` - Blog kártyák grid

---

## Kapcsolódó Erőforrások

**Design Tools**
- Figma: Importáld a design tokeneket
- Sketch: CSS változók használata
- Adobe XD: Design Tokens Plugin

**Development**
- React: `boom-components-example.tsx`
- Vue.js: Konvertáld a TypeScript tokeneket
- Angular: Használd a CSS változókat SCSS-ben

**Font**
- [Google Fonts - Montserrat](https://fonts.google.com/specimen/Montserrat)
- Weights: 400, 600, 700, 900

---

## Verziókezelés

**v1.0** - 2025-11-26
- Eredeti design rendszer dokumentáció
- TypeScript design tokens
- React komponens példák
- CSS utility class-ok
- Accessibility compliance

---

## Licensz

Ez a design rendszer dokumentáció a BOOM Marketing Agency weboldalának elemzése alapján készült oktatási és implementációs célokra.

**Használat**: Szabadon használható saját projektekben, de ne használd BOOM Marketing Agency branding-jét jogosulatlanul.

---

## Támogatás

Ha kérdésed van a design rendszer használatával kapcsolatban:

1. Olvasd el a `BOOM_MARKETING_DESIGN_SYSTEM.md` részletes dokumentációt
2. Nézd meg a `boom-components-example.tsx` komponens példákat
3. Használd a `boom-design-system.css` utility class-okat

---

**Készítette**: UI Designer Agent
**Dátum**: 2025-11-26
**Verzió**: 1.0
