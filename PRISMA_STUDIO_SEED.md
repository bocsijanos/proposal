# 📝 Prisma Studio Manuális Seed Útmutató

## 1️⃣ Nyisd meg Prisma Studio-t

```bash
npx prisma studio
```

Megnyílik: http://localhost:5555

---

## 2️⃣ User tábla - Admin hozzáadása

Kattints: **User** → **Add record**

Másold be ezeket az értékeket:

```
id: admin-boom-001
email: admin@boommarketing.hu
passwordHash: $2b$10$drOua6VaRUnGziMY3qtQBe/QPahAf41Po45OLMjfV0Qp4TYn2.jHK
name: Boom Admin
role: SUPER_ADMIN
```

**Save 1 change**

---

## 3️⃣ Proposal tábla - Boom Marketing

Kattints: **Proposal** → **Add record**

```
id: proposal-boom-001
slug: boom-marketing-teljes-csomag-2025
clientName: Példa Vállalkozás Kft.
brand: BOOM
status: PUBLISHED
createdById: admin-boom-001
viewCount: 0
publishedAt: (Current timestamp)
```

**Save 1 change**

---

## 4️⃣ ProposalBlock tábla - Boom Blocks (6 db)

Minden blokkhoz: **ProposalBlock** → **Add record**

### Block 1 - Hero
```
id: boom-block-001
proposalId: proposal-boom-001
blockType: HERO
displayOrder: 0
isEnabled: true
content: {"heading":"Marketing Árajánlat 2025","subheading":"Komplex digitális marketing megoldások a sikeres online jelenléthez","ctaText":"Kezdjük el","ctaUrl":"#pricing","alignment":"center"}
```

### Block 2 - Value Prop
```
id: boom-block-002
proposalId: proposal-boom-001
blockType: VALUE_PROP
displayOrder: 1
isEnabled: true
content: {"heading":"Miért érdemes velünk dolgozni?","leftColumn":{"title":"A mi különlegességünk","items":["Transzparens kommunikáció minden lépésnél","Folyamatos optimalizálás és A/B tesztelés","Fix árazás, jutalékmentes együttműködés","Havi részletes riport találkozó","Proaktív stratégiai tanácsadás"]},"rightColumn":{"title":"BOOM Marketing hitvallása","content":"Hiszünk abban, hogy a sikeres marketing őszinte partneri kapcsolaton alapul."}}
```

### Block 3 - Pricing
```
id: boom-block-003
proposalId: proposal-boom-001
blockType: PRICING_TABLE
displayOrder: 2
isEnabled: true
content: {"heading":"Válaszd ki a számodra ideális csomagot","description":"Minden csomag tartalmazza a teljes körű kampánykezelést.","plans":[{"id":"1","name":"Meta PPC","description":"Facebook és Instagram","discountedPrice":169990,"currency":"HUF","billingPeriod":"monthly","features":["Facebook hirdetések","Instagram kampányok"],"ctaText":"Kezdjük el"}]}
```

### Block 4 - Services
```
id: boom-block-004
proposalId: proposal-boom-001
blockType: SERVICES_GRID
displayOrder: 3
isEnabled: true
content: {"heading":"További szolgáltatásaink","columns":3,"services":[{"id":"1","title":"E-mail Marketing","description":"Komplex e-mail kampányok","icon":"📧","price":"450.000 Ft"}]}
```

### Block 5 - Guarantees
```
id: boom-block-005
proposalId: proposal-boom-001
blockType: GUARANTEES
displayOrder: 4
isEnabled: true
content: {"heading":"Garanciáink","leftColumn":["2 munkanapon belüli válasz"],"rightColumn":["Fix árazás"]}
```

### Block 6 - CTA
```
id: boom-block-006
proposalId: proposal-boom-001
blockType: CTA
displayOrder: 5
isEnabled: true
content: {"heading":"Készen állsz a növekedésre?","description":"Foglalj ingyenes konzultációt!","primaryCta":{"text":"Ingyenes Konzultáció","url":"https://boommarketing.hu/kapcsolat"}}
```

---

## 5️⃣ AiBoost Proposal

**Proposal** → **Add record**

```
id: proposal-aiboost-001
slug: aiboost-ai-marketing-csomag-2025
clientName: Tech Startup Zrt.
brand: AIBOOST
status: PUBLISHED
createdById: admin-boom-001
viewCount: 0
publishedAt: (Current timestamp)
```

---

## 6️⃣ AiBoost Blocks (6 db)

### Block 1 - Hero
```
id: aiboost-block-001
proposalId: proposal-aiboost-001
blockType: HERO
displayOrder: 0
isEnabled: true
content: {"heading":"AI-Powered Marketing 2025","subheading":"Mesterséges intelligencia alapú marketing automatizálás","ctaText":"Fedezd fel","ctaUrl":"#features","alignment":"center"}
```

### Block 2 - Platform Features
```
id: aiboost-block-002
proposalId: proposal-aiboost-001
blockType: PLATFORM_FEATURES
displayOrder: 1
isEnabled: true
content: {"heading":"AI Marketing Platform","features":[{"id":"1","icon":"🤖","title":"AI Content Generation","description":"Automatikus tartalomgyártás"}]}
```

### Block 3 - Stats
```
id: aiboost-block-003
proposalId: proposal-aiboost-001
blockType: STATS
displayOrder: 2
isEnabled: true
content: {"heading":"Eredmények","stats":[{"id":"1","value":"350","label":"Aktív Ügyfél","icon":"👥","suffix":"+"}],"columns":4,"backgroundColor":"gradient"}
```

### Block 4 - Pricing
```
id: aiboost-block-004
proposalId: proposal-aiboost-001
blockType: PRICING_TABLE
displayOrder: 3
isEnabled: true
content: {"heading":"AI Marketing Csomagok","plans":[{"id":"1","name":"Starter AI","description":"Kisvállalkozásoknak","discountedPrice":89990,"currency":"HUF","billingPeriod":"monthly","features":["AI content generation"],"ctaText":"Kezdés"}]}
```

### Block 5 - Timeline
```
id: aiboost-block-005
proposalId: proposal-aiboost-001
blockType: PROCESS_TIMELINE
displayOrder: 4
isEnabled: true
content: {"heading":"Hogyan működik?","steps":[{"id":"1","number":1,"title":"Platform Setup","description":"AI modellek betanítása","icon":"⚙️"}]}
```

### Block 6 - CTA
```
id: aiboost-block-006
proposalId: proposal-aiboost-001
blockType: CTA
displayOrder: 5
isEnabled: true
content: {"heading":"Készen állsz az AI forradalomra?","description":"Próbáld ki 14 napig ingyen!","primaryCta":{"text":"Ingyenes Próba","url":"https://aiboost.hu/trial"}}
```

---

## ✅ Kész!

Most már elérhető:
- Login: http://localhost:3000 (admin@boommarketing.hu / admin123)
- Boom: http://localhost:3000/boom-marketing-teljes-csomag-2025
- AiBoost: http://localhost:3000/aiboost-ai-marketing-csomag-2025
