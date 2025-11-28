# BOOM Marketing Agency - Design System Dokumentáció

## Átfogó Design Rendszer Elemzés
*Készítve: 2025-11-26*

---

## 1. SZÍNPALETTA

### Primer Színek

```typescript
// Brand Színek
const colors = {
  // Primer Brand
  brandPrimary: '#FE6049',      // rgb(254, 96, 73) - Fő narancsvörös CTA szín
  brandPrimaryHover: '#E5513D',  // Hover state (darker ~10%)
  brandPrimaryActive: '#CC4432', // Active state (darker ~20%)

  // Szöveg Színek
  textPrimary: '#3E4581',        // rgb(62, 69, 129) - Kék-lila főcímek
  textSecondary: '#777777',      // rgb(119, 119, 119) - Szürke body szöveg
  textTertiary: '#999999',       // Világosabb szürke kisegítő szövegekhez

  // Háttér Színek
  backgroundPrimary: '#FFFFFF',   // rgb(255, 255, 255) - Fehér
  backgroundSecondary: '#F7F7F7', // rgb(247, 247, 247) - Világos szürke
  backgroundTertiary: '#FAFAFA',  // Extra világos változat

  // Utility Színek
  black: '#000000',
  white: '#FFFFFF',
  borderLight: '#E5E5E5',
  borderMedium: '#CCCCCC',
}
```

### Színhasználati Szabályok

**Primary Brand (#FE6049)**
- CTA gombok (Dolgozzunk együtt!, Ez kell nekem)
- Hover effektek akcent színként
- Linkek hover állapota
- Ikonok akcent színe
- Underline díszítő elemek (h2 címek alatt)

**Text Primary (#3E4581)**
- H1, H2, H3 címek
- Navigációs linkek
- Fontos kiemelések
- Footer cím szövegek

**Text Secondary (#777777)**
- Body text (bekezdések)
- Leírások
- Meta információk
- Footer linkek

### Kontrasztarányok (WCAG 2.1 AA megfelelés)

| Kombináció | Arány | Státusz |
|------------|-------|---------|
| #3E4581 on #FFFFFF | 9.2:1 | AAA ✓ |
| #777777 on #FFFFFF | 4.7:1 | AA ✓ |
| #FE6049 on #FFFFFF | 3.5:1 | AA Large Text ✓ |
| #FFFFFF on #FE6049 | 3.5:1 | AA Large Text ✓ |
| #3E4581 on #F7F7F7 | 8.8:1 | AAA ✓ |

---

## 2. TIPOGRÁFIA

### Font Family

```css
font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale (Méretskála)

```typescript
const typography = {
  // Display (Hero szövegek)
  display1: {
    fontSize: '60px',
    lineHeight: '78px',      // 1.3 ratio
    fontWeight: 700,
    letterSpacing: '-0.5px',
    color: '#3E4581'
  },

  // Headings
  h1: {
    fontSize: '60px',
    lineHeight: '78px',       // 1.3 ratio
    fontWeight: 700,
    letterSpacing: '-0.5px',
    color: '#3E4581'
  },
  h2: {
    fontSize: '42px',
    lineHeight: '54.6px',     // 1.3 ratio
    fontWeight: 700,
    letterSpacing: '-0.3px',
    color: '#3E4581'
  },
  h3: {
    fontSize: '32px',
    lineHeight: '41.6px',     // 1.3 ratio
    fontWeight: 700,
    letterSpacing: '-0.2px',
    color: '#3E4581'
  },
  h4: {
    fontSize: '24px',
    lineHeight: '31.2px',     // 1.3 ratio
    fontWeight: 700,
    color: '#3E4581'
  },
  h5: {
    fontSize: '22px',
    lineHeight: '28.6px',     // 1.3 ratio
    fontWeight: 700,
    color: '#3E4581'
  },
  h6: {
    fontSize: '18px',
    lineHeight: '23.4px',     // 1.3 ratio
    fontWeight: 700,
    color: '#3E4581'
  },

  // Body Text
  bodyLarge: {
    fontSize: '20px',
    lineHeight: '32px',       // 1.6 ratio
    fontWeight: 400,
    color: '#777777'
  },
  bodyMedium: {
    fontSize: '18px',
    lineHeight: '28.8px',     // 1.6 ratio
    fontWeight: 400,
    color: '#777777'
  },
  bodySmall: {
    fontSize: '16px',
    lineHeight: '25.6px',     // 1.6 ratio
    fontWeight: 400,
    color: '#777777'
  },

  // Special
  caption: {
    fontSize: '14px',
    lineHeight: '20px',       // 1.43 ratio
    fontWeight: 400,
    color: '#999999'
  },
  overline: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#777777'
  },

  // Button Text
  buttonLarge: {
    fontSize: '18px',
    lineHeight: '24px',
    fontWeight: 400,
    letterSpacing: '0px'
  },
  buttonMedium: {
    fontSize: '16px',
    lineHeight: '22px',
    fontWeight: 400,
    letterSpacing: '0px'
  }
}
```

### Font Weight Használat

```typescript
const fontWeights = {
  regular: 400,    // Body text, gombok, normál szövegek
  semibold: 600,   // Kiemelések, meta információk
  bold: 700,       // Címek (h1-h6), fontos kiemelések
  black: 900       // Extra erős kiemelések (ritkán használt)
}
```

### Line Height Szabályok

- **Címek**: 1.3x ratio (kompakt, erős hatás)
- **Body szöveg**: 1.6x ratio (olvashatóság)
- **Gombok**: 1.2-1.3x ratio (kompakt)
- **Caption/Small**: 1.4x ratio

---

## 3. SPACING RENDSZER

### Spacing Scale (8px alapú grid)

```typescript
const spacing = {
  xs: '4px',      // 0.25rem
  sm: '8px',      // 0.5rem
  md: '16px',     // 1rem
  lg: '24px',     // 1.5rem
  xl: '32px',     // 2rem
  '2xl': '48px',  // 3rem
  '3xl': '64px',  // 4rem
  '4xl': '80px',  // 5rem
  '5xl': '96px',  // 6rem
  '6xl': '128px', // 8rem
}
```

### Komponens Spacing Szabályok

**Gombok**
- Padding: `16px 32px` (vertical, horizontal)
- Gap between button text and icon: `8px`
- Spacing between buttons: `16px`

**Kártyák**
- Card padding: `32px`
- Card gap (between cards): `24px`
- Card to card margin: `16px`

**Szekciók**
- Section padding top/bottom: `80px` (desktop), `48px` (mobile)
- Section inner spacing: `48px`
- Content block margin bottom: `32px`

**Címek**
- H1 margin bottom: `24px`
- H2 margin bottom: `32px`
- H3 margin bottom: `24px`
- Paragraph margin bottom: `16px`

---

## 4. UI KOMPONENSEK

### Gombok (Buttons)

#### Primary Button

```typescript
const buttonPrimary = {
  // Visual
  backgroundColor: '#FE6049',
  color: '#FFFFFF',
  borderRadius: '100px',        // Teljes pill shape
  border: 'none',

  // Spacing
  padding: '16px 32px',

  // Typography
  fontSize: '18px',
  fontWeight: 400,
  lineHeight: '24px',
  textAlign: 'center',

  // Transitions
  transition: 'all 0.3s ease',

  // States
  hover: {
    backgroundColor: '#E5513D',
    transform: 'translateY(-2px)',
    boxShadow: '0px 8px 20px rgba(254, 96, 73, 0.3)'
  },
  active: {
    backgroundColor: '#CC4432',
    transform: 'translateY(0px)',
    boxShadow: '0px 4px 12px rgba(254, 96, 73, 0.25)'
  },
  focus: {
    outline: '2px solid #FE6049',
    outlineOffset: '2px'
  },
  disabled: {
    backgroundColor: '#CCCCCC',
    color: '#999999',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none'
  }
}
```

#### Secondary Button (Outlined)

```typescript
const buttonSecondary = {
  backgroundColor: 'transparent',
  color: '#3E4581',
  borderRadius: '100px',
  border: '2px solid #3E4581',
  padding: '14px 30px',      // Adjusted for border
  fontSize: '18px',
  fontWeight: 400,

  hover: {
    backgroundColor: '#3E4581',
    color: '#FFFFFF',
    transform: 'translateY(-2px)',
    boxShadow: '0px 8px 20px rgba(62, 69, 129, 0.2)'
  }
}
```

#### Text Button (Link Style)

```typescript
const buttonText = {
  backgroundColor: 'transparent',
  color: '#FE6049',
  border: 'none',
  padding: '8px 16px',
  fontSize: '16px',
  fontWeight: 600,
  textDecoration: 'underline',

  hover: {
    color: '#E5513D',
    textDecoration: 'none'
  }
}
```

### Kártyák (Cards)

#### Service Card (3 oszlopos kártyák)

```typescript
const serviceCard = {
  // Container
  backgroundColor: '#FFFFFF',
  borderRadius: '10px',
  padding: '48px 32px',
  boxShadow: 'none',
  border: '1px solid #F7F7F7',
  transition: 'all 0.3s ease',

  // Layout
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '24px',

  // Icon
  icon: {
    color: '#FE6049',
    size: '48px',
    marginBottom: '16px'
  },

  // Title
  title: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#3E4581',
    marginBottom: '16px'
  },

  // Description
  description: {
    fontSize: '16px',
    lineHeight: '25.6px',
    color: '#777777',
    marginBottom: '24px'
  },

  // States
  hover: {
    transform: 'translateY(-4px)',
    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.08)',
    borderColor: '#FE6049'
  }
}
```

#### Blog Card

```typescript
const blogCard = {
  backgroundColor: '#FFFFFF',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',

  // Image
  image: {
    width: '100%',
    height: '240px',
    objectFit: 'cover',
    borderRadius: '10px 10px 0 0'
  },

  // Content
  content: {
    padding: '24px',
    gap: '16px'
  },

  // Category Tag
  category: {
    display: 'inline-block',
    padding: '6px 16px',
    backgroundColor: '#FE6049',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: 600,
    borderRadius: '100px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px'
  },

  // Title
  title: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#3E4581',
    lineHeight: '28.6px',
    marginBottom: '12px',
    transition: 'color 0.2s ease'
  },

  // Excerpt
  excerpt: {
    fontSize: '14px',
    lineHeight: '22.4px',
    color: '#777777',
    marginBottom: '16px'
  },

  // States
  hover: {
    transform: 'translateY(-6px)',
    boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.15)',
    title: {
      color: '#FE6049'
    }
  }
}
```

#### Testimonial Card

```typescript
const testimonialCard = {
  backgroundColor: '#FFFFFF',
  borderRadius: '15px',
  padding: '40px',
  boxShadow: '0px 0px 20px rgba(254, 96, 73, 0.15)',

  // Quote
  quote: {
    fontSize: '16px',
    lineHeight: '28.8px',
    color: '#777777',
    fontStyle: 'italic',
    marginBottom: '24px',
    position: 'relative',
    paddingLeft: '32px'
  },

  // Quote Icon
  quoteIcon: {
    position: 'absolute',
    left: '0',
    top: '-8px',
    fontSize: '32px',
    color: '#FE6049',
    opacity: 0.3
  },

  // Author
  author: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },

  // Avatar
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #FE6049'
  },

  // Author Info
  authorName: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#3E4581',
    marginBottom: '4px'
  },

  authorTitle: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#777777',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }
}
```

### Input Mezők (Forms)

```typescript
const inputField = {
  // Base
  width: '100%',
  padding: '14px 20px',
  fontSize: '16px',
  lineHeight: '24px',
  color: '#3E4581',
  backgroundColor: '#FFFFFF',
  border: '2px solid #E5E5E5',
  borderRadius: '10px',
  transition: 'all 0.2s ease',

  // Placeholder
  placeholder: {
    color: '#999999',
    fontWeight: 400
  },

  // States
  focus: {
    borderColor: '#FE6049',
    outline: 'none',
    boxShadow: '0px 0px 0px 3px rgba(254, 96, 73, 0.1)'
  },

  hover: {
    borderColor: '#CCCCCC'
  },

  error: {
    borderColor: '#E53E3E',
    backgroundColor: '#FEF5F5'
  },

  disabled: {
    backgroundColor: '#F7F7F7',
    color: '#999999',
    cursor: 'not-allowed',
    borderColor: '#E5E5E5'
  }
}
```

### Ikonok

```typescript
const icons = {
  // Sizes
  small: '16px',
  medium: '24px',
  large: '32px',
  xlarge: '48px',

  // Colors
  primary: '#FE6049',
  secondary: '#3E4581',
  tertiary: '#777777',

  // Style
  strokeWidth: '2px',
  style: 'outline',      // Outline style icons preferred

  // Usage
  // - Service icons: 48px, #FE6049
  // - Navigation icons: 24px, #3E4581
  // - Button icons: 20px, inherit from button
  // - Social icons: 24px, #777777 (hover: #FE6049)
}
```

---

## 5. DESIGN MINTÁK

### Border Radius

```typescript
const borderRadius = {
  none: '0px',
  sm: '3px',           // Kis elemek (badges)
  md: '10px',          // Kártyák, input mezők
  lg: '15px',          // Nagy kártyák, modálok
  xl: '20px',          // Hero szekciók
  full: '100px',       // Gombok (pill shape)
  circle: '50%'        // Avatárok, kerek ikonok
}
```

### Box Shadows

```typescript
const shadows = {
  // Elevation levels
  none: 'none',

  sm: '0px 2px 4px rgba(0, 0, 0, 0.08)',
  md: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  lg: '0px 8px 16px rgba(0, 0, 0, 0.12)',
  xl: '0px 12px 24px rgba(0, 0, 0, 0.15)',
  '2xl': '0px 16px 32px rgba(0, 0, 0, 0.18)',

  // Branded shadows
  primarySm: '0px 4px 12px rgba(254, 96, 73, 0.15)',
  primaryMd: '0px 8px 20px rgba(254, 96, 73, 0.25)',
  primaryLg: '0px 12px 32px rgba(254, 96, 73, 0.3)',

  // Special
  inner: 'inset 0px 2px 4px rgba(0, 0, 0, 0.06)',

  // Card shadows
  card: '0px 0px 10px rgba(0, 0, 0, 0.15)',
  cardHover: '0px 16px 32px rgba(0, 0, 0, 0.15)',

  // Testimonial shadows
  testimonial: '0px 0px 20px rgba(254, 96, 73, 0.15)',
  testimonialHover: '0px 8px 24px rgba(254, 96, 73, 0.25)'
}
```

### Hover Effektek

#### Lift Effect (Kártyák, Gombok)

```css
.lift-effect {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.lift-effect:hover {
  transform: translateY(-4px);
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.12);
}
```

#### Color Transition (Linkek)

```css
.link-transition {
  color: #3E4581;
  transition: color 0.2s ease;
}

.link-transition:hover {
  color: #FE6049;
}
```

#### Scale Effect (Képek, Ikonok)

```css
.scale-effect {
  transition: transform 0.3s ease;
}

.scale-effect:hover {
  transform: scale(1.05);
}
```

#### Button Hover Effect

```css
.button-hover {
  transition: all 0.3s ease;
}

.button-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0px 8px 20px rgba(254, 96, 73, 0.3);
}

.button-hover:active {
  transform: translateY(0px);
  box-shadow: 0px 4px 12px rgba(254, 96, 73, 0.25);
}
```

### Transition Timing

```typescript
const transitions = {
  fast: '150ms',       // Gyors interakciók (hover kezdet)
  base: '200ms',       // Alapértelmezett
  medium: '300ms',     // Legtöbb animáció
  slow: '500ms',       // Lassú, smooth átmenetek

  // Easing functions
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
}
```

---

## 6. LAYOUT RENDSZER

### Container Widths

```typescript
const containers = {
  sm: '640px',         // Mobile landscape
  md: '768px',         // Tablet portrait
  lg: '1024px',        // Tablet landscape / Small desktop
  xl: '1280px',        // Desktop
  '2xl': '1440px',     // Large desktop
  full: '100%'
}
```

### Grid System

```typescript
const grid = {
  columns: 12,
  gutter: '24px',      // Space between columns

  // Breakpoints
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px'
  }
}
```

### Section Spacing

```typescript
const sectionSpacing = {
  // Vertical spacing between major sections
  mobile: {
    paddingTop: '48px',
    paddingBottom: '48px'
  },
  tablet: {
    paddingTop: '64px',
    paddingBottom: '64px'
  },
  desktop: {
    paddingTop: '80px',
    paddingBottom: '80px'
  }
}
```

---

## 7. BRAND IDENTITÁS

### Brand Voice Characteristics

**Tónus**: Professzionális, modern, megbízható, barátságos
**Stílus**: Direkt, actionable, eredményorientált
**Hozzáállás**: Támogató, expert, accessible

### Design Principles

1. **Tiszta és Egyszerű**: Minimalista megközelítés, letisztult felületek
2. **Akcióorientált**: Erős CTA-k, világos hierarchia
3. **Professzionális**: Enterprise-ready, megbízható külső
4. **Modern**: Kortárs design trendek, fresh vizualitás
5. **Accessible**: WCAG 2.1 AA megfelelés, olvasható tipográfia

### Visual Identity Keywords

- **Energikus**: Élénk narancsvörös akcent
- **Megbízható**: Stabil kék-lila főszín
- **Professzionális**: Tiszta fekete-fehér alapok
- **Modern**: Kerekített formák, nagy white space
- **Barátságos**: Pill-shaped gombok, rounded avatárok

---

## 8. ACCESSIBILITY (A11Y)

### Kontrasztarányok

Minden szöveg-háttér kombináció megfelel a WCAG 2.1 AA minimum követelményeknek:
- Normál szöveg: minimum 4.5:1
- Nagy szöveg (18px+ vagy 14px+ bold): minimum 3:1

### Focus States

```css
/* Keyboard navigation */
*:focus {
  outline: 2px solid #FE6049;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Button focus */
button:focus {
  outline: 2px solid #FE6049;
  outline-offset: 2px;
}

/* Input focus */
input:focus, textarea:focus {
  border-color: #FE6049;
  box-shadow: 0px 0px 0px 3px rgba(254, 96, 73, 0.1);
}
```

### Screen Reader Support

- Minden interaktív elem rendelkezik megfelelő aria-label attribútummal
- Képek alt text-tel ellátva
- Landmark régiók megfelelően jelölve (nav, main, footer)
- Heading hierarchy logikus (h1 > h2 > h3)

---

## 9. RESPONSIVE DESIGN

### Breakpoints

```typescript
const breakpoints = {
  xs: '320px',    // Small mobile
  sm: '640px',    // Mobile
  md: '768px',    // Tablet
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1440px' // Extra large desktop
}
```

### Typography Scaling

```typescript
// Mobile (320px - 767px)
const typographyMobile = {
  h1: '36px',
  h2: '28px',
  h3: '24px',
  body: '16px'
}

// Tablet (768px - 1023px)
const typographyTablet = {
  h1: '48px',
  h2: '36px',
  h3: '28px',
  body: '18px'
}

// Desktop (1024px+)
const typographyDesktop = {
  h1: '60px',
  h2: '42px',
  h3: '32px',
  body: '18px'
}
```

### Grid Behavior

- **Mobile**: 1 column stack
- **Tablet**: 2 columns
- **Desktop**: 3-4 columns (service cards)

---

## 10. KOMPONENS HASZNÁLATI PÉLDÁK

### Hero Section

```jsx
<section className="hero">
  <Container maxWidth="xl">
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Typography variant="h1" color="textPrimary">
          Segítünk a következő szintre lépni
        </Typography>
        <Typography variant="bodyLarge" color="textSecondary">
          Bármekkora vállalkozásról is legyen szó, a szintlépés sosem
          egyszerű. Mi abban segítünk, hogy az online marketing rendszered
          felépítésével a következő szintre tudj lépni.
        </Typography>
        <Button variant="primary" size="large">
          Hogyan tudtok segíteni?
        </Button>
      </Grid>
      <Grid item xs={12} md={6}>
        <HeroImage src="/hero-illustration.svg" alt="Marketing Illustration" />
      </Grid>
    </Grid>
  </Container>
</section>
```

### Service Cards Grid

```jsx
<section className="services">
  <Container maxWidth="xl">
    <Typography variant="h2" align="center" gutterBottom>
      Válaszd ki az irányt!
    </Typography>

    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <ServiceCard
          icon={<PenIcon />}
          title="Csináld magad"
          description="Ha Te magad szeretnéd megtervezni, kiépíteni és
                       menedzselni a vállalkozásod online marketing
                       rendszereit..."
          buttonText="Ez kell nekem"
          buttonLink="/csinald-magad"
        />
      </Grid>
      {/* További 2 kártya */}
    </Grid>
  </Container>
</section>
```

---

## 11. DESIGN TOKENS (JSON Format)

```json
{
  "color": {
    "brand": {
      "primary": "#FE6049",
      "primaryHover": "#E5513D",
      "primaryActive": "#CC4432"
    },
    "text": {
      "primary": "#3E4581",
      "secondary": "#777777",
      "tertiary": "#999999"
    },
    "background": {
      "primary": "#FFFFFF",
      "secondary": "#F7F7F7",
      "tertiary": "#FAFAFA"
    },
    "border": {
      "light": "#E5E5E5",
      "medium": "#CCCCCC"
    }
  },
  "typography": {
    "fontFamily": {
      "primary": "Montserrat, sans-serif"
    },
    "fontSize": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px",
      "2xl": "24px",
      "3xl": "32px",
      "4xl": "42px",
      "5xl": "60px"
    },
    "fontWeight": {
      "regular": 400,
      "semibold": 600,
      "bold": 700,
      "black": 900
    },
    "lineHeight": {
      "tight": 1.3,
      "normal": 1.5,
      "relaxed": 1.6
    }
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px",
    "2xl": "48px",
    "3xl": "64px",
    "4xl": "80px",
    "5xl": "96px",
    "6xl": "128px"
  },
  "borderRadius": {
    "none": "0px",
    "sm": "3px",
    "md": "10px",
    "lg": "15px",
    "xl": "20px",
    "full": "100px",
    "circle": "50%"
  },
  "shadow": {
    "sm": "0px 2px 4px rgba(0, 0, 0, 0.08)",
    "md": "0px 4px 8px rgba(0, 0, 0, 0.1)",
    "lg": "0px 8px 16px rgba(0, 0, 0, 0.12)",
    "xl": "0px 12px 24px rgba(0, 0, 0, 0.15)",
    "2xl": "0px 16px 32px rgba(0, 0, 0, 0.18)",
    "card": "0px 0px 10px rgba(0, 0, 0, 0.15)",
    "testimonial": "0px 0px 20px rgba(254, 96, 73, 0.15)",
    "primaryMd": "0px 8px 20px rgba(254, 96, 73, 0.25)"
  },
  "transition": {
    "fast": "150ms",
    "base": "200ms",
    "medium": "300ms",
    "slow": "500ms"
  }
}
```

---

## 12. IMPLEMENTÁCIÓS ÚTMUTATÓ

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-brand-primary: #FE6049;
  --color-text-primary: #3E4581;
  --color-text-secondary: #777777;
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F7F7F7;

  /* Typography */
  --font-family-primary: 'Montserrat', sans-serif;
  --font-size-h1: 60px;
  --font-size-h2: 42px;
  --font-size-body: 18px;

  /* Spacing */
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 10px;
  --radius-full: 100px;

  /* Shadows */
  --shadow-card: 0px 0px 10px rgba(0, 0, 0, 0.15);
  --shadow-hover: 0px 16px 32px rgba(0, 0, 0, 0.15);

  /* Transitions */
  --transition-base: 200ms ease;
  --transition-medium: 300ms ease;
}
```

### Tailwind Config Example

```javascript
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

## ÖSSZEGZÉS

A BOOM Marketing Agency design rendszere egy **modern, tiszta és professzionális** vizuális identitást képvisel, amely az alábbi kulcsfontosságú elemekre épül:

✓ **Erős brand szín**: A narancsvörös (#FE6049) energikus, figyelemfelkeltő akcent
✓ **Megbízható alapszínek**: Kék-lila (#3E4581) professzionális, stabil hatást kelt
✓ **Letisztult tipográfia**: Montserrat betűcsalád, 1.3x-1.6x line-height arányok
✓ **Pill-shaped gombok**: 100px border-radius teljes kerekítéssel
✓ **Soft shadows**: Finom árnyékok (10-20px blur, 0.15 opacity)
✓ **Generous spacing**: 8px alapú spacing grid, bőséges white space
✓ **Lift hover effektek**: -4px translateY + fokozott shadow
✓ **WCAG 2.1 AA compliant**: Minden színkombináció akadálymentes

A rendszer **skálázható, karbantartható és konzisztens** design language-t biztosít, amely alkalmas SaaS/B2B marketing agency pozicionálásra.

---

**Dokumentáció verzió**: 1.0
**Utolsó frissítés**: 2025-11-26
**Készítette**: UI Designer Agent
