# Compilation & Schema Generation - Gyors Útmutató

## Áttekintés

A compilation rendszer TypeScript komponenseket fordít JavaScript-re és generál JSON sémát a Props interface-ből.

## Használat

### 1. Komponens Fordítása (API)

```bash
# POST kérés a compilation endpoint-ra
curl -X POST http://localhost:3000/api/components/compile \
  -H "Content-Type: application/json" \
  -d '{
    "blockType": "HERO",
    "sourceCode": "import React from '\''react'\'';\n\ninterface Props {\n  title: string;\n}\n\nexport default function Hero({ title }: Props) {\n  return <h1>{title}</h1>;\n}",
    "changeDescription": "Új hero komponens"
  }'
```

### 2. Komponens Forráskód Lekérése

```bash
# GET kérés a source endpoint-ra
curl http://localhost:3000/api/components/source/HERO
```

### 3. Komponens Frissítése (SUPER_ADMIN)

```bash
curl -X PATCH http://localhost:3000/api/components/source/HERO \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "sourceCode": "...",
    "changeDescription": "Props bővítése"
  }'
```

## Library Használat

### Compiler

```typescript
import { compileTypeScript } from '@/lib/compiler';

const result = compileTypeScript(sourceCode, {
  jsx: true,
  typescript: true,
});

if (result.success) {
  console.log('Compiled:', result.compiledCode);
}
```

### Parser

```typescript
import { parsePropsInterface } from '@/lib/parser';

const result = parsePropsInterface(sourceCode, 'Props');

if (result.success) {
  console.log('Schema:', result.schema);
  console.log('Required:', result.schema.required);
}
```

## Demo Futtatása

```bash
# Compiler és parser demo
npx tsx scripts/demo-compiler.ts

# API endpoint teszt (server futnia kell)
node scripts/test-compilation.js
```

## Komponens Követelmények

Minden komponensnek tartalmaznia kell:

1. **Props Interface**
```typescript
interface Props {
  title: string;
  subtitle?: string;
}
```

2. **Default Export**
```typescript
export default function Component(props: Props) {
  return <div>...</div>;
}
```

3. **React Import vagy "use client"**
```typescript
import React from 'react';
// vagy
"use client";
```

## JSON Schema Típusok

| TypeScript | JSON Schema | Példa |
|-----------|-------------|-------|
| `string` | `"string"` | `title: string` |
| `number` | `"number"` | `count: number` |
| `boolean` | `"boolean"` | `isActive: boolean` |
| `string[]` | `"array"` | `tags: string[]` |
| `'a' \| 'b'` | `"string"` + enum | `type: 'small' \| 'large'` |
| `{ key: type }` | `"object"` | `meta: { author: string }` |

## Verziókezelés

Minden fordítás:
- Új verzió számot kap (incrementált)
- Előző verzió mentésre kerül a `ComponentVersion` táblába
- Change description-t rögzít
- Timestamp-et generál

## Hibaüzenetek

### Syntax Error
```json
{
  "success": false,
  "error": "TypeScript syntax validation failed"
}
```

### Structure Error
```json
{
  "success": false,
  "error": "Invalid component structure",
  "warnings": [
    "Component must have a default function export"
  ]
}
```

### Compilation Error
```json
{
  "success": false,
  "error": "Compilation failed",
  "details": "Unexpected token..."
}
```

## Teljesítmény

- **Compilation idő**: 50-200ms
- **Parser idő**: 10-50ms
- **Sucrase előnye**: ~20x gyorsabb mint TSC
- **Cache**: Component load szinten implementált

## Következő Lépések

1. Komponens létrehozás admin felületen
2. Fordítás és séma generálás
3. Preview megtekintése
4. Deployment production-be

## További Dokumentáció

- [Compiler API](/lib/compiler/README.md)
- [Parser API](/lib/parser/README.md)
- [API Endpoints](/docs/api/components-compilation.md)
