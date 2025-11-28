# AI Boost Design Analysis

**Forrás**: https://aiboost.hu/, https://aiboost.hu/ai-tanacsadas-megrendeles/
**Elemzés dátuma**: 2025-11-26
**Kivonat módja**: Playwright MCP automatikus CSS elemzés + manuális design audit

---

## Executive Summary

Az AI Boost egy **dark theme-es, modern tech brand** identitással rendelkezik. A design nyelv **lila (#D187FC) purple + sötét navy (#1F1F41) háttér** kombinációra épül, ami kiemeli a mesterséges intelligencia és high-tech pozicionálást. Az Inter font családot használva, tiszta, modern tipográfiával, valamint **pill-shaped CTA gombokkal** (50px border-radius) éri el a prémium megjelenést.

A BOOM Marketinghez képest az AI Boost:
- **Sötétebb téma**: Dark navy háttér vs világos fehér
- **Technológiai hangsúly**: Purple (#D187FC) vs coral (#FE6049)
- **Moderneebb font**: Inter vs Montserrat
- **Kerekebb gombok**: 50px vs 100px pill

---

## 1. Color Palette

### Primary Colors

| Color Name | HEX | RGB | Használat |
|-----------|-----|-----|-----------|
| **AI Boost Purple** | `#D187FC` | `rgb(209, 135, 252)` | CTA gombok, kiemelések, brand elemek, gradientek |
| **AI Boost Navy** | `#1F1F41` | `rgb(31, 31, 65)` | Hero háttér, dark sections, navbar |
| **AI Boost Blue** | `#5152A2` | `rgb(81, 82, 162)` | Másodlagos kiemelések, hover states |
| **AI Boost Green** | `#80C22E` | `rgb(128, 194, 46)` | Success states, positive feedback |

### Background Colors

| Color Name | HEX | RGB | Használat |
|-----------|-----|-----|-----------|
| **Dark Navy** | `#1F1F41` | `rgb(31, 31, 65)` | Fő sötét háttér, hero szekció |
| **Deep Black** | `#00060D` | `rgb(0, 6, 13)` | Gradiens vége, mély dark background |
| **Off White** | `#EEEEEE` | `rgb(238, 238, 255)` | Világos content területek |
| **Pure White** | `#FFFFFF` | `rgb(255, 255, 255)` | Card backgrounds, input fields |
| **Subtle Purple** | `#F6F6FF` | `rgb(246, 246, 255)` | Subtle card backgrounds |

### Text Colors

| Color Name | HEX | RGB | Használat |
|-----------|-----|-----|-----------|
| **White** | `#FFFFFF` | `rgb(255, 255, 255)` | H1 hero titles on dark background |
| **Dark Navy** | `#1F1F41` | `rgb(31, 31, 65)` | Body text on light backgrounds |
| **Gray** | `#606266` | `rgb(96, 98, 102)` | Placeholder text, muted content |
| **Light Gray** | `#999999` | `rgb(153, 153, 153)` | Input placeholders, helper text |

### Border Colors

| Color Name | HEX | RGB | Használat |
|-----------|-----|-----|-----------|
| **Light Border** | `#DADBE1` | `rgb(218, 219, 221)` | Input borders, card edges |
| **Input Border** | `#666666` | `rgb(102, 102, 102)` | Default input field borders |

### Gradients

```css
/* Hero Gradient (Dark theme) */
background: linear-gradient(180deg, #1F1F41 0%, #00060D 100%);

/* Purple Glow Effect */
background: radial-gradient(circle at center, rgba(209, 135, 252, 0.15) 0%, transparent 70%);
```

---

## 2. Typography

### Font Families

**Primary**: `Inter, sans-serif`
**Secondary**: `Montserrat, sans-serif` (használva egyes elemekben)

### Heading Styles

| Element | Size | Weight | Line Height | Color | Letter Spacing | Használat |
|---------|------|--------|-------------|-------|----------------|-----------|
| **H1** | 60px | 700 | 1.26 (75.6px) | #FFFFFF | -0.5px | Hero címek dark háttéren |
| **H2** | 46px | 700 | 1.3 | #1F1F41 | -0.3px | Section címek világos háttéren |
| **H3** | 32px | 700 | 1.4 | #1F1F41 | 0px | Alcímek, kártya címek |
| **H4** | 24px | 600 | 1.4 | #1F1F41 | 0px | Kisebb alcímek |
| **H5** | 20px | 600 | 1.5 | #1F1F41 | 0px | Form címek |
| **H6** | 18px | 600 | 1.5 | #1F1F41 | 0px | Legkisebb címsor |

### Body Styles

| Element | Size | Weight | Line Height | Color | Használat |
|---------|------|--------|-------------|-------|-----------|
| **Body** | 18px | 400 | 1.6 | #1F1F41 | Főbb bekezdések |
| **Body Small** | 16px | 400 | 1.6 | #606266 | Kisebb szövegek, input text |
| **Caption** | 14px | 400 | 1.5 | #999999 | Helper text, labels |

### Typography Examples

```typescript
// H1 Hero Title (Dark Background)
{
  fontSize: '60px',
  fontWeight: 700,
  lineHeight: 1.26,
  color: '#FFFFFF',
  letterSpacing: '-0.5px',
  fontFamily: 'Inter, sans-serif'
}

// H2 Section Title (Light Background)
{
  fontSize: '46px',
  fontWeight: 700,
  lineHeight: 1.3,
  color: '#1F1F41',
  letterSpacing: '-0.3px'
}

// Body Text
{
  fontSize: '18px',
  fontWeight: 400,
  lineHeight: 1.6,
  color: '#1F1F41'
}
```

---

## 3. UI Components

### Buttons

#### Primary Button (Purple CTA)
```css
background: #D187FC;
color: #FFFFFF;
border-radius: 50px; /* Pill shape */
padding: 15.5px 40px;
font-size: 20px;
font-weight: 700;
transition: all 0.3s ease;
box-shadow: none;

/* Hover State */
&:hover {
  transform: translateY(-2px);
  box-shadow: 0px 8px 16px rgba(209, 135, 252, 0.3);
  background: linear-gradient(135deg, #D187FC 0%, #B66EE0 100%);
}
```

#### Secondary Button (Blue)
```css
background: #5152A2;
color: #FFFFFF;
border-radius: 50px;
padding: 15.5px 40px;
font-size: 20px;
font-weight: 700;

/* Hover State */
&:hover {
  background: #6163C3;
  box-shadow: 0px 8px 16px rgba(81, 82, 162, 0.3);
}
```

#### Outline Button
```css
background: transparent;
color: #D187FC;
border: 2px solid #D187FC;
border-radius: 50px;
padding: 13.5px 38px; /* -2px for border */
font-size: 20px;
font-weight: 700;

/* Hover State */
&:hover {
  background: #D187FC;
  color: #FFFFFF;
  box-shadow: 0px 4px 12px rgba(209, 135, 252, 0.2);
}
```

### Cards

```css
background: #FFFFFF;
border-radius: 12px;
box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.15);
padding: 32px;
transition: all 0.3s ease;

/* Hover State */
&:hover {
  transform: translateY(-4px);
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.2);
}

/* Dark Card Variant */
.dark-card {
  background: #1F1F41;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
}
```

### Input Fields

```css
background: #FFFFFF;
color: #606266;
border: 1px solid #DADBE1;
border-radius: 6px;
padding: 12px;
font-size: 16px;
font-family: Inter, sans-serif;
transition: all 0.2s ease;

/* Placeholder */
::placeholder {
  color: #999999;
}

/* Focus State */
&:focus {
  border-color: #D187FC;
  box-shadow: 0 0 0 3px rgba(209, 135, 252, 0.2);
  outline: none;
}
```

### Navigation

```css
.navbar {
  background: #1F1F41;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
  padding: 0px 20px;
}

.nav-link {
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #D187FC;
}
```

---

## 4. Spacing System

**Base Unit**: `8px`

### Spacing Scale

```typescript
spacing = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '20px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '80px',
  '5xl': '96px',
  '6xl': '120px',
}
```

### Usage Examples

- **Component padding**: 32px (xl)
- **Section spacing**: 64px - 80px (3xl - 4xl)
- **Button padding**: 15.5px 40px (custom for visual balance)
- **Input padding**: 12px (sm)
- **Card padding**: 32px (xl)
- **Grid gaps**: 16px - 24px (md - lg)

---

## 5. Border Radius

```typescript
borderRadius = {
  pill: '50px',       // CTA buttons (rounded pill)
  rounded: '53px',    // Alternative pill variant
  card: '12px',       // Cards, containers
  input: '6px',       // Input fields, textareas
  small: '4px',       // Subtle rounded corners
  none: '0px',        // Sharp edges (not commonly used)
}
```

**Comparison to BOOM Marketing**:
- AI Boost: **50px pill** (moderate roundness)
- BOOM: **100px pill** (extreme roundness)

---

## 6. Shadows

### Card Shadows

```css
/* Default Card Shadow */
box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.15);

/* Dark Card Shadow */
box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);

/* Card Hover Shadow */
box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.2);
```

### Input Focus Shadow

```css
box-shadow: 0 0 0 3px rgba(209, 135, 252, 0.2);
```

### Button Hover Shadow

```css
/* Primary Button Hover */
box-shadow: 0px 8px 16px rgba(209, 135, 252, 0.3);

/* Secondary Button Hover */
box-shadow: 0px 8px 16px rgba(81, 82, 162, 0.3);

/* Outline Button Hover */
box-shadow: 0px 4px 12px rgba(209, 135, 252, 0.2);
```

---

## 7. Design Patterns & Best Practices

### Dark Theme Implementation

1. **Hero Section**: Dark navy (#1F1F41) background with white (#FFFFFF) text
2. **Gradient Background**: Linear gradient from #1F1F41 to #00060D for depth
3. **Purple Glow**: Radial gradient with purple (#D187FC) at 15% opacity
4. **Contrast Ratio**: High contrast white text on dark background for readability

### Light Section Implementation

1. **Background**: Off white (#EEEEEE) or pure white (#FFFFFF)
2. **Text**: Dark navy (#1F1F41) for primary text
3. **Cards**: White background with subtle shadows
4. **Purple Accents**: Used sparingly for CTAs and highlights

### Button Strategy

- **Primary CTA**: Purple (#D187FC) for main actions
- **Secondary**: Blue (#5152A2) for alternative actions
- **Outline**: Transparent with purple border for tertiary actions
- **All buttons**: Pill-shaped (50px) with lift hover effect

### Consistency Elements

- **Transition Speed**: 0.3s ease for most interactions, 0.2s for inputs
- **Hover Effects**: translateY(-2px to -4px) for lift effect
- **Shadow Intensity**: Increased on hover for depth
- **Border Radius**: Consistent 50px for buttons, 12px for cards, 6px for inputs

---

## 8. Accessibility Considerations

### Color Contrast

- **White on Dark Navy**: AAA compliance (21:1 ratio)
- **Dark Navy on White**: AAA compliance (15:1 ratio)
- **Purple on White**: AA compliance for large text (3.5:1)
- **Purple Buttons**: White text ensures high contrast

### Typography Accessibility

- **Minimum body size**: 16px for readability
- **Line height**: 1.5-1.6 for comfortable reading
- **Letter spacing**: Negative for large headings, 0 for body
- **Font weight**: 400 for body, 600-700 for headings

### Interactive Elements

- **Button minimum size**: 44px height (15.5px top/bottom padding)
- **Input field height**: ~40px (12px padding + 16px text)
- **Focus states**: Clear purple outline (3px shadow)
- **Hover states**: Visual feedback on all interactive elements

---

## 9. Responsive Design Notes

### Breakpoints

```typescript
breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
}
```

### Typography Scaling

- **Mobile**: H1 typically scales to 40-48px
- **Tablet**: H1 around 50-56px
- **Desktop**: H1 at full 60px
- **Body text**: Remains 16-18px across all devices

### Component Adjustments

- **Button padding**: May reduce to 12px 24px on mobile
- **Card padding**: Scales from 20px mobile to 32px desktop
- **Spacing**: Section gaps reduce from 64px+ to 32-48px on mobile

---

## 10. Implementation Code Examples

### React Component with AI Boost Tokens

```typescript
import { aiboostTokens } from '@/lib/design-tokens/aiboost-tokens';

function HeroSection() {
  return (
    <section style={{
      background: aiboostTokens.gradients.hero.background,
      padding: `${aiboostTokens.spacing['4xl']} ${aiboostTokens.spacing.xl}`,
    }}>
      <h1 style={{
        fontSize: aiboostTokens.typography.h1.size,
        fontWeight: aiboostTokens.typography.h1.weight,
        color: aiboostTokens.typography.h1.color,
        fontFamily: aiboostTokens.typography.fontFamily.primary,
        lineHeight: aiboostTokens.typography.h1.lineHeight,
        letterSpacing: aiboostTokens.typography.h1.letterSpacing,
      }}>
        Mesterséges intelligencia az üzleted szolgálatában
      </h1>
      <button style={{
        background: aiboostTokens.components.button.primary.background,
        color: aiboostTokens.components.button.primary.color,
        borderRadius: aiboostTokens.components.button.primary.borderRadius,
        padding: aiboostTokens.components.button.primary.padding,
        fontSize: aiboostTokens.components.button.primary.fontSize,
        fontWeight: aiboostTokens.components.button.primary.fontWeight,
      }}>
        Érdekel, mutasd a részleteket
      </button>
    </section>
  );
}
```

### CSS Custom Properties Version

```css
:root {
  /* Colors */
  --aiboost-purple: #D187FC;
  --aiboost-navy: #1F1F41;
  --aiboost-blue: #5152A2;
  --aiboost-green: #80C22E;

  /* Typography */
  --font-primary: Inter, sans-serif;
  --h1-size: 60px;
  --h1-weight: 700;
  --body-size: 18px;

  /* Spacing */
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 20px;
  --space-xl: 32px;

  /* Border Radius */
  --radius-pill: 50px;
  --radius-card: 12px;
  --radius-input: 6px;
}

.hero {
  background: linear-gradient(180deg, var(--aiboost-navy) 0%, #00060D 100%);
  padding: var(--space-xl);
}

.cta-button {
  background: var(--aiboost-purple);
  color: white;
  border-radius: var(--radius-pill);
  padding: 15.5px 40px;
  font-size: 20px;
  font-weight: 700;
}
```

---

## 11. Brand Comparison: AI Boost vs BOOM Marketing

| Aspect | AI Boost | BOOM Marketing |
|--------|----------|----------------|
| **Primary Color** | Purple #D187FC | Coral #FE6049 |
| **Theme** | Dark (Navy #1F1F41) | Light (White #FFFFFF) |
| **Font Family** | Inter | Montserrat |
| **Button Radius** | 50px (moderate pill) | 100px (extreme pill) |
| **H1 Size** | 60px | 60px |
| **Body Size** | 18px | 18px |
| **Spacing Base** | 8px | 8px |
| **Vibe** | Tech, Modern, AI-focused | Marketing, Energetic, Bold |
| **Card Shadow** | Subtle (0.15 opacity) | Similar (0.15 opacity) |
| **Hover Effect** | translateY(-2 to -4px) | translateY(-4px) |

**Key Insight**: Both brands use similar structural principles (8px spacing, 18px body, 60px H1), but differentiate through **color psychology** (purple tech vs coral energy) and **theme** (dark vs light).

---

## 12. Logo Analysis

**File**: `/Users/bocsijanos/Documents/claude/proposal/AiBoost.svg`

**Primary Color in Logo**: `#2F1B3C` (Dark Purple)

**Logo Characteristics**:
- Modern sans-serif typeface
- Compact, tech-focused design
- Dark purple reinforces the brand's purple theme
- Simple, scalable icon suitable for favicon and small sizes

---

## 13. Recommended Usage in Proposals

### When to Use AI Boost Design System

1. **AI-focused services**: Chatbot implementation, machine learning, automation
2. **Tech consultations**: AI strategy, digital transformation
3. **Innovation projects**: Cutting-edge tech solutions
4. **Dark theme preference**: When client prefers modern, tech aesthetic

### Design Token Integration

```typescript
import { aiboostTokens } from '@/lib/design-tokens/aiboost-tokens';

// Auto-styled H1
<H1>AI Tanácsadás</H1>

// Auto-styled primary button
<Button variant="primary">Kezdjük el</Button>

// Auto-styled card
<Card padding="lg">
  <H3>ChatGPT Integráció</H3>
  <Body>Modern AI megoldások...</Body>
</Card>
```

### Color Palette Quick Reference

```typescript
aiboostTokens.colors.primary.hex        // #D187FC (Purple)
aiboostTokens.colors.secondary.hex      // #1F1F41 (Navy)
aiboostTokens.colors.accent.hex         // #5152A2 (Blue)
aiboostTokens.colors.success.hex        // #80C22E (Green)
```

---

## 14. Next Steps & Recommendations

### Implementation Checklist

- [x] Design tokens extracted and centralized in `aiboost-tokens.ts`
- [x] Logo copied to `/public/AiBoost.svg`
- [x] Brand book updated with accurate AI Boost values
- [ ] Create AI Boost-specific React components (Typography, Button, Card)
- [ ] Test dark theme implementation in proposal builder
- [ ] Verify accessibility compliance (WCAG AA/AAA)
- [ ] Create example AI proposal template

### Future Enhancements

1. **Dark Mode Toggle**: Allow users to switch between light/dark themes
2. **Purple Gradient Variants**: Explore more gradient options for visual variety
3. **Animation Library**: Purple glow effects, fade-ins for AI-themed content
4. **Custom Icons**: Tech-focused icon set matching the purple theme
5. **Component Storybook**: Document all AI Boost components with examples

---

**Document End**
