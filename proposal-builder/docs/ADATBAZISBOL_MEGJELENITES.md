# Adatbázisból Való Megjelenítés - Technika Dokumentáció

## 🎯 Áttekintés

A rendszer **dinamikusan tölti be és futtatja** a React komponenseket az adatbázisból runtime-ban. Ez lehetővé teszi, hogy frissítsük a komponensek kódját anélkül, hogy újra kellene deployolni az alkalmazást.

---

## 🔄 Megjelenítési Folyamat

### 1. Component Storage (Adatbázis)

```
ComponentSource tábla
├── blockType: "HERO" (PRIMARY KEY)
├── sourceCode: TypeScript forráskód
├── compiledCode: CommonJS JavaScript kód
├── schema: JSON schema (form generáláshoz)
└── version: Verziószám
```

**Példa**:
```typescript
{
  blockType: "HERO",
  sourceCode: "import { useRef } from 'react'; ...",
  compiledCode: "const useRef = require('react').useRef; ...",
  version: 3
}
```

### 2. API Endpoint

**File**: [`app/api/components/load/[blockType]/route.ts`](../app/api/components/load/[blockType]/route.ts)

```typescript
GET /api/components/load/HERO
  ↓
ComponentSource.findUnique({ blockType: 'HERO' })
  ↓
Return: { success: true, code: compiledCode }
```

**Cache**: 5 perces in-memory cache (teljesítmény optimalizálás)

### 3. Client-Side Loading

**File**: [`lib/dynamic-loader/client.ts`](../lib/dynamic-loader/client.ts)

```typescript
export async function loadComponent(blockType: string) {
  // 1. API call
  const response = await fetch(`/api/components/load/${blockType}`);
  const { code } = await response.json();

  // 2. Execute code
  const module = new Function('require', 'exports', code);

  // 3. Extract component
  const exports = {};
  module(customRequire, exports);

  return exports.HeroBlock; // vagy más component
}
```

### 4. Custom Require System

A böngésző **nem támogatja natívan** a `require()`-t, ezért custom implementáció kell:

```typescript
const customRequire = (moduleName: string) => {
  if (moduleName === 'react') {
    return React; // window.React
  }
  if (moduleName === '@/lib/brand-components') {
    return { useBrandComponents, getBrandTokens };
  }
  // ... más modulok
};
```

### 5. Dynamic Rendering

**File**: [`components/builder/BlockRenderer.tsx`](../components/builder/BlockRenderer.tsx)

```typescript
export function BlockRenderer({ block, brand }) {
  const [component, setComponent] = useState(null);

  useEffect(() => {
    loadComponent(block.blockType).then(setComponent);
  }, [block.blockType]);

  if (!component) return <Loading />;

  const Component = component;
  return <Component content={block.content} brand={brand} />;
}
```

---

## ⚙️ Compilation Process

### Source Code → Compiled Code Transformation

**Tool**: [Sucrase](https://github.com/alangpierce/sucrase) (gyors TypeScript → JavaScript)

**Seed Script**: [`scripts/seed-hero-component.ts`](../scripts/seed-hero-component.ts)

```typescript
// 1. TypeScript → JavaScript (Sucrase)
const result = transform(sourceCode, {
  transforms: ['typescript', 'jsx'],
  production: true,
  jsxRuntime: 'classic'
});

// 2. ESM imports → CommonJS requires
compiledCode = result.code
  // import { useRef } from 'react';
  // ↓
  .replace(/import\s*\{([^}]+)\}\s*from\s*['"]react['"]\s*;?/g,
    (match, imports) => {
      const importList = imports.split(',').map(imp => imp.trim());
      return importList.map(imp =>
        `const ${imp} = require('react').${imp};`
      ).join('\n');
    })

  // import { X } from '@/lib/brand-components';
  // ↓
  .replace(/import\s*\{([^}]+)\}\s*from\s*['"]@\/lib\/brand-components['"]\s*;?/g,
    (match, imports) => {
      const importList = imports.split(',').map(imp => imp.trim());
      return importList.map(imp =>
        `const ${imp} = require('@/lib/brand-components').${imp};`
      ).join('\n');
    })

  // Remove 'use client' directive
  .replace(/'use client'\s*;?/g, '')

  // Remove export keyword
  .replace(/export\s+/g, '');

// 3. Add exports
if (!compiledCode.includes('exports.HeroBlock')) {
  compiledCode += '\nexports.HeroBlock = HeroBlock;\n';
}
```

---

## 📋 Compilation Rules

### ✅ GOOD (Működik)

```javascript
// CommonJS require
const useRef = require('react').useRef;
const useBrandComponents = require('@/lib/brand-components').useBrandComponents;

function HeroBlock({ content, brand }) {
  const sectionRef = useRef(null);
  const { H1, Body } = useBrandComponents(brand);
  // ...
}

exports.HeroBlock = HeroBlock;
```

### ❌ BAD (NEM működik böngészőben)

```javascript
// ESM import - böngésző nem tudja értelmezni
import { useRef } from 'react';
import { useBrandComponents } from '@/lib/brand-components';

export function HeroBlock({ content, brand }) {
  // ...
}
```

### ❌ VERY BAD (Vegyes használat)

```javascript
// NEM működik! Vegyes import/require
const useRef = require('react').useRef;
import { useBrandComponents } from '@/lib/brand-components'; // ❌
```

---

## 🔧 Troubleshooting

### Probléma 1: "Identifier 'useRef' has already been declared"

**Ok**: Duplikált `const` deklarációk a compiled kódban

**Megoldás**:
```bash
# Seed script újrafuttatása
DATABASE_URL="..." npx tsx scripts/seed-hero-component.ts
```

### Probléma 2: "Cannot read properties of undefined (reading 'content')"

**Ok**: A komponens nem kapja meg a props-okat megfelelően

**Ellenőrzés**:
```typescript
// ComponentSource compiled code should have:
function HeroBlock({ content, brand, proposalData }) {
  // NOT:
  // function HeroBlock(props) {
```

### Probléma 3: "Failed to load resource: 404 Not Found"

**Ok**: Komponens nincs az adatbázisban vagy cache elavult

**Megoldás**:
```bash
# 1. Ellenőrizd az adatbázist
DATABASE_URL="..." node -e "
  import('@prisma/client').then(({ PrismaClient }) => {
    const prisma = new PrismaClient();
    prisma.componentSource.findMany().then(console.log);
  });
"

# 2. Cache törlése
curl -X DELETE http://localhost:3000/api/components/load/HERO
```

### Probléma 4: Import/Require vegyes használat

**Ok**: A seed script nem konvertálta az összes import-ot

**Megoldás**: Frissítsd a seed scriptet:
```typescript
.replace(/import\s*\{([^}]+)\}\s*from\s*['"]@\/[^'"]+['"]\s*;?/g, ...)
```

---

## 🧪 Tesztelés

### 1. Ellenőrizd a Compiled Code-ot

```bash
DATABASE_URL="..." node --import tsx -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const hero = await prisma.componentSource.findUnique({
    where: { blockType: 'HERO' }
  });

  console.log('Version:', hero.version);
  console.log('Has import?', hero.compiledCode.includes('import '));
  console.log('Has require?', hero.compiledCode.includes('require('));

  await prisma.\$disconnect();
}
check();
"
```

### 2. API Tesztelés

```bash
# Get component
curl http://localhost:3000/api/components/load/HERO | jq .

# Clear cache
curl -X DELETE http://localhost:3000/api/components/load/HERO
```

### 3. Browser Console

```javascript
// Dynamic loader teszt
const { loadComponent } = await import('/lib/dynamic-loader/client');
const HeroBlock = await loadComponent('HERO');
console.log('Loaded:', HeroBlock);
```

---

## 📊 Teljesítmény Optimalizálás

### Cache Stratégia

```typescript
// In-memory cache (API szinten)
const componentCodeCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 perc
```

**Előnyök**:
- ✅ Kevesebb DB query
- ✅ Gyorsabb betöltés
- ✅ Csökkentett latency

**Cache invalidation**:
```bash
# Egyedi komponens
curl -X DELETE http://localhost:3000/api/components/load/HERO

# Összes
curl -X DELETE http://localhost:3000/api/components/load/all
```

### Component Code Size

**Optimalizálás**:
- Sucrase `production: true` - minified output
- Felesleges whitespace eltávolítása
- Tree-shaking (használaton kívüli kód eltávolítása)

---

## 🚀 Deployment Checklist

- [ ] Minden komponens compiled code-ja frissítve van
- [ ] Nincs ESM `import` a compiled code-ban
- [ ] Minden `require()` path helyes
- [ ] `exports.ComponentName` létezik
- [ ] Version bump minden frissítésnél
- [ ] API endpoint működik (`/api/components/load/[blockType]`)
- [ ] Custom require system tartalmazza az összes szükséges modult
- [ ] Cache tiszta deployment után

---

## 📚 Összefoglalás

**Adatbázis → API → Client → Execution → Render**

```
ComponentSource DB
  ↓ (SQL query)
API Endpoint (/api/components/load/HERO)
  ↓ (HTTP response)
Client-Side Loader (lib/dynamic-loader/client.ts)
  ↓ (new Function() + custom require)
Component Execution
  ↓ (React.createElement)
BlockRenderer → DOM
```

**Kulcs elemek**:
1. ✅ CommonJS format (require/exports)
2. ✅ Custom require system
3. ✅ new Function() execution
4. ✅ In-memory cache
5. ✅ Brand-aware component loading

**Előnyök**:
- 🔥 Hot update komponensek deploy nélkül
- 🎯 Központosított verziókezelés
- 🚀 Gyors betöltés cache-elt
- 🔧 Egyszerű debugging (SQL query látható)
