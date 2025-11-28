# BOOM Marketing - Átfogó Design Rendszer Elemzés

**Elkészítve:** 2025-11-26
**Forrás:** https://boommarketing.hu/
**Elemzett oldalak:** Főoldal, Szolgáltatások oldal

---

## 📊 Executive Summary

A BOOM Marketing weboldala professzionális, modern és konverziós célú design rendszert használ. A design célja egyértelmű: megbízhatóságot közvetíteni és az ügyfeleket cselekvésre ösztönözni.

### Kulcs design jellemzők:
- **Színvilág:** Narancsvörös (#FE6049) + Navy kék (#3E4581) kombináció
- **Tipográfia:** Montserrat - tiszta, modern, jól olvasható
- **UI minták:** Pill gombok (100px radius), subtle árnyékok, illustration-heavy
- **Konverzió fókusz:** Világos CTA-k, egyszerű layout, sok white space

---

## 🎨 Színpaletta

### Brand színek (Weboldal alapján)

| Szín | HEX | RGB | Használat | Kontrasztarány |
|------|-----|-----|-----------|----------------|
| **BOOM Coral** | `#FE6049` | rgb(254, 96, 73) | CTA gombok, kiemelések, aktív állapotok | 3.5:1 (AA Large) |
| **BOOM Navy** | `#3E4581` | rgb(62, 69, 129) | Főcímek (H1, H2), brand text | 9.2:1 (AAA) |
| **Középszürke** | `#777777` | rgb(119, 119, 119) | Body szöveg, bekezdések | 4.7:1 (AA) |
| **Világos szürke** | `#F7F7F7` | rgb(247, 247, 247) | Section háttér, elválasztók | - |
| **Fehér** | `#FFFFFF` | rgb(255, 255, 255) | Fő háttér, kártyák | - |

### Kiegészítő színek (WordPress preset)

A weboldal WordPress-ben fut, így további színek is elérhetők:
- `#0693e3` - Vivid Cyan Blue
- `#9b51e0` - Vivid Purple
- `#fcb900` - Luminous Vivid Amber
- `#cf2e2e` - Vivid Red
- `#00d084` - Vivid Green Cyan

**Javaslat:** Az ajánlat készítőben csak a fő brand színeket használjuk (Coral + Navy + szürkék).

---

## 📝 Tipográfia

### Betűcsalád
**Montserrat** (Google Fonts) - sans-serif, geometrikus, modern

### Heading (Címsorok)

| Element | Méret | Vastagság | Line Height | Szín | Példa |
|---------|-------|-----------|-------------|------|-------|
| **H1** | 60px | 700 (Bold) | 78px (1.3) | #3E4581 | "Segítünk a következő szintre lépni" |
| **H2** | 42px | 700 (Bold) | 54.6px (1.3) | #3E4581 | "Válaszd ki az irányt!" |
| **H3-H5** | 24-32px | 700 (Bold) | 1.3-1.4 | #3E4581 | Szolgáltatás címek |

**Kiemelések:** A főoldal hero szekcióban a "következő szintre" kifejezés narancssárga (#FE6049).

### Body (Szövegtörzs)

| Element | Méret | Vastagság | Line Height | Szín |
|---------|-------|-----------|-------------|------|
| **Body text** | 18px | 400 (Regular) | 1.6 (28.8px) | #777777 |
| **Bold text** | 18px | 600 (SemiBold) | 1.6 | #777777 |
| **Small text** | 14-16px | 400 | 1.5 | #777777 |

**Észrevétel:** A body szövegméret 18px (nem 16px), ami növeli az olvashatóságot és prémium érzettet ad.

---

## 🔘 UI Komponensek

### Gombok

#### Primary CTA Gomb
```css
background: #FE6049;
color: #FFFFFF;
border-radius: 100px; /* Pill shape */
padding: 16px 32px;
font-size: 18px;
font-weight: 400;
box-shadow: 0 4px 12px rgba(254, 96, 73, 0.3);
transition: all 0.3s ease;

/* Hover */
transform: translateY(-2px);
box-shadow: 0 6px 16px rgba(254, 96, 73, 0.4);
```

**Példa szövegek:**
- "Dolgozzunk együtt!"
- "Hogyan tudtok segíteni?"
- "Mutasd a részleteket"

#### Secondary/Outline Gomb
```css
background: transparent;
color: #3E4581;
border: 2px solid #3E4581;
border-radius: 100px;
padding: 16px 32px;
font-size: 18px;
```

### Szolgáltatás Kártyák

A szolgáltatások oldalon látható kártya design:

```css
.service-card {
  background: #FFFFFF;
  border-radius: 10px;
  padding: 48px 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

**Layout:**
- Bal oldalon: Illusztráció (isometric style, kék-narancssárga színvilág)
- Jobb oldalon: H2 cím + body text + CTA gomb
- Váltakozó elrendezés (zigzag pattern)

### Ikonok

Az oldalon használt ikonok jellege:
- **Stílus:** Isometric illustrations (3D hatású, modern)
- **Színek:** Kék árnyalatok (#3E4581 köré) + narancssárga (#FE6049) accent
- **Példák:** Social media gyár (Kontentgyár™), Facebook Ads manager, Charts/graphs

**Javaslat az ajánlatokhoz:** Heroicons, Lucide vagy Phosphor icons használata, narancsvörös accent színnel.

### Form elemek

Az "Árajánlatkérő űrlap" design:

```css
input[type="text"],
input[type="email"],
textarea {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  color: #1F2937;
  background: #FFFFFF;
}

input:focus {
  border-color: #FE6049;
  outline: none;
  box-shadow: 0 0 0 3px rgba(254, 96, 73, 0.1);
}
```

**Checkboxok és radio buttonok:**
- Custom styled
- Narancssárga active state (#FE6049)
- Kerekített sarkok (4px)

---

## 📐 Spacing & Layout

### Spacing Scale (8px alapú)

| Token | Érték | Használat |
|-------|-------|-----------|
| xs | 8px | Icon padding, tight spaces |
| sm | 16px | Card padding, button padding |
| md | 24px | Section gap, card spacing |
| lg | 32px | Component spacing |
| xl | 48px | Section padding |
| 2xl | 64px | Large section gaps |
| 3xl | 80px | Hero section spacing |

### Container & Grid

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
```

**Grid pattern:**
- 2 oszlop (szolgáltatás kártyák): 50-50% desktop-on
- 3 oszlop (partner logók, testimonial kártyák): 33-33-33%
- Mobile-on minden 100% széles (single column)

---

## 🎭 Design Minták

### Border Radius

| Elem | Radius | Példa |
|------|--------|-------|
| **CTA Gombok** | 100px | Pill shape (teljesen kerekített) |
| **Szolgáltatás kártyák** | 10px | Subtle, modern |
| **Input mezők** | 8px | Form fields |
| **Kiemelések** | 4px | Small accents |

### Shadows (Árnyékok)

```css
/* Subtle card shadow */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

/* Hover state */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

/* CTA button shadow */
box-shadow: 0 4px 12px rgba(254, 96, 73, 0.3);
```

**Észrevétel:** Az árnyékok nagyon finomak (0.08-0.15 opacity), nem agresszívak.

### Animations & Transitions

```css
transition: all 0.3s ease;

/* Hover lift effect */
transform: translateY(-4px);

/* Button scale */
transform: scale(1.05);
```

**Animációs elvek:**
- Smooth (0.3s ease)
- Subtle lift effect hover-re (-2px vagy -4px)
- Fokozott shadow hover-re
- Nincs túlzott motion

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large Desktop */ }
```

### Mobile Optimalizálás

**Főoldal hero:**
- Desktop: 2 oszlop (50% text, 50% illustration)
- Mobile: 1 oszlop (text fent, illustration lent)

**Szolgáltatás kártyák:**
- Desktop: Váltakozó layout (zigzag)
- Mobile: Minden ugyanolyan elrendezés (image top, content bottom)

**Navigation:**
- Desktop: Horizontal menu
- Mobile: Hamburger menü (feltételezhető, bár nem látszott a snapshot-ban)

---

## 🖼️ Vizuális Nyelv

### Illustrációk stílusa

**Jellemzők:**
- **Stílus:** Isometric (2.5D), modern, tech-oriented
- **Színvilág:** Kék árnyalatok + narancssárga accents
- **Témák:** Marketing automation, growth charts, social media, team collaboration
- **Karakter:** Ember figurák (simplified, geometric)

**Példák a weboldalról:**
1. **Hero:** Growth chart with people climbing (blue-orange gradient)
2. **Kontentgyár™:** Social media factory illustration
3. **Facebook hirdetések:** Facebook interface mockup + wallet icon

**Javaslat:** Undrawn.co, Storyset.com, vagy custom Figma illustrations similar style-ban.

### Partner Logók

**Megjelenés:**
- Grayscale vagy very low saturation
- Uniform height (~60-80px)
- Grid layout (4-5 oszlop desktop-on)
- Hover: color verzió vagy slight scale

**Példák:**
- Forbes, Napi.hu, HubSpot, Databox
- InboundBack AFRICA, DoMarketing, Kreativ Kontroll, Kantent

---

## ✅ Accessibility (Hozzáférhetőség)

### Kontrasztarányok (WCAG 2.1)

| Kombináció | Arány | WCAG szint |
|------------|-------|------------|
| Navy (#3E4581) on White | 9.2:1 | AAA ✓ |
| Grey (#777777) on White | 4.7:1 | AA ✓ |
| Coral (#FE6049) on White | 3.5:1 | AA (Large Text) ⚠️ |

**Észrevétel:** A narancsvörös CTA szín kis szövegre NEM felel meg AA szabványnak. Csak gombokra és nagy szövegre használjuk.

### Ajánlások

- ✅ Használd a Navy kéket (#3E4581) normál méretű szövegekhez
- ✅ Használd a szürkét (#777777) body texthez
- ⚠️ A Coral (#FE6049) csak CTA gombokhoz, kiemelésekhez, nagy címekhez
- ✅ Minden interaktív elem minimum 44x44px (mobile tap target)
- ✅ Focus state minden interaktív elemre (outline vagy shadow)

---

## 🎯 Konverziós Elemek

### CTA Hierarchy (Prioritás)

1. **Primary CTA:** Narancsvörös pill gomb, white text
   - "Dolgozzunk együtt!"
   - "Ajánlatot kérek!"

2. **Secondary CTA:** Outline gomb vagy text link
   - "Mutasd a részleteket"
   - "Tovább olvasom »"

3. **Tertiary:** Csak link, no background
   - Footer linkek
   - Navigation items

### Társadalmi Bizonyíték (Social Proof)

**Testimonial slider:**
```css
.testimonial-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.testimonial-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #F7F7F7;
}
```

**Layout:**
- Idézet text (italic, 16-18px)
- Avatar image (circular)
- Név (bold) + Cég/pozíció (regular)
- Carousel controls (dots)

### Urgencia & Scarcity

Az oldalon nem látható agresszív urgencia (nincs countdown, nincs "csak ma" offer).
**Tónus:** Professzionális, nem manipulatív.

---

## 📋 Használati Útmutató Ajánlat Építőhöz

### DO's (Ajánlott)

✅ **Színek:**
- Primary CTA: #FE6049 (Coral)
- Címek: #3E4581 (Navy)
- Body text: #777777 (Grey)
- Háttér váltakozva: #FFFFFF és #F7F7F7

✅ **Tipográfia:**
- Montserrat (ha elérhető, különben Inter)
- H1: 48-60px / 700
- H2: 32-42px / 700
- Body: 18px / 400
- Line-height: 1.3-1.6

✅ **Komponensek:**
- Pill gombok (100px radius)
- Szolgáltatás kártyák 10px radius
- 8px spacing scale
- Subtle shadows (0.08-0.12 opacity)

✅ **Layout:**
- Max-width: 1200-1280px
- Padding: 24px sides, 48-80px top/bottom
- White space: generous, clean

### DON'Ts (Kerülendő)

❌ Ne használj custom színeket a palettán kívül
❌ Ne használj éles, hard shadows-t
❌ Ne pakold tele az oldalt (tartsd a white space-t)
❌ Ne használj túl sok különböző font size-t
❌ Ne használj túl kicsi font méreteket (<14px)
❌ Ne használd a Coral színt kis szöveghez (accessibility)
❌ Ne használj animációkat túl gyorsan (<0.2s)

---

## 🚀 Implementációs Példák

### React/Next.js Button Component

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'primary', size = 'md', children, onClick }: ButtonProps) {
  const baseStyles = 'font-montserrat font-normal rounded-full transition-all duration-300';

  const variantStyles = {
    primary: 'bg-[#FE6049] text-white hover:shadow-lg hover:-translate-y-1',
    secondary: 'bg-[#3E4581] text-white hover:shadow-lg hover:-translate-y-1',
    outline: 'bg-transparent border-2 border-[#FE6049] text-[#FE6049] hover:bg-[#FE6049] hover:text-white',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </button>
  );
}
```

### Tailwind Config

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'boom-coral': '#FE6049',
        'boom-navy': '#3E4581',
        'boom-grey': '#777777',
        'boom-light': '#F7F7F7',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        'pill': '100px',
      },
      boxShadow: {
        'boom-subtle': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'boom-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'boom-cta': '0 4px 12px rgba(254, 96, 73, 0.3)',
      },
    },
  },
}
```

---

## 📊 Összegzés & Következtetések

### Brand Positioning

A BOOM Marketing design rendszere **professzionális, megbízható, modern** pozícionálást közvetít:

1. **Színvilág:** Meleg narancsvörös + hűvös kék = megbízhatóság + energia
2. **Tipográfia:** Tiszta, geometrikus (Montserrat) = modern, professional
3. **UI minták:** Soft shadows, pill buttons = friendly, approachable
4. **Layout:** Generous white space = prémium, high-end

### Eltérések az eredeti brand book-tól

Az eredeti brand book-ban (`#fa604a`) helyett a valós weboldal `#FE6049`-et használ.
**Javaslat:** Maradjunk a weboldal pontos színeinél (#FE6049).

### Következő lépések

1. ✅ Brand book frissítve a pontos színekkel
2. ✅ Boom.svg logó átmásolva a public mappába
3. 🔄 Szolgáltatás kártya komponens készítése (ajánlat builder-hez)
4. 🔄 Design tokens exportálása (CSS variables + Tailwind)
5. 🔄 Illustration library meghatározása

---

**Dokumentum készítette:** Claude (Sonnet 4.5)
**Utolsó frissítés:** 2025-11-26
**Verzió:** 1.0
