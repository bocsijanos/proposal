# 🚀 Gyors Indítás - Árajánlat Készítő

## 1️⃣ Prisma Dev Server Indítása

Nyiss egy terminált és futtasd:

```bash
cd /Users/bocsijanos/Documents/claude/proposal/proposal-builder
npx prisma dev
```

Hagyd futni a háttérben! ✅

---

## 2️⃣ Admin User Hozzáadása (Prisma Studio)

Új terminálablakban:

```bash
npx prisma studio
```

Ez megnyit egy böngészőablakot a [http://localhost:5555](http://localhost:5555) címen.

### User tábla feltöltése:

1. Kattints a **User** táblára
2. Kattints **Add record**
3. Töltsd ki:

**Boom Admin:**
- **id**: (hagyd üresen, automatikus)
- **email**: `admin@boommarketing.hu`
- **passwordHash**: `$2b$10$drOua6VaRUnGziMY3qtQBe/QPahAf41Po45OLMjfV0Qp4TYn2.jHK`
- **name**: `Boom Admin`
- **role**: `SUPER_ADMIN`
- **createdAt**: (hagyd üresen, automatikus)
- **updatedAt**: (hagyd üresen, automatikus)

4. **Save 1 change**

Opcionálisan add hozzá az AiBoost admint is:
- **email**: `admin@aiboost.hu`
- **passwordHash**: `$2b$10$drOua6VaRUnGziMY3qtQBe/QPahAf41Po45OLMjfV0Qp4TYn2.jHK`
- **name**: `AiBoost Admin`
- **role**: `ADMIN`

---

## 3️⃣ Dev Server Indítása

Harmadik terminálablakban:

```bash
npm run dev
```

---

## 4️⃣ Bejelentkezés

Nyisd meg: **http://localhost:3000**

**Belépési adatok:**
- 📧 Email: `admin@boommarketing.hu`
- 🔑 Jelszó: `admin123`

---

## ✅ Kész!

Most már használhatod az alkalmazást:
- 📋 Dashboard: proposals lista
- ➕ Új proposal létrehozás
- ✏️ Drag & drop builder
- 👁️ Publikus nézet

---

## 💡 Tipp

A **bcrypt hash** az `admin123` jelszóhoz készült. Ha más jelszót szeretnél:

```bash
node -e "const bcrypt = require('./node_modules/bcryptjs'); console.log(bcrypt.hashSync('uj-jelszo', 10));"
```
