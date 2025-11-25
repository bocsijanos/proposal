# Prisma 7 Átállás - Teljes Körű Ellenőrzési Jelentés
**Projekt:** Proposal Builder (Next.js)
**Dátum:** 2025-11-25
**Prisma verzió:** 6.0.1 (volt Prisma 7 kísérlet)
**Adatbázis:** PostgreSQL (127.0.0.1:51214/template1)

---

## Összefoglaló

A projekt **NEM használ Prisma 7-et**, annak ellenére, hogy a git történetben látható egy Prisma 7 upgrade kísérlet. Jelenleg **Prisma 6.0.1** van telepítve és használatban.

### Fő Megállapítások

#### ✅ POZITÍV
- Prisma Client 6.0.1 megfelelően telepítve és működik
- Schema valid és jól strukturált
- Adatbázis kapcsolat működik
- NextAuth Prisma Adapter megfelelően konfigurálva
- TypeScript típusok helyesen generálódnak

#### ⚠️ FIGYELMEZTETÉSEK
- **NINCS migrations mappa** - kézi SQL scriptek használata (antipattern)
- **VERZIÓ KONFÚZIÓ**: `@prisma/adapter-pg@7.0.0` telepítve, de nem használva
- **HASZNÁLATON KÍVÜLI PACKAGE**: `@prisma/adapter-pg` és `pg` csomagok nincsenek használatban a lib/prisma.ts-ben
- Több redundáns script használ direkt SQL-t a Prisma helyett

#### ❌ PROBLÉMÁK
- **Migration hiány**: Nincs migráció történet, csak CREATE TABLE scriptek
- **Inkonzisztens adatbázis állapot**: Különböző scriptek különböző adatbázis struktúrákat használnak
- **Nem használt dependencies**: 3 Prisma kapcsolatos csomag feleslegesen

---

## 1. Package.json Elemzés

### Telepített Verziók
```json
{
  "@prisma/adapter-pg": "^7.0.0",        // ❌ HASZNÁLATON KÍVÜL
  "@prisma/client": "6.0.1",             // ✅ HASZNÁLATBAN
  "@prisma/extension-accelerate": "^3.0.0", // ❓ NEM LÁTHATÓ HASZNÁLAT
  "prisma": "6.0.1",                     // ✅ HASZNÁLATBAN
  "pg": "^8.16.3"                        // ❌ HASZNÁLATON KÍVÜL (csak scriptekben)
}
```

### Problémák
1. **Verzió inkonzisztencia**: `@prisma/adapter-pg` 7.0.0, de a többi Prisma csomag 6.0.1
2. **Unused adapter**: A pg adapter telepítve van de nincs használva
3. **Extension-accelerate**: Nincs konfiguráció hozzá, nem világos a használat

### Ajánlás
```bash
# Távolítsd el a használaton kívüli csomagokat
npm uninstall @prisma/adapter-pg

# VAGY ha szeretnél Prisma 7-re váltani, frissítsd MINDET:
npm install prisma@7.0.0 @prisma/client@7.0.0
```

---

## 2. Schema.prisma Értékelés

### ✅ Erősségek

```prisma
// Jól strukturált, logikus modell csoportosítás
// Megfelelő index stratégia
// Tiszta névkonvenciók (@map használata)
// Enum-ok jól definiálva
```

#### Kiemelkedő gyakorlatok:
- **Composite indexes**: `@@index([proposalId, displayOrder])`
- **Cascade stratégia**: `onDelete: Cascade` a Session és Account modelleknél
- **Self-relations**: `ProposalClones` relation helyesen implementálva
- **Database mapping**: snake_case mező nevek (`@map`)

### ⚠️ Hiányosságok

1. **Preview features hiánya**: Prisma 6-ban elérhető új funkciók nem használtak
2. **Database-level constraints**: Néhány üzleti logikai constraint nincs sémában
3. **Default values**: Néhány mezőnél hasznos lenne

### Javasolt javítások

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["omitApi", "typedSql"] // Prisma 6 features
}

// Ajánlott preview features Prisma 6-hoz:
// - omitApi: Biztonságos mező elrejtés
// - typedSql: Type-safe nyers SQL lekérdezések
// - fullTextSearch: Full-text search PostgreSQL-hez
// - relationJoins: Jobb N+1 probléma kezelés

model Proposal {
  // ... existing fields ...

  // Javasolt kiegészítések:
  version       Int       @default(1)  // Optimistic locking
  deletedAt     DateTime? @map("deleted_at") // Soft delete

  @@index([deletedAt]) // Ha soft delete-et használsz
}

model ProposalBlock {
  // ... existing fields ...

  version       Int       @default(1)  // Version tracking

  // Composite index a gyakori lekérdezésekhez
  @@index([proposalId, blockType, isEnabled])
}
```

---

## 3. Prisma Client Inicializálás (lib/prisma.ts)

### Jelenlegi implementáció
```typescript
// EGYSZERŰ Prisma 6 verzió - adapter NÉLKÜL
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### ✅ Pozitívumok
- Next.js hot reload-hoz megfelelő singleton pattern
- Development logging engedélyezve
- Egyszerű és tiszta kód

### ⚠️ Figyelmeztető jelek

**A git történet szerint volt egy Prisma 7 adapter implementáció:**
```typescript
// Ez VOLT a 722068e commit-ban (Prisma 7 kísérlet)
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter: adapter as any,  // ❌ 'as any' típus-cast probléma jele!
  log: [...]
})
```

**Miért lett visszacsinálva a Prisma 6-ra?**
Valószínű okok:
1. Type compatibility problémák (`as any` használat kellett)
2. `@auth/prisma-adapter` kompatibilitási probléma
3. Vercel deployment problémák

### 🔧 Prisma 7-re váltás HELYES módja

Ha szeretnél Prisma 7-re váltani (amit ajánlott a hosszú távú támogatás miatt):

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

function createPrismaClient() {
  // Connection pool singleton
  const pool = globalForPrisma.pool ?? new Pool({
    connectionString: process.env.DATABASE_URL,
    // Connection pool config
    max: process.env.NODE_ENV === 'production' ? 10 : 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.pool = pool
  }

  // ✅ HELYES típusozás Prisma 7-hez
  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter, // ✅ Nincs 'as any' - ha típushiba van, az a verzió inkompatibilitást jelez
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
    errorFormat: 'minimal',
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
    if (globalForPrisma.pool) {
      await globalForPrisma.pool.end()
    }
  })
}
```

**FONTOS Prisma 7 követelmények:**
1. `@prisma/client@7.x` ÉS `prisma@7.x` együtt
2. `@prisma/adapter-pg@7.x` a PostgreSQL-hez
3. `pg@^8.11.0` minimum verzió
4. `@auth/prisma-adapter@^2.11.0` (NextAuth kompatibilitás)

---

## 4. Migráció és Adatbázis Állapot

### ❌ KRITIKUS PROBLÉMA: Nincs Prisma Migrate

**Jelenlegi megközelítés: Kézi SQL scriptek**

A projekt **NEM használ Prisma Migrate-et**, helyette:
- `scripts/create-tables.mjs` - manuális CREATE TABLE
- `scripts/init-db.mjs` - adatbázis inicializálás
- Nincs `prisma/migrations/` mappa

**Ez komoly antipattern!**

### Problémák ezzel a megközelítéssel

1. **Nincs verzió történet** - nem tudjuk követni a schema változásokat
2. **Schema drift** - a schema.prisma és a valódi DB eltérhet
3. **Team collaboration nehéz** - mindenki más scriptet futtathat
4. **Production deployment kockázatos** - nincs rollback lehetőség
5. **Prisma introspection unreliable** - `prisma db pull` nem megbízható

### Példa a problémára

**create-tables.mjs:**
```javascript
// Ez a régi schema struktúrát használja!
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'DECLINED', 'EXPIRED');
```

**schema.prisma (jelenlegi):**
```prisma
enum ProposalStatus {
  DRAFT
  PUBLISHED    // ❌ 'PUBLISHED' nincs a create-tables.mjs-ben!
  ARCHIVED     // ❌ 'ARCHIVED' nincs a create-tables.mjs-ben!
}
```

**Ez runtime hibához vezethet!**

### 🔧 Javasolt megoldás: Prisma Migrate bevezetése

```bash
# 1. Állítsd vissza az adatbázist a schema.prisma szerint
cd /Users/bocsijanos/Documents/claude/proposal/proposal-builder

# 2. Hozz létre első migration-t a jelenlegi állapotból
npx prisma migrate dev --name init --create-only

# 3. Nézd meg a generált SQL-t
cat prisma/migrations/XXXXXXXX_init/migration.sql

# 4. Ha megfelelő, alkalmazd
npx prisma migrate dev

# 5. Production-ben használd ezt:
npx prisma migrate deploy
```

**package.json frissítés:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "db:migrate:dev": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:push": "prisma db push",        // Csak prototípushoz!
    "db:seed": "tsx prisma/seed.ts",
    "start": "next start"
  }
}
```

### Adatbázis állapot ellenőrzése

```bash
# Ellenőrizd hogy az adatbázis megegyezik-e a schema-val
npx prisma db pull --print

# Ha eltérések vannak, hozz létre egy migration-t
npx prisma migrate dev --name fix_schema_drift
```

---

## 5. Scripts Vizsgálata

### Scripts Prisma használatával

**check-blocks.mjs**, **check-templates.mjs**, stb:
```javascript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ✅ Használja a Prisma Client-et
const proposal = await prisma.proposal.findUnique({...})
```

**Pozitívum:** Ezek a scriptek megfelelően használják a Prisma Client-et.

### Scripts direkt SQL-lel

**create-tables.mjs**, **seed-production.mjs**, **check-databases.mjs**:
```javascript
import pg from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ❌ Direkt SQL használat
await pool.query('SELECT COUNT(*) FROM users');
```

**Problémák:**
1. **Type safety hiánya** - nincs TypeScript ellenőrzés
2. **Duplikált logic** - ugyanaz az üzleti logika SQL-ben és Prisma-ban
3. **Karbantarthatóság** - ha a schema változik, több helyen kell frissíteni

### 🔧 Javítási javaslat

**Konvertáld a seed-production.mjs-t Prisma Client használatára:**

```typescript
// prisma/seed-production.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedProduction() {
  try {
    console.log('🌱 Seeding production database...')

    // 1. Admin user
    const passwordHash = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
      where: { email: 'admin@boommarketing.hu' },
      update: { name: 'Boom Admin' },
      create: {
        id: 'admin-boom-001',
        email: 'admin@boommarketing.hu',
        passwordHash,
        name: 'Boom Admin',
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    })

    console.log('✅ Admin user created/updated')

    // 2. BOOM Marketing proposal
    const proposal = await prisma.proposal.upsert({
      where: { slug: 'boom-marketing-teljes-csomag-2025' },
      update: {},
      create: {
        slug: 'boom-marketing-teljes-csomag-2025',
        clientName: 'Példa Vállalkozás Kft.',
        clientEmail: 'pelda@vallalkozas.hu',
        brand: 'BOOM',
        status: 'PUBLISHED',
        createdById: admin.id,
        createdByName: admin.name,
        blocks: {
          create: [
            {
              blockType: 'HERO',
              displayOrder: 0,
              isEnabled: true,
              content: {
                heading: 'Marketing Árajánlat 2025',
                subheading: 'Komplex digitális marketing megoldások',
              },
            },
            // ... további blokkok
          ],
        },
      },
      include: { blocks: true },
    })

    console.log('✅ Proposal seeded successfully')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedProduction()
```

**Előnyök:**
- ✅ Type-safe
- ✅ Egy helyen a logika (Prisma schema)
- ✅ Automatic validáció
- ✅ Transactional (atomi műveletek)

---

## 6. NextAuth Integration

### Jelenlegi konfiguráció (lib/auth.ts)

```typescript
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any, // ⚠️ 'as any' type assertion
  // ...
}
```

**Figyelmeztetés:** `as any` használat type incompatibility jele lehet.

### Prisma 7 kompatibilitás ellenőrzése

```bash
# Ellenőrizd a verziók kompatibilitását
npm list @auth/prisma-adapter @prisma/client next-auth

# Várt eredmény Prisma 7-hez:
# @auth/prisma-adapter@2.11.0+ (támogatja Prisma 7-et)
# @prisma/client@7.0.0
# next-auth@4.24.0+
```

**Ha Prisma 7-re váltasz:**
```typescript
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // ✅ Nincs 'as any' ha megfelelő a verzió
  // ...
}
```

Ha típushiba marad, akkor:
```bash
# Frissítsd a @auth/prisma-adapter-t
npm install @auth/prisma-adapter@latest
```

---

## 7. API Routes Ellenőrzése

### Példa: app/api/proposals/route.ts

```typescript
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const proposals = await prisma.proposal.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      // ...
      _count: { select: { blocks: true } }, // ✅ Relation count
    },
  })
  return NextResponse.json(proposals)
}
```

**✅ Pozitívumok:**
- Proper select stratégia (nem fetch-eli az összes mezőt)
- Relation counting használata (_count)
- Error handling

**⚠️ Potenciális javítások:**

```typescript
// 1. Add pagination
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('perPage') || '10')
  const skip = (page - 1) * perPage

  const [proposals, total] = await Promise.all([
    prisma.proposal.findMany({
      skip,
      take: perPage,
      orderBy: { updatedAt: 'desc' },
      select: { /* ... */ },
    }),
    prisma.proposal.count(),
  ])

  return NextResponse.json({
    data: proposals,
    meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
  })
}

// 2. N+1 problem elkerülése
const proposals = await prisma.proposal.findMany({
  include: {
    createdBy: { select: { name: true, email: true } }, // ✅ Eager loading
    _count: { select: { blocks: true } },
  },
})

// 3. Query optimalizálás
const proposals = await prisma.proposal.findMany({
  where: {
    deletedAt: null, // Ha soft delete van
    status: { in: ['DRAFT', 'PUBLISHED'] },
  },
  orderBy: [
    { status: 'asc' },  // Composite ordering
    { updatedAt: 'desc' },
  ],
})
```

---

## 8. Teljesítmény és Optimalizálás

### Index stratégia értékelése

**Jelenlegi indexek a schema-ban:**

```prisma
model Proposal {
  @@index([slug])                    // ✅ Jó - egyedi kereséshez
  @@index([createdById])             // ✅ Jó - user proposals listázáshoz
  @@index([brand])                   // ✅ Jó - brand filteringhez
  @@index([status])                  // ✅ Jó - status filteringhez
  @@index([createdAt(sort: Desc)])   // ✅ Jó - chronological ordering
  @@index([clientName])              // ⚠️ Kérdéses - full table scan lehet
  @@index([isTemplate])              // ✅ Jó - template filtering
}
```

**Hiányzó indexek:**

```prisma
model Proposal {
  // Javasolt composite indexek gyakori query-khez
  @@index([brand, status])           // Brand + status filter
  @@index([createdById, status])     // User + status filter
  @@index([status, updatedAt(sort: Desc)]) // Status + sorting
}

model ProposalBlock {
  // Már van: @@index([proposalId, displayOrder])
  // Javasolt kiegészítés:
  @@index([proposalId, blockType, isEnabled]) // Block type filtering
  @@index([templateId])              // Template usage tracking
}

model ProposalView {
  @@index([proposalId, viewedAt(sort: Desc)]) // ✅ Van
  @@index([viewedAt(sort: Desc)])             // ✅ Van
  // Javasolt kiegészítés:
  @@index([country, viewedAt])       // Geographic analysis
}
```

### Connection Pooling

**Jelenlegi (Prisma 6):**
```typescript
// Nincs explicit pool konfiguráció
const prisma = new PrismaClient()
```

Prisma 6 alapértelmezett connection limit:
- Development: 10 connections
- Production: automatikus skálázás

**Prisma 7-ben (PrismaPg adapter-rel):**
```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                    // Maximum connections
  min: 2,                     // Minimum connections
  idleTimeoutMillis: 30000,   // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Timeout for new connections
})
```

**Vercel Edge Environment-ben:**
```typescript
// Edge runtime-ban connection pooling másképp működik
// Használj Prisma Accelerate-et vagy Supabase Pooler-t

// .env
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=xxx"
```

### Query Optimalizálás Checklist

- [x] Select csak szükséges mezők
- [x] Relation loading stratégia (include vs select)
- [ ] Cursor-based pagination nagy listákhoz
- [ ] Batch queries ahol lehetséges
- [ ] Connection pooling konfiguráció
- [ ] Query performance monitoring

**Javasolt query optimization:**

```typescript
// ❌ ROSSZ - fetcheli az összes mezőt
const proposals = await prisma.proposal.findMany()

// ✅ JÓ - csak szükséges mezők
const proposals = await prisma.proposal.findMany({
  select: {
    id: true,
    slug: true,
    clientName: true,
    status: true,
    _count: { select: { blocks: true } },
  },
})

// ✅ MÉG JOBB - cursor-based pagination
const proposals = await prisma.proposal.findMany({
  take: 20,
  cursor: lastProposal ? { id: lastProposal.id } : undefined,
  skip: lastProposal ? 1 : 0,
  orderBy: { updatedAt: 'desc' },
})
```

---

## 9. Kritikus Problémák Összefoglalása

### 🔴 MAGAS PRIORITÁS

1. **Prisma verzió inkonzisztencia**
   - `@prisma/adapter-pg@7.0.0` telepítve, de nincs használva
   - Döntés: maradj Prisma 6-nál VAGY válts teljesen Prisma 7-re

   **Javasolt akció:**
   ```bash
   # Opció A: Maradj Prisma 6-nál (jelenlegi működő verzió)
   npm uninstall @prisma/adapter-pg

   # Opció B: Válts Prisma 7-re (ajánlott hosszú távra)
   npm install prisma@7.0.0 @prisma/client@7.0.0 @prisma/adapter-pg@7.0.0
   # Majd frissítsd lib/prisma.ts az adapter használatára
   ```

2. **Nincs Prisma Migrate**
   - Kézi SQL scriptek használata production-ben VESZÉLYES
   - Schema drift kockázat

   **Javasolt akció:**
   ```bash
   # Inicializáld a migration rendszert
   npx prisma migrate dev --name init

   # Töröld a kézi SQL scripteket:
   # - scripts/create-tables.mjs
   # - scripts/init-db.mjs
   ```

3. **ProposalStatus enum mismatch**
   - create-tables.mjs: `DRAFT, SENT, VIEWED, ACCEPTED, DECLINED, EXPIRED`
   - schema.prisma: `DRAFT, PUBLISHED, ARCHIVED`
   - Ez runtime hibát okozhat!

   **Javasolt akció:**
   ```prisma
   // Döntsd el melyik a helyes, majd:
   enum ProposalStatus {
     DRAFT
     PUBLISHED  // vagy SENT?
     ARCHIVED   // vagy EXPIRED?
   }

   // Majd migration:
   npx prisma migrate dev --name fix_proposal_status_enum
   ```

### 🟡 KÖZEPES PRIORITÁS

4. **Használaton kívüli dependencies**
   - `@prisma/extension-accelerate` - nincs konfiguráció
   - `pg` package - csak scriptekben, nem a fő alkalmazásban

   **Javasolt akció:**
   ```bash
   # Ha nem használod az Accelerate-et:
   npm uninstall @prisma/extension-accelerate
   ```

5. **Type assertions (`as any`)**
   - `lib/auth.ts`: `PrismaAdapter(prisma) as any`
   - Ez type incompatibility-t jelez

   **Javasolt akció:**
   ```bash
   npm install @auth/prisma-adapter@latest
   # Majd távolítsd el az 'as any'-t
   ```

6. **Hiányzó preview features**
   - Prisma 6 hasznos features-ek nincsenek engedélyezve

   **Javasolt akció:**
   ```prisma
   generator client {
     provider = "prisma-client-js"
     previewFeatures = ["omitApi", "relationJoins", "typedSql"]
   }
   ```

### 🟢 ALACSONY PRIORITÁS

7. **Index optimalizálás**
   - Hiányoznak composite indexek gyakori query mintákhoz

8. **Connection pooling**
   - Nincs explicit konfiguráció

9. **Query optimalizálás**
   - Pagination hiánya nagy listáknál

---

## 10. Konkrét Cselekvési Terv

### Azonnal (1-2 óra)

1. **Döntés: Prisma 6 vagy 7?**

   **Opció A: Maradj Prisma 6-nál** (kevesebb munkával jár)
   ```bash
   cd /Users/bocsijanos/Documents/claude/proposal/proposal-builder
   npm uninstall @prisma/adapter-pg
   npm install
   ```

   **Opció B: Válts Prisma 7-re** (ajánlott)
   ```bash
   cd /Users/bocsijanos/Documents/claude/proposal/proposal-builder
   npm install prisma@7.0.0 @prisma/client@7.0.0 @prisma/adapter-pg@7.0.0
   ```

   Majd frissítsd `lib/prisma.ts`:
   ```typescript
   import { PrismaClient } from '@prisma/client'
   import { PrismaPg } from '@prisma/adapter-pg'
   import { Pool } from 'pg'

   const globalForPrisma = globalThis as unknown as {
     prisma: PrismaClient | undefined
     pool: Pool | undefined
   }

   function createPrismaClient() {
     const pool = globalForPrisma.pool ?? new Pool({
       connectionString: process.env.DATABASE_URL,
       max: process.env.NODE_ENV === 'production' ? 10 : 2,
     })

     if (process.env.NODE_ENV !== 'production') {
       globalForPrisma.pool = pool
     }

     const adapter = new PrismaPg(pool)

     return new PrismaClient({
       adapter,
       log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
     })
   }

   export const prisma = globalForPrisma.prisma ?? createPrismaClient()

   if (process.env.NODE_ENV !== 'production') {
     globalForPrisma.prisma = prisma
   }
   ```

2. **Javítsd a ProposalStatus enum-ot**

   Ellenőrizd az adatbázisban milyen értékek vannak:
   ```bash
   npx tsx -e "
   import { prisma } from './lib/prisma.ts';
   prisma.proposal.groupBy({
     by: ['status'],
     _count: true
   }).then(r => console.log(r))
   .finally(() => process.exit(0))
   "
   ```

   Majd frissítsd a schema.prisma-t az eredmény alapján.

3. **Inicializáld a Prisma Migrate-et**
   ```bash
   # Készíts snapshot-ot a jelenlegi adatbázis állapotról
   npx prisma db pull

   # Hasonlítsd össze a pulled schema-t a schema.prisma-val
   # Javítsd az eltéréseket

   # Hozd létre az első migration-t
   npx prisma migrate dev --name init
   ```

### 1 héten belül

4. **Konvertáld a seed scripteket Prisma-ra**
   - Írj egy `prisma/seed.ts` fájlt
   - Töröld `scripts/seed-production.mjs`
   - Frissítsd `package.json` seed script-et

5. **Távolítsd el a manuális SQL scripteket**
   - `scripts/create-tables.mjs` → migrations
   - `scripts/check-databases.mjs` → Prisma Client lekérdezések

6. **Implementálj connection pooling monitoring-ot**
   ```typescript
   // lib/prisma.ts
   if (process.env.NODE_ENV === 'development') {
     prisma.$on('query', (e) => {
       console.log('Query: ' + e.query)
       console.log('Duration: ' + e.duration + 'ms')
     })
   }
   ```

### 1 hónapon belül

7. **Query optimalizálás**
   - Add hozzá a hiányzó composite indexeket
   - Implementálj cursor-based pagination-t
   - Add hozzá a Prisma preview features-t

8. **Schema javítások**
   - Soft delete implementáció (`deletedAt` mező)
   - Optimistic locking (`version` mező)
   - Additional constraints

9. **Performance monitoring**
   - Prisma logging konfiguráció
   - Slow query detection
   - Connection pool metrics

---

## 11. Tesztelési Útmutató

### Alapvető funkcionális tesztek

```bash
cd /Users/bocsijanos/Documents/claude/proposal/proposal-builder

# 1. Schema validáció
npx prisma validate

# 2. Adatbázis kapcsolat teszt
npx tsx -e "
import { prisma } from './lib/prisma.ts';
prisma.\$queryRaw\`SELECT 1\`
  .then(() => console.log('✅ DB connection OK'))
  .catch(e => console.error('❌ DB connection failed:', e.message))
  .finally(() => process.exit(0))
"

# 3. Modellek elérhetősége
npx tsx -e "
import { prisma } from './lib/prisma.ts';
Promise.all([
  prisma.user.count(),
  prisma.proposal.count(),
  prisma.proposalBlock.count(),
  prisma.blockTemplate.count()
]).then(([users, proposals, blocks, templates]) => {
  console.log('✅ Models accessible:');
  console.log('  Users:', users);
  console.log('  Proposals:', proposals);
  console.log('  Blocks:', blocks);
  console.log('  Templates:', templates);
}).finally(() => process.exit(0))
"

# 4. Relations teszt
npx tsx -e "
import { prisma } from './lib/prisma.ts';
prisma.proposal.findFirst({
  include: {
    createdBy: true,
    blocks: true,
  }
}).then(p => {
  if (p) {
    console.log('✅ Relations working');
    console.log('  Proposal:', p.clientName);
    console.log('  Created by:', p.createdBy.email);
    console.log('  Blocks:', p.blocks.length);
  } else {
    console.log('⚠️  No proposals to test relations');
  }
}).finally(() => process.exit(0))
"

# 5. Enums teszt
npx tsx -e "
import { prisma, ProposalStatus, Brand } from './lib/prisma.ts';
console.log('✅ Enums imported successfully');
console.log('  ProposalStatus:', Object.keys(ProposalStatus));
console.log('  Brand:', Object.keys(Brand));
process.exit(0)
"
```

### Prisma 7 specific tesztek (ha upgrade-elsz)

```bash
# 1. Adapter teszt
npx tsx -e "
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
console.log('✅ PrismaPg adapter initialized');
pool.end().then(() => process.exit(0));
"

# 2. Connection pool teszt
npx tsx -e "
import { prisma } from './lib/prisma.ts';
const queries = Array(20).fill(null).map((_, i) =>
  prisma.proposal.count().then(c => console.log(\`Query \${i}: \${c}\`))
);
Promise.all(queries)
  .then(() => console.log('✅ Connection pooling working'))
  .finally(() => process.exit(0))
"
```

### Migration tesztek

```bash
# 1. Migration status
npx prisma migrate status

# 2. Schema drift detection
npx prisma db pull --print

# 3. Migration dry-run
npx prisma migrate dev --create-only

# 4. Rollback teszt (csak dev környezetben!)
npx prisma migrate reset --skip-seed
npx prisma migrate deploy
```

---

## 12. Prisma Best Practices Checklist

### Schema Design
- [x] Proper indexing strategy
- [x] Field mapping (@map) for database naming
- [x] Enum usage
- [ ] Composite indexes for common queries
- [ ] Soft delete implementation
- [ ] Optimistic locking (version fields)

### Query Optimization
- [x] Select only needed fields
- [x] Relation loading strategy
- [ ] Cursor-based pagination
- [ ] Batch operations
- [ ] Query batching

### Error Handling
- [x] Try-catch blocks
- [ ] Prisma error code handling
- [ ] Proper HTTP status codes
- [ ] Logging strategy

### Type Safety
- [x] Generated types usage
- [ ] No 'as any' casts
- [x] Enum types from Prisma
- [ ] Zod/Yup validation with Prisma types

### Development Workflow
- [ ] Prisma Migrate usage
- [x] Schema validation
- [ ] Seed scripts
- [ ] Development vs Production configs

### Performance
- [x] Connection singleton
- [ ] Connection pooling configuration
- [ ] Query logging in development
- [ ] Slow query detection

### Security
- [x] Environment variable usage
- [ ] SQL injection prevention (Prisma Client)
- [ ] Row-level security considerations
- [ ] Sensitive field omission

---

## 13. Referenciák és További Olvasnivalók

### Hivatalos Prisma Dokumentáció
- [Prisma 7 Release Notes](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [Database Adapters Guide](https://www.prisma.io/docs/orm/overview/databases/database-drivers)
- [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate)
- [Connection Pooling](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-pool)

### Next.js Specific
- [Next.js + Prisma Best Practices](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices)
- [NextAuth + Prisma](https://authjs.dev/getting-started/adapters/prisma)

### Performance
- [Query Optimization Guide](https://www.prisma.io/docs/orm/prisma-client/queries/query-optimization-performance)
- [Prisma Accelerate](https://www.prisma.io/docs/accelerate)

---

## Összegzés

### Aktuális állapot
- **Prisma verzió:** 6.0.1 (működik)
- **Migration rendszer:** Nincs (kézi SQL)
- **Prisma 7 kompatibilitás:** Részleges (adapter telepítve, de nem használt)

### Ajánlott lépések prioritás szerint

#### 🔴 Kritikus (azonnal)
1. Tisztázd a Prisma verziót: maradj 6-nál vagy válts 7-re
2. Javítsd a ProposalStatus enum mismatch-et
3. Távolítsd el a használaton kívüli dependencies-t

#### 🟡 Fontos (1 héten belül)
4. Inicializáld a Prisma Migrate-et
5. Konvertáld a seed scripteket
6. Implementálj proper error handling-et

#### 🟢 Javasolt (1 hónapon belül)
7. Optimalizáld az indexelést
8. Add hozzá a preview features-t
9. Implementálj performance monitoring-ot

### Záró gondolatok

A projekt **alapvetően jó állapotban** van Prisma szempontból:
- A schema jól megtervezett
- A Prisma Client használata helyes
- Az API routes-ok megfelelőek

A **fő probléma** a migration rendszer hiánya és a verzió inkonzisztencia. Ezek kezelése után a projekt production-ready lesz.

**Következő lépés:** Válaszd ki hogy Prisma 6-nál maradsz vagy 7-re váltasz, majd kövesd a cselekvési tervet.
