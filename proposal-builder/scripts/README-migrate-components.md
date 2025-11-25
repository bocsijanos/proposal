# Block Components Migration Script

## Áttekintés

A `migrate-components-to-db.ts` script automatikusan beolvassa a 14 block komponenst és elmenti őket az adatbázisba mint block template-eket.

## Telepítés

A szükséges függőségek már telepítve vannak:

```bash
npm install sucrase tsx
```

## Futtatás

```bash
npx tsx scripts/migrate-components-to-db.ts
```

## Mit csinál a script?

### 1. Block komponensek beolvasása

A script beolvassa az összes `*Block.tsx` fájlt a `components/blocks/` mappából:

- BonusFeaturesBlock.tsx
- CTABlock.tsx
- ClientLogosBlock.tsx
- GuaranteesBlock.tsx
- HeroBlock.tsx
- PartnerGridBlock.tsx
- PlatformFeaturesBlock.tsx
- PricingBlock.tsx
- ProcessTimelineBlock.tsx
- ServicesBlock.tsx
- StatsBlock.tsx
- TextBlock.tsx
- TwoColumnBlock.tsx
- ValuePropBlock.tsx

### 2. TypeScript interface parsing

Minden komponensből:
- Megkeresi a Props interface-t (pl. `HeroBlockProps`)
- Parse-olja a TypeScript tulajdonságokat
- Generál egy egyszerű JSON schema-t

### 3. TypeScript compilation

- Sucrase library segítségével compile-olja a TypeScript kódot JavaScript-re
- Támogatja a JSX, TypeScript és ES module transzformációkat

### 4. Adatbázis mentés

Minden komponenshez létrehoz 2 template-et (BOOM és AIBOOST brand-ekhez):

```typescript
await prisma.blockTemplate.upsert({
  where: {
    blockType_name_brand: {
      blockType: 'HERO',
      name: 'HeroBlock - BOOM',
      brand: 'BOOM',
    },
  },
  update: { /* ... */ },
  create: { /* ... */ },
});
```

### 5. Default content generálás

Minden block type-hoz előre definiált default tartalmat generál:

```typescript
{
  HERO: {
    headingPrefix: 'Üdvözlünk',
    headingMain: 'a neve',
    headingSuffix: 'cégednek',
    subheading: 'Professzionális megoldások...',
  },
  // ... további block type-ok
}
```

## Kimenet

A script részletes log-ot ír a konzolra:

```
🚀 Starting Block Components Migration to Database

📂 Blocks directory: /path/to/components/blocks
📋 Found 14 block components

🏷️  Processing brand: BOOM
------------------------------------------------------------

📦 Processing: HeroBlock
   Type: HERO
   ✓ File read successfully (6926 bytes)
   ✓ Found interface: HeroBlockProps
   ✓ Parsed 11 properties
   ✓ Generated JSON schema
   ✓ Compiled to JavaScript (8018 bytes)
   ✓ Generated default content
   ✅ Saved to database (ID: xxx)

...

📊 Summary:
   Total components: 14
   Brands: BOOM, AIBOOST
   Total operations: 28
   ✅ Successful: 28
   ❌ Failed: 0
   📈 Success rate: 100.0%
```

## Adatbázis struktúra

A script a `block_templates` táblába menti az adatokat:

```sql
CREATE TABLE "block_templates" (
  id TEXT PRIMARY KEY,
  block_type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT NOT NULL,
  default_content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP,

  UNIQUE(block_type, name, brand)
);
```

## Block Type Mapping

A fájlnevek és database enum-ok megfeleltetése:

| Fájlnév | BlockType Enum |
|---------|----------------|
| HeroBlock | HERO |
| ValuePropBlock | VALUE_PROP |
| PricingBlock | PRICING_TABLE |
| ServicesBlock | SERVICES_GRID |
| GuaranteesBlock | GUARANTEES |
| CTABlock | CTA |
| ProcessTimelineBlock | PROCESS_TIMELINE |
| ClientLogosBlock | CLIENT_LOGOS |
| TextBlock | TEXT_BLOCK |
| TwoColumnBlock | TWO_COLUMN |
| PlatformFeaturesBlock | PLATFORM_FEATURES |
| StatsBlock | STATS |
| BonusFeaturesBlock | BONUS_FEATURES |
| PartnerGridBlock | PARTNER_GRID |

## Hibakezelés

A script minden lépésnél hibakezelést végez:

- Ha egy fájl nem található vagy nem olvasható
- Ha az interface nem található vagy nem parse-olható
- Ha a compilation sikertelen
- Ha az adatbázis művelet sikertelen

Minden hiba részletesen logolva van, de nem állítja le a teljes migration-t.

## Újrafuttatás

A script biztonságosan újrafuttatható az `upsert` művelet miatt:
- Ha létezik már a template, akkor frissíti
- Ha nem létezik, akkor létrehozza

## Következő lépések

A migration után:

1. Ellenőrizd az adatbázist:
```bash
npx prisma studio
```

2. Nézd meg a template-eket a block_templates táblában

3. Használd a template-eket új proposal-ok létrehozásánál

## Technikai részletek

### TypeScript Interface Parsing

A script regex pattern-eket használ az interface-ek felismerésére:

```typescript
const interfacePattern = new RegExp(
  `interface\\s+${interfaceName}\\s*{([^}]+)}`,
  'gs'
);
```

### JSON Schema Generálás

Egyszerű type mapping:
- `string` → `{ type: 'string' }`
- `number` → `{ type: 'number' }`
- `boolean` → `{ type: 'boolean' }`
- `Array<T>` → `{ type: 'array', items: { type: 'object' } }`
- `'a' | 'b' | 'c'` → `{ type: 'string', enum: ['a', 'b', 'c'] }`

### Sucrase Compilation

```typescript
transform(tsCode, {
  transforms: ['typescript', 'jsx', 'imports'],
  production: true,
  disableESTransforms: false,
});
```

## Maintenance

Ha új block komponenst adsz hozzá:

1. Adj hozzá egy új mappinget a `BLOCK_TYPE_MAP`-hez
2. Adj hozzá default content-et a `generateDefaultContent` függvényhez
3. Futtasd újra a migration script-et

## Troubleshooting

### "Directory not found" hiba

Ellenőrizd, hogy a `components/blocks/` mappa létezik:
```bash
ls -la components/blocks/
```

### "Could not find interface" warning

A komponensnek tartalmaznia kell egy Props interface-t:
```typescript
interface HeroBlockProps {
  content: { /* ... */ };
  brand: 'BOOM' | 'AIBOOST';
}
```

### Database connection error

Ellenőrizd a `DATABASE_URL` környezeti változót:
```bash
echo $DATABASE_URL
```

## License

Internal use only - BOOM Marketing & AIBoost
