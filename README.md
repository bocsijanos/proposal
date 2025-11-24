# 📋 Webes Árajánlat Készítő

Modern webes alkalmazás marketing árajánlatok készítéséhez és megosztásához. Drag-and-drop blokk építő, egyedi URL-ek minden ajánlathoz, és brand-specifikus témák (Boom Marketing & AiBoost).

## 🚀 Technológiai Stack

- **Frontend & Backend**: Next.js 15 (App Router), React 19, TypeScript
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **ORM**: Prisma 7
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State Management**: Zustand
- **Text Editor**: Tiptap
- **Drag & Drop**: dnd-kit

## 📋 Előfeltételek

- Node.js 20+ ([letöltés](https://nodejs.org/))
- Docker Desktop ([letöltés](https://www.docker.com/products/docker-desktop/))
- npm vagy yarn package manager

## 🛠️ Telepítés és Indítás

### 1. Repository klónozása

```bash
cd /Users/bocsijanos/Documents/claude/proposal/proposal-builder
```

### 2. Dependencies telepítése

```bash
npm install
```

### 3. Environment változók beállítása

Az `.env` fájl már létrejött Prisma helyi adatbázissal. A fájl tartalma:

```bash
DATABASE_URL="prisma+postgres://localhost:51213/..."
```

Ez a Prisma helyi fejlesztői adatbázis-szerverét használja (Docker nélkül).

### 4. Prisma Dev Server indítása

**FONTOS**: Ez a projekt a Prisma helyi PostgreSQL szerverét használja (nem Docker-t):

```bash
# Prisma dev server indítása (háttérben marad futni)
npx prisma dev
```

Ez elindít egy helyi PostgreSQL szervert a 51213-51215 portokon.

**Adatbázis információk:**
- Adatbázis név: `template1`
- Port: `51214` (TCP connection)
- Connection string: `postgres://postgres:postgres@127.0.0.1:51214/template1?sslmode=disable`

### 5. Adatbázis séma létrehozása

```bash
# Séma push az adatbázisba
npx prisma db push

# Prisma Client generálása
npx prisma generate
```

### 6. Seed adatok betöltése

**ISMERT PROBLÉMA**: Prisma 7.0.0 kompatibilitási hiba

Jelenleg a seed scriptek nem futnak a Prisma 7.0.0 TypeScript futtatókörnyezettel való inkompatibilitás miatt.
Két lehetőség:

**A) Manuális seed Prisma Studio-val:**

```bash
# Prisma Studio megnyitása
npx prisma studio
```

Majd add hozzá manuálisan a User táblában:
- Email: `admin@boommarketing.hu`
- Name: `Boom Admin`
- Role: `SUPER_ADMIN`
- PasswordHash: `$2a$10$xxxxx` (bcrypt hash az "admin123" jelszóhoz)

**B) Várj a Prisma 7.x patch-re** amely javítja a PrismaClient inicializálási hibát.

### 7. Fejlesztői szerver indítása

```bash
npm run dev
```

Az alkalmazás elérhető: **http://localhost:3000**

## 🔐 Bejelentkezés

A seed után két admin felhasználó jön létre:

| Email | Jelszó | Brand |
|-------|--------|-------|
| `admin@boommarketing.hu` | `admin123` | Boom Marketing |
| `admin@aiboost.hu` | `admin123` | AiBoost |

## 📁 Projekt Struktúra

```
proposal-builder/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Autentikációs útvonalak
│   ├── (dashboard)/       # Admin dashboard
│   ├── [slug]/            # Publikus ajánlat nézet
│   └── api/               # API endpoints
│
├── components/
│   ├── builder/           # Builder UI komponensek
│   ├── blocks/            # 12 blokk típus komponens
│   ├── editor/            # Szövegszerkesztő komponensek
│   ├── theme/             # Brand váltó és témák
│   └── ui/                # shadcn/ui komponensek
│
├── lib/
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # NextAuth konfig (készülőben)
│   ├── redis.ts           # Redis client (készülőben)
│   └── themes.ts          # Brand témák (készülőben)
│
├── store/                 # Zustand state stores (készülőben)
├── prisma/
│   ├── schema.prisma      # Adatbázis séma
│   ├── seed.ts            # Seed adatok
│   └── migrations/        # Adatbázis migrációk
│
├── docker-compose.yml     # Docker szolgáltatások
├── .env.local             # Environment változók
└── README.md              # Ez a fájl
```

## 🎨 Brand Témák

Az alkalmazás két brand témát támogat:

### Boom Marketing
- Primary: `#fa604a` (coral)
- Secondary: `#3e4581` (slate blue)
- Background: `#0b0326` (navy)

### AiBoost
- Primary: `#d187fc` (magenta-purple)
- Secondary: `#5152a4` (muted purple)
- Background: `#1f1f43` (deep navy)

## 📦 Blokk Típusok

Az alkalmazás 12 előre tervezett blokk típust támogat:

1. **HERO** - Teljes szélességű hero háttérképpel
2. **VALUE_PROP** - 2 oszlopos értékajánlat
3. **PLATFORM_FEATURES** - Platform funkciók bullet pontokkal
4. **PRICING_TABLE** - 3 oszlopos árazási táblázat
5. **GUARANTEES** - Garanciák 3 oszlopban
6. **PROCESS_TIMELINE** - Folyamat lépésről lépésre
7. **CLIENT_LOGOS** - Ügyfél logók grid-ben
8. **SERVICES_GRID** - Szolgáltatások kártyákban
9. **TEXT_BLOCK** - Egyszerű szöveges blokk
10. **TWO_COLUMN** - Kép + szöveg kombináció
11. **CTA** - Call-to-action szekció
12. **STATS** - Statisztikák megjelenítése

## 🗄️ Adatbázis Management

### Prisma Studio indítása (GUI)

```bash
npx prisma studio
```

### Új migráció létrehozása

```bash
npx prisma migrate dev --name migration_neve
```

### Adatbázis reset (összes adat törlése)

```bash
npx prisma migrate reset
```

### Seed újrafuttatása

```bash
npx prisma db seed
```

## 🐳 Docker Parancsok

```bash
# Services indítása
docker compose up -d

# Services leállítása
docker compose down

# Services leállítása + adatok törlése
docker compose down -v

# Logok megtekintése
docker compose logs -f

# Postgres belépés
docker exec -it proposal-postgres psql -U admin -d proposals

# Redis belépés
docker exec -it proposal-redis redis-cli
```

## 🔧 Hasznos NPM Scriptek

```bash
npm run dev          # Fejlesztői szerver
npm run build        # Production build
npm run start        # Production szerver indítása
npm run lint         # ESLint futtatása
```

## 🚧 Fejlesztés Alatt - Aktuális Státusz

### ✅ Elkészült

**2025-11-23:**
- [x] Projekt setup (Next.js 15, React 19, TypeScript)
- [x] Prisma 7 séma és konfiguráció
- [x] Prisma dev server setup
- [x] Seed scriptek (admin userek + block templates)
- [x] NextAuth.js autentikáció konfiguráció
- [x] Login oldal brand-aware designnal
- [x] Dashboard layout navigációval és brand switcherrel
- [x] Dashboard proposals lista
- [x] Új proposal létrehozás UI
- [x] Proposal API endpoints (GET, POST, PATCH, DELETE)
- [x] Builder edit page (vázlat)
- [x] BlockRenderer komponens
- [x] 6 blokk komponens implementálva:
  - HeroBlock (hero section gradienttel)
  - PricingBlock (3 oszlopos pricing table)
  - ServicesBlock (grid szolgáltatás kártyákkal)
  - ValuePropBlock (2 oszlopos value proposition)
  - GuaranteesBlock (3 oszlopos garanciák)
  - CTABlock (call-to-action gradienttel)
- [x] Publikus proposal view ([slug]/page.tsx)
- [x] SEO metadata generálás
- [x] View tracking (látogatások számlálása)
- [x] Brand témák (Boom & AiBoost)
- [x] ThemeProvider és SessionProvider
- [x] UI komponensek (Button, Input, Label)
- [x] Sample proposal generation script

**2025-11-24:**
- [x] Email funkció - Gmail compose előre kitöltve az ajánlat linkjével
- [x] Ügyfél mezők hozzáadva: kapcsolattartó neve, telefon, email
- [x] Connection timeout probléma megoldva (Prisma pool optimalizálás)
- [x] Dynamic rendering konfigurálva az ajánlat oldalakon

### 🚧 Folyamatban

- [ ] **Prisma 7.0.0 seed script kompatibilitás javítása**
  - Ismert hiba: `TypeError: Cannot read properties of undefined (reading '__internal')`
  - Átmeneti megoldás: Manuális seed Prisma Studio-val
- [ ] Builder drag & drop funkcionalitás
- [ ] Block property panel (tartalom szerkesztése)
- [ ] További 6 blokk típus implementálása

### 📋 Következő lépések

1. Seed adatok manuális feltöltése Prisma Studio-val vagy Prisma patch várása
2. Dev server indítása és login tesztelése
3. Új proposal létrehozás és publikus nézet tesztelése
4. Drag & drop builder implementálása
5. Block editing UI elkészítése
6. További blokkok implementálása

## 📝 Fejlesztési Roadmap

### Fázis 1: Alapinfrastruktúra (Elkészült ✅)
- Next.js projekt setup
- Docker Compose (PostgreSQL + Redis)
- Prisma séma és migrációk
- Seed adatok

### Fázis 2: Autentikáció és UI Alapok (Folyamatban 🚧)
- NextAuth.js integráció
- Login oldal
- Dashboard layout
- Tailwind + shadcn/ui konfiguráció
- Brand témák rendszer

### Fázis 3: Builder Felület
- Drag & drop canvas
- Block library sidebar
- Property panel
- Szövegszerkesztő integráció
- State management

### Fázis 4: Blokk Komponensek
- Mind a 12 blokk típus implementálása
- Reszponzív design
- Brand-specifikus styling

### Fázis 5: Publikus Nézet
- Landing page renderelés
- SEO optimalizálás
- Cache integráció
- Analytics tracking

### Fázis 6: Kiegészítő Funkciók
- Ajánlat duplikálás
- Verziókezelés
- Admin analytics
- Performance optimization

## ⚠️ Ismert Problémák és Megoldások

### Connection Timeout az Ajánlat Oldalakon

**Probléma**: Az ajánlat oldalak betöltésekor `Connection terminated due to connection timeout` hiba.

**Kijavítva (2025-11-24)**:
- A Prisma connection pool beállítások optimalizálva lettek a Prisma Dev-hez
- `max: 3` connection (metadata + page + view tracking)
- `connectionTimeoutMillis: 10000` (10s)
- `dynamic = 'force-dynamic'` a `[slug]/page.tsx`-ben (nem compile time-ban futnak a query-k)
- View tracking `setImmediate()`-be téve hogy ne blokkolja a page load-ot

**Prisma Connection Pool konfiguráció** ([lib/prisma.ts](lib/prisma.ts)):
```typescript
max: 3,  // Limited for Prisma Dev compatibility
min: 1,
idleTimeoutMillis: 10000,
connectionTimeoutMillis: 10000,
```

## 🐛 Hibaelhárítás

### Prisma 7.0.0 seed script nem fut (TypeError: Cannot read '__internal')

Ez egy ismert kompatibilitási probléma a Prisma 7.0.0 és a TypeScript futtatókörnyezetek között.

**Megoldások:**

1. **Manuális seed Prisma Studio-val:**
   ```bash
   npx prisma studio
   ```
   Majd add hozzá a User rekordokat manuálisan (lásd fent).

2. **Admin user létrehozása bcrypt hash-sel:**
   - Telepíts bcryptjs-t: `npm install bcryptjs`
   - Generálj hash-t:
     ```bash
     node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10));"
     ```
   - Másold be a hash-t a Prisma Studio User táblába

3. **Alternatív: Várj Prisma 7.0.x patch verzióra** amely javítja ezt a hibát.

### Prisma dev server nem indul

```bash
# Állítsd le az előző instance-t:
pkill -f "prisma dev"

# Indítsd újra:
npx prisma dev
```

### Port foglalt (3000)

```bash
# Módosítsd a portot:
npm run dev -- -p 3001
```

### Database connection error

Ellenőrizd, hogy a Prisma dev server fut-e:

```bash
# Prisma dev server újraindítása
npx prisma dev
```

Majd másik terminálban:

```bash
# Séma push
npx prisma db push
```

### NextAuth session hiba

Ha bejelentkezés közben session hibát kapsz, ellenőrizd az `NEXTAUTH_SECRET`-et a `.env` fájlban:

```bash
# Új secret generálása:
openssl rand -base64 32
```

## 📞 Támogatás

Ha kérdésed vagy problémád van, ellenőrizd:

1. Docker Desktop fut-e
2. PostgreSQL és Redis containerek healthy állapotban vannak-e
3. `.env.local` fájl helyesen van-e konfigurálva
4. Node.js 20+ telepítve van-e

## 📄 Licenc

Ez egy privát projekt a Boom Marketing és AiBoost számára.

---

**Verzió**: 0.1.0
**Utolsó frissítés**: 2025-01-23
