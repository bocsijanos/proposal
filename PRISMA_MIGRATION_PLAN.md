# Prisma Migration Bevezetési Terv
**Projekt:** Proposal Builder
**Cél:** Átállás kézi SQL-ről Prisma Migrate-re

---

## Miért szükséges?

Jelenleg a projekt **kézi SQL scripteket** használ (`scripts/create-tables.mjs`), ami:
- ❌ Nincs verzió történet a schema változásokról
- ❌ Schema drift kockázat (adatbázis és Prisma schema eltérhet)
- ❌ Team collaboration nehéz
- ❌ Production deployment kockázatos
- ❌ Nincs rollback lehetőség

---

## Lépésről lépésre

### Előkészületek (5 perc)

```bash
cd /Users/bocsijanos/Documents/claude/proposal/proposal-builder

# 1. Készíts backup-ot az adatbázisról
pg_dump "postgres://postgres:postgres@127.0.0.1:51214/template1" > backup_before_migration.sql

# 2. Ellenőrizd az aktuális adatbázis állapotot
npx prisma db pull --print > current_db_schema.prisma

# 3. Hasonlítsd össze a current_db_schema.prisma-t a prisma/schema.prisma-val
diff prisma/schema.prisma current_db_schema.prisma
```

### 1. lépés: Schema drift javítása (10 perc)

Ha a `diff` mutat eltéréseket, akkor először javítsd ezeket:

**Példa probléma: ProposalStatus enum**

```bash
# Ellenőrizd milyen status értékek vannak az adatbázisban
npx tsx -e "
import { prisma } from './lib/prisma.ts';
prisma.proposal.groupBy({
  by: ['status'],
  _count: true
}).then(r => console.log('Status értékek:', r))
.finally(() => process.exit(0))
"
```

**Ha az adatbázis és schema.prisma között eltérés van:**

Opció A: Frissítsd a schema.prisma-t az adatbázisnak megfelelően
```prisma
enum ProposalStatus {
  DRAFT
  SENT      // Ha ez van az adatbázisban
  VIEWED    // Ha ez van az adatbázisban
  ACCEPTED
  DECLINED
  EXPIRED
}
```

Opció B: Migráld az adatokat az új schema-ra
```sql
-- Példa: SENT -> PUBLISHED migration
UPDATE proposals SET status = 'PUBLISHED' WHERE status = 'SENT';
```

### 2. lépés: Első migráció létrehozása (5 perc)

```bash
# Hozd létre az első migration-t a jelenlegi állapotból
npx prisma migrate dev --name init

# Ez létrehoz egy prisma/migrations/TIMESTAMP_init/ mappát
# Benne egy migration.sql fájllal
```

**FONTOS:** Ellenőrizd a generált migration.sql-t!

```bash
cat prisma/migrations/*_init/migration.sql
```

Ha a migráció DROP TABLE-eket tartalmaz, **NE FUTTASD**!
Helyette:

```bash
# Jelöld meg hogy ez a migration már alkalmazva van (baseline)
npx prisma migrate resolve --applied TIMESTAMP_init
```

### 3. lépés: Migrations mappa strukturálása (5 perc)

```
prisma/
├── migrations/
│   ├── 20251125000000_init/
│   │   └── migration.sql
│   └── migration_lock.toml
└── schema.prisma
```

A `migration_lock.toml` automatikusan generálódik és rögzíti a provider-t.

### 4. lépés: Scripts frissítése (15 perc)

**Törlendő fájlok:**
```bash
rm scripts/create-tables.mjs
rm scripts/init-db.mjs
```

**Új seed script: prisma/seed.ts**

```typescript
import { PrismaClient, Brand, ProposalStatus, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Admin user
  const adminPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@boommarketing.hu' },
    update: {},
    create: {
      email: 'admin@boommarketing.hu',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // 2. Block Templates for BOOM
  const boomTemplates = await Promise.all([
    prisma.blockTemplate.upsert({
      where: { id: 'boom-hero-default' },
      update: {},
      create: {
        id: 'boom-hero-default',
        blockType: 'HERO',
        name: 'BOOM Hero Default',
        brand: Brand.BOOM,
        defaultContent: {
          heading: 'Növeld vállalkozásod online jelenlétét',
          subheading: 'Professzionális marketing megoldások',
        },
        displayOrder: 0,
        isActive: true,
      },
    }),
    // ... további template-ek
  ])

  console.log('✅ Templates created:', boomTemplates.length)

  // 3. Sample proposal (opcionális)
  const sampleProposal = await prisma.proposal.upsert({
    where: { slug: 'sample-proposal-001' },
    update: {},
    create: {
      slug: 'sample-proposal-001',
      clientName: 'Példa Cég Kft.',
      brand: Brand.BOOM,
      status: ProposalStatus.DRAFT,
      createdById: admin.id,
      createdByName: admin.name,
      blocks: {
        create: [
          {
            blockType: 'HERO',
            displayOrder: 0,
            isEnabled: true,
            content: {
              heading: 'Üdvözlünk!',
            },
          },
        ],
      },
    },
  })

  console.log('✅ Sample proposal created:', sampleProposal.slug)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

**Frissítsd a package.json-t:**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "db:migrate:dev": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset",
    "db:studio": "prisma studio"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### 5. lépés: Production deployment frissítése (10 perc)

**Vercel / Production környezetben:**

```bash
# Build script már jó:
# "build": "prisma generate && next build"

# De add hozzá a migration deployment-et a build folyamathoz
```

**Opció A: Vercel Build Command**
```
prisma migrate deploy && prisma generate && next build
```

**Opció B: package.json script**
```json
{
  "scripts": {
    "build": "prisma migrate deploy && prisma generate && next build"
  }
}
```

**⚠️ FIGYELEM:** Production-ben **SOHA** ne használd a `prisma migrate dev`-et!
Csak a `prisma migrate deploy`-t!

### 6. lépés: Git és Documentation (5 perc)

```bash
# Commitold az új migration rendszert
git add prisma/migrations/
git add prisma/seed.ts
git add package.json
git rm scripts/create-tables.mjs scripts/init-db.mjs
git commit -m "feat: migrate from manual SQL to Prisma Migrate

- Initialize Prisma Migrate with baseline
- Create seed script with Prisma Client
- Remove manual SQL scripts
- Update package.json scripts"
```

---

## Használat a jövőben

### Új mező hozzáadása a schema-hoz

```prisma
// prisma/schema.prisma
model Proposal {
  // ... existing fields
  archivedAt DateTime? @map("archived_at") // ÚJ MEZŐ
}
```

```bash
# Generáld a migration-t
npx prisma migrate dev --name add_archived_at_to_proposals

# Ez automatikusan:
# 1. Létrehozza a migration SQL-t
# 2. Alkalmazza az adatbázisra
# 3. Újra generálja a Prisma Client-et
```

### Enum érték hozzáadása

```prisma
enum ProposalStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
  ON_HOLD    // ÚJ ÉRTÉK
}
```

```bash
npx prisma migrate dev --name add_on_hold_status
```

### Adatbázis reset development-ben

```bash
# VESZÉLYES - törli az összes adatot!
npx prisma migrate reset

# Ez:
# 1. Eldobja az adatbázist
# 2. Újra létrehozza
# 3. Alkalmazza az összes migration-t
# 4. Futtatja a seed script-et
```

### Production deployment

```bash
# Vercel automatikusan futtatja a build script-et:
# prisma migrate deploy && prisma generate && next build

# Manuális deploy esetén:
npx prisma migrate deploy
```

---

## Troubleshooting

### "Migration nem található" hiba

```bash
# Ha nem találja a migration-t:
npx prisma migrate resolve --applied MIGRATION_NAME

# vagy
npx prisma migrate resolve --rolled-back MIGRATION_NAME
```

### Schema és adatbázis nincs szinkronban

```bash
# Ellenőrizd az eltéréseket
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma \
  --script

# Ha kézi javításra van szükség
npx prisma db push --skip-generate
```

### Migration konfliktus

```bash
# Ha valaki más is készített migration-t
git pull
npx prisma migrate resolve --applied THEIR_MIGRATION

# Majd hozd létre a saját migration-ödet
npx prisma migrate dev
```

---

## Checklist

Mielőtt production-be mész:

- [ ] Minden migration-t commitoltál
- [ ] `npx prisma migrate status` zöld
- [ ] Seed script működik: `npm run db:seed`
- [ ] Build sikerül: `npm run build`
- [ ] Backup létrehozva production adatbázisról
- [ ] `migration_lock.toml` commitolva
- [ ] CI/CD frissítve a migration deploy-ra

---

## Következő lépések

1. **Most:** Kövesd ezt a guide-ot development környezetben
2. **Teszt:** Futtasd végig staging/preview környezetben
3. **Production:** Alkalmazd production-re maintenance window-ban

**Időigény:** ~1 óra (első alkalommal)
**Kockázat:** Alacsony (ha követed a lépéseket)
**Előny:** Hatalmas (verzió kontroll, team collaboration, biztonságos deployment)
