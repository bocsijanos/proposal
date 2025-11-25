# BOOM Marketing - Kép Feltöltési Útmutató

## Hiányzó képek a PDF-ből

A BOOM Marketing sablonok jelenleg placeholder képútvonalakat használnak. Az alábbi képeket kell kinyerni a PDF-ből és feltölteni a megfelelő helyre.

---

## 📸 Háttérképek és Illusztrációk

### 1. Hero Háttérkép (1. oldal)
- **Fájlnév:** `hero-meeting-bg.jpg`
- **Útvonal:** `/public/images/boom/hero-meeting-bg.jpg`
- **Forrás:** PDF 1. oldal teljes háttere (meeting room fotó laptopokkal)
- **Használat:** HeroBlock háttérképként

### 2. Ökoszisztéma Illusztráció (2. oldal)
- **Fájlnév:** `ecosystem-illustration.svg` vagy `.png`
- **Útvonal:** `/public/images/boom/ecosystem-illustration.svg`
- **Forrás:** PDF 2. oldal középső ábra (két ember charttal és fogaskerekekkel)
- **Használat:** ValuePropBlock központi ikon

### 3. Számítógépes Illusztráció (3. oldal)
- **Fájlnév:** `ecosystem-computer.svg` vagy `.png`
- **Útvonal:** `/public/images/boom/ecosystem-computer.svg`
- **Forrás:** PDF 3. oldal jobb oldali illusztráció (ember számítógép előtt monitorral)
- **Használat:** TwoColumnBlock kép

### 4. Garancia Shield (10. oldal)
- **Fájlnév:** `guarantee-shield.svg` vagy `.png`
- **Útvonal:** `/public/images/boom/guarantee-shield.svg`
- **Forrás:** PDF 10. oldal nagy központi illusztráció (csapat együttműködés, kulcs és pajzs szimbólumok)
- **Használat:** GuaranteesBlock középső kép

---

## 🏢 Ügyfél Logók (14. oldal)

Mindegyik logót külön fájlba kell menteni PNG formátumban fehér vagy átlátszó háttérrel.

**Útvonal:** `/public/logos/clients/`

| # | Cég Név | Fájlnév | Forrás |
|---|---------|---------|--------|
| 1 | Bee Well | `bee-well.png` | PDF 14. oldal, 1. sor bal |
| 2 | Best Lashes Professional | `best-lashes.png` | PDF 14. oldal, 1. sor közép |
| 3 | Biobubi | `biobubi.png` | PDF 14. oldal, 1. sor jobb |
| 4 | bestmarkt | `bestmarkt.png` | PDF 14. oldal, 1. sor jobb |
| 5 | cegespolo.eu | `cegespolo.png` | PDF 14. oldal, 1. sor |
| 6 | Coconutoil Cosmetics | `coconutoil.png` | PDF 14. oldal, 1. sor |
| 7 | DBH InnoHub | `dbh-innohub.png` | PDF 14. oldal, 2. sor bal |
| 8 | Easy Business EY | `easybusiness.png` | PDF 14. oldal, 2. sor |
| 9 | Duna Elektronika (30 years) | `duna-elektronika.png` | PDF 14. oldal, 2. sor |
| 10 | Neverland | `neverland.png` | PDF 14. oldal, 2. sor |
| 11 | PetChef | `petchef.png` | PDF 14. oldal, 2. sor |
| 12 | Menedzser Praxis | `menedzser-praxis.png` | PDF 14. oldal, 2. sor |
| 13 | Plazma Centrum | `plazma-centrum.png` | PDF 14. oldal, 3. sor bal |
| 14 | ProGastro | `progastro.png` | PDF 14. oldal, 3. sor |
| 15 | Pongor Group | `pongor-group.png` | PDF 14. oldal, 3. sor |
| 16 | WP Kurzus | `wp-kurzus.png` | PDF 14. oldal, 3. sor |
| 17 | Zyntern | `zyntern.png` | PDF 14. oldal, 3. sor jobb |

---

## 🤝 Partner Logók (15. oldal)

Kupon stílusú dobozokban látható partnerek logói.

**Útvonal:** `/public/logos/partners/`

| # | Partner Név | Fájlnév | Forrás |
|---|-------------|---------|--------|
| 1 | WP Viking Agency | `wp-viking.png` | PDF 15. oldal, bal felső |
| 2 | Praxis Aweben | `praxis-aweben.png` | PDF 15. oldal, jobb felső |
| 3 | BP Digital | `bp-digital.png` | PDF 15. oldal, jobb felső |
| 4 | Everigo International Group | `everigo.png` | PDF 15. oldal, bal alsó |
| 5 | Sápi Domán | `sapi-doman.png` | PDF 15. oldal, középen/jobb alsó |

---

## 📁 Könyvtárstruktúra

Hozd létre a következő könyvtárakat ha még nem léteznek:

```
proposal-builder/
└── public/
    ├── images/
    │   └── boom/
    │       ├── hero-meeting-bg.jpg
    │       ├── ecosystem-illustration.svg
    │       ├── ecosystem-computer.svg
    │       └── guarantee-shield.svg
    └── logos/
        ├── clients/
        │   ├── bee-well.png
        │   ├── best-lashes.png
        │   ├── biobubi.png
        │   ├── bestmarkt.png
        │   ├── cegespolo.png
        │   ├── coconutoil.png
        │   ├── dbh-innohub.png
        │   ├── easybusiness.png
        │   ├── duna-elektronika.png
        │   ├── neverland.png
        │   ├── petchef.png
        │   ├── menedzser-praxis.png
        │   ├── plazma-centrum.png
        │   ├── progastro.png
        │   ├── pongor-group.png
        │   ├── wp-kurzus.png
        │   └── zyntern.png
        └── partners/
            ├── wp-viking.png
            ├── praxis-aweben.png
            ├── bp-digital.png
            ├── everigo.png
            └── sapi-doman.png
```

---

## 🔧 Képek Kinyerése PDF-ből

### Módszer 1: Adobe Acrobat
1. Nyisd meg a PDF-et Adobe Acrobat-ban
2. Tools → Export PDF → Image → PNG vagy JPEG
3. Mentsd ki az összes képet
4. Válaszd szét és nevezd át őket a fenti lista szerint

### Módszer 2: Online Tool (pl. ilovepdf.com)
1. Menj a https://www.ilovepdf.com/pdf_to_jpg oldalra
2. Töltsd fel a PDF-et
3. Konvertáld képekké
4. Töltsd le és nevezd át a fájlokat

### Módszer 3: macOS Preview
1. Nyisd meg a PDF-et Preview-ban
2. Cmd+Shift+4 képernyőkép eszközzel vágd ki a képeket
3. Vagy: File → Export → PNG

---

## ✅ Ellenőrző lista

Miután feltöltötted a képeket, ellenőrizd:

- [ ] 4 háttérkép/illusztráció az `/public/images/boom/` mappában
- [ ] 17 ügyfél logó a `/public/logos/clients/` mappában
- [ ] 5 partner logó a `/public/logos/partners/` mappában
- [ ] Minden fájlnév kisbetűs és kötőjellel elválasztott (kebab-case)
- [ ] Képek optimalizáltak (nem túl nagy fájlméret)
- [ ] PNG formátum átlátszó háttérrel (logóknál)
- [ ] JPG formátum fotóknál (hero background)

---

## 📝 Megjegyzések

- A sablonok már készen állnak és működnek placeholder képekkel
- Amint feltöltöd a valódi képeket, automatikusan megjelennek az ajánlatokban
- Ha egy kép hiányzik, a böngésző "broken image" ikont fog mutatni
- Az SVG formátum előnyösebb a logóknál (kisebb méret, skálázható), de PNG is jó

---

## 🚀 Következő lépések

1. ✅ Nyisd meg a PDF-et képszerkesztőben
2. ✅ Nyerd ki az összes képet a fenti lista szerint
3. ✅ Nevezd át a fájlokat pontosan a megadott nevekre
4. ✅ Töltsd fel a megfelelő mappákba
5. ✅ Frissítsd az oldalt a böngészőben → Képek megjelennek! 🎉
