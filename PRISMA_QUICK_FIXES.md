# Prisma - Azonnali Javítások
**Gyors referencia a legfontosabb problémákhoz**

---

## 🔴 KRITIKUS: PostgreSQL Prepared Statement Hiba

### Probléma
```
PostgresError { code: "42P05", message: "prepared statement \"s0\" already exists" }
```

### Ok
A Prisma Client újra használja a connection pool-t development módban, és a prepared statement-ek ütköznek.

### Azonnali megoldás

**Opció 1: Restart a connection pool**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

// ✅ JAVÍTÁS: Disconnect előző instance
if (globalForPrisma.prisma) {
  globalForPrisma.prisma.$disconnect()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

**Opció 2: Használj Prisma 7-et driver adapter-rel**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

function createPrismaClient() {
  // Singleton pool - NEM készít újat hot reload-nál
  const pool = globalForPrisma.pool ?? new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
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

**Opció 3: Disable prepared statements (gyors workaround)**
```bash
# .env
DATABASE_URL="postgres://postgres:postgres@127.0.0.1:51214/template1?sslmode=disable&pgbouncer=true"
```

A `pgbouncer=true` paraméter kikapcsolja a prepared statement-eket.

**⚠️ Ez teljesítmény csökkenést okozhat, de megoldja a hibát.**

---

## 🔴 KRITIKUS: Verzió Inkonzisztencia

### Probléma
```json
{
  "@prisma/adapter-pg": "^7.0.0",
  "@prisma/client": "6.0.1",
  "prisma": "6.0.1"
}
```

**Prisma 7 adapter Prisma 6 client-tel!**

### Azonnali döntés szükséges

**Opció A: Maradj Prisma 6-nál** (ajánlott ha gyors megoldás kell)
```bash
npm uninstall @prisma/adapter-pg
npm install
npx prisma generate
```

**Opció B: Upgrade Prisma 7-re** (ajánlott hosszú távra)
```bash
npm install prisma@7.0.0 @prisma/client@7.0.0 @prisma/adapter-pg@7.0.0
npx prisma generate
```

Majd frissítsd a `lib/prisma.ts`-t (lásd fent az Opció 2-t)

---

## 🟡 FONTOS: ProposalStatus Enum Mismatch

### Probléma

**create-tables.mjs:**
```sql
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'DECLINED', 'EXPIRED');
```

**schema.prisma:**
```prisma
enum ProposalStatus {
  DRAFT
  PUBLISHED  // ❌ nincs a SQL-ben
  ARCHIVED   // ❌ nincs a SQL-ben
}
```

### Azonnali megoldás

**1. Ellenőrizd az adatbázist:**
```bash
npx tsx -e "
import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
pool.query(\"SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE pg_type.typname = 'ProposalStatus'\")
  .then(r => console.log('DB enum values:', r.rows.map(x => x.enumlabel)))
  .finally(() => pool.end())
"
```

**2. Döntsd el melyik a helyes:**

Ha az adatbázis használja a régi értékeket (SENT, VIEWED, stb):
```prisma
enum ProposalStatus {
  DRAFT
  SENT
  VIEWED
  ACCEPTED
  DECLINED
  EXPIRED
}
```

Ha az új értékeket szeretnéd (PUBLISHED, ARCHIVED):
```sql
-- Migration script
ALTER TYPE "ProposalStatus" ADD VALUE 'PUBLISHED';
ALTER TYPE "ProposalStatus" ADD VALUE 'ARCHIVED';

-- Migráld a régi adatokat
UPDATE proposals SET status = 'PUBLISHED' WHERE status = 'SENT';
UPDATE proposals SET status = 'ARCHIVED' WHERE status = 'EXPIRED';
```

**3. Generáld újra a Prisma Client:**
```bash
npx prisma generate
```

---

## 🟡 FONTOS: Nincs Prisma Migrate

### Probléma
- Nincs `prisma/migrations/` mappa
- Kézi SQL scriptek használata
- Schema drift kockázat

### Azonnali megoldás

**1. Készíts baseline migration-t:**
```bash
# Dry run - csak generálja, ne alkalmazza
npx prisma migrate dev --name init --create-only

# Nézd meg mit generált
cat prisma/migrations/*_init/migration.sql
```

**2. Ha a migration helyes:**
```bash
# Jelöld meg hogy már alkalmazva van (baseline)
npx prisma migrate resolve --applied $(ls -1 prisma/migrations | head -1)
```

**3. Töröld a régi SQL scripteket:**
```bash
# NE törölj semmit amíg a migration nem működik!
# Csak akkor amikor biztos vagy hogy minden rendben
```

---

## 🔧 Gyors Ellenőrző Script

Másold ezt egy `check-prisma.mjs` fájlba:

```javascript
#!/usr/bin/env node
import { PrismaClient } from '@prisma/client'
import pkg from 'pg'
const { Pool } = pkg

async function check() {
  console.log('🔍 Prisma Setup Ellenőrzés\n')

  // 1. Verzió ellenőrzés
  console.log('📦 Verziók:')
  const packageJson = await import('./package.json', { assert: { type: 'json' } })
  console.log('  @prisma/client:', packageJson.default.dependencies['@prisma/client'])
  console.log('  prisma:', packageJson.default.dependencies['prisma'])
  console.log('  @prisma/adapter-pg:', packageJson.default.dependencies['@prisma/adapter-pg'] || 'nincs telepítve')

  // 2. Schema validáció
  console.log('\n✅ Schema validation...')
  // A prisma validate parancsot külön kell futtatni

  // 3. Adatbázis kapcsolat
  console.log('\n🔌 Adatbázis kapcsolat...')
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  try {
    await pool.query('SELECT 1')
    console.log('  ✅ PostgreSQL kapcsolat OK')
  } catch (e) {
    console.log('  ❌ PostgreSQL kapcsolat hiba:', e.message)
  } finally {
    await pool.end()
  }

  // 4. Prisma Client teszt
  console.log('\n🔧 Prisma Client...')
  const prisma = new PrismaClient()
  try {
    const userCount = await prisma.user.count()
    console.log('  ✅ Prisma Client OK')
    console.log('  📊 Users:', userCount)
  } catch (e) {
    console.log('  ❌ Prisma Client hiba:', e.message)
  } finally {
    await prisma.$disconnect()
  }

  // 5. Enum check
  console.log('\n📋 Enum értékek...')
  const pool2 = new Pool({ connectionString: process.env.DATABASE_URL })
  try {
    const result = await pool2.query(`
      SELECT enumlabel
      FROM pg_enum
      JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
      WHERE pg_type.typname = 'ProposalStatus'
      ORDER BY enumlabel
    `)
    console.log('  ProposalStatus DB:', result.rows.map(r => r.enumlabel).join(', '))
  } catch (e) {
    console.log('  ❌ Enum query hiba:', e.message)
  } finally {
    await pool2.end()
  }

  console.log('\n✅ Ellenőrzés kész!')
}

check()
```

Futtatás:
```bash
chmod +x check-prisma.mjs
node check-prisma.mjs
```

---

## 📝 Gyors Package.json Script-ek

```json
{
  "scripts": {
    "prisma:validate": "prisma validate",
    "prisma:generate": "prisma generate",
    "prisma:studio": "prisma studio",
    "prisma:format": "prisma format",
    "db:check": "node check-prisma.mjs",
    "db:migrate:dev": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

---

## 🚀 1 Perces Gyors Fix

Ha AZONNAL működőképes állapotot akarsz:

```bash
# 1. Távolítsd el a problémás adapter-t
npm uninstall @prisma/adapter-pg

# 2. Generáld újra a Prisma Client-et
npx prisma generate

# 3. Restart a dev server
npm run dev
```

**Ez fix-eli:**
- ✅ Verzió inkonzisztencia
- ✅ Prepared statement hiba (valószínűleg)
- ✅ Type errors

**De nem oldja meg:**
- ❌ Migration hiány
- ❌ Enum mismatch
- ❌ Long-term Prisma 7 upgrade

---

## 📊 Prioritási Sorrend

1. **MOST (5 perc):** Fix prepared statement hiba + verzió inkonzisztencia
2. **MA (30 perc):** Enum mismatch javítás
3. **EZ A HÉT (2 óra):** Prisma Migrate bevezetés
4. **KÉSŐBB:** Prisma 7 upgrade (ha szükséges)

---

## 🆘 Ha elakadtál

1. **Restart everything:**
   ```bash
   npx prisma generate
   rm -rf .next
   npm run dev
   ```

2. **Check logs:**
   ```bash
   # Next.js logs
   npm run dev

   # Prisma debug
   DEBUG="prisma*" npm run dev
   ```

3. **Fresh start:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npx prisma generate
   ```

4. **Adatbázis reset (CSAK DEV!):**
   ```bash
   # ⚠️ TÖRLI AZ ÖSSZES ADATOT!
   npx prisma db push --force-reset
   npm run db:seed
   ```

---

## ✅ Siker Checklist

Amikor minden működik:

- [ ] `npx prisma validate` -> ✅
- [ ] `npx prisma generate` -> nincs error
- [ ] `npm run dev` -> elindul hibák nélkül
- [ ] Prisma Studio: `npx prisma studio` -> látod az adatokat
- [ ] API működik: `curl http://localhost:3000/api/debug`
- [ ] Nincsenek prepared statement hibák a console-ban

Ha minden kipipálható, **készen vagy!** 🎉
