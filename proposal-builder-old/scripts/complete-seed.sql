-- Teljes seed: Admin user + 2 minta árajánlat (Boom + AiBoost)
-- Futtasd: cat scripts/complete-seed.sql | psql postgres://postgres:postgres@localhost:51214/template1

-- 1. Admin user létrehozása
INSERT INTO "User" (id, email, "passwordHash", name, role, "createdAt", "updatedAt")
VALUES (
  'admin-boom-001',
  'admin@boommarketing.hu',
  '$2b$10$drOua6VaRUnGziMY3qtQBe/QPahAf41Po45OLMjfV0Qp4TYn2.jHK',
  'Boom Admin',
  'SUPER_ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- 2. BOOM Marketing minta árajánlat
INSERT INTO "Proposal" (id, slug, "clientName", brand, status, "createdById", "viewCount", "createdAt", "updatedAt", "publishedAt")
VALUES (
  'proposal-boom-001',
  'boom-marketing-teljes-csomag-2025',
  'Példa Vállalkozás Kft.',
  'BOOM',
  'PUBLISHED',
  'admin-boom-001',
  0,
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- BOOM - Hero Block
INSERT INTO "ProposalBlock" (id, "proposalId", "blockType", "displayOrder", "isEnabled", content, "createdAt", "updatedAt")
VALUES (
  'boom-block-001',
  'proposal-boom-001',
  'HERO',
  0,
  true,
  '{"heading":"Marketing Árajánlat 2025","subheading":"Komplex digitális marketing megoldások a sikeres online jelenléthez","ctaText":"Kezdjük el","ctaUrl":"#pricing","alignment":"center"}',
  NOW(),
  NOW()
);

-- BOOM - Value Prop Block
INSERT INTO "ProposalBlock" (id, "proposalId", "blockType", "displayOrder", "isEnabled", content, "createdAt", "updatedAt")
VALUES (
  'boom-block-002',
  'proposal-boom-001',
  'VALUE_PROP',
  1,
  true,
  '{"heading":"Miért érdemes velünk dolgozni?","leftColumn":{"title":"A mi különlegességünk","items":["Transzparens kommunikáció minden lépésnél","Folyamatos optimalizálás és A/B tesztelés","Fix árazás, jutalékmentes együttműködés","Havi részletes riport találkozó","Proaktív stratégiai tanácsadás"]},"rightColumn":{"title":"BOOM Marketing hitvallása","content":"Hiszünk abban, hogy a sikeres marketing őszinte partneri kapcsolaton alapul. Nem ígérünk csodaszereket, helyette adatvezérelt döntésekkel és folyamatos optimalizálással érjük el a kimagasló eredményeket."}}',
  NOW(),
  NOW()
);

-- BOOM - Pricing Block
INSERT INTO "ProposalBlock" (id, "proposalId", "blockType", "displayOrder", "isEnabled", content, "createdAt", "updatedAt")
VALUES (
  'boom-block-003',
  'proposal-boom-001',
  'PRICING_TABLE',
  2,
  true,
  '{"heading":"Válaszd ki a számodra ideális csomagot","description":"Minden csomag tartalmazza a teljes körű kampánykezelést, kreatív gyártást és havi riportolást.","plans":[{"id":"1","name":"Meta PPC","description":"Facebook és Instagram","discountedPrice":169990,"currency":"HUF","billingPeriod":"monthly","features":["Facebook hirdetések","Instagram kampányok","Kreatív gyártás","Havi riport találkozó","Folyamatos optimalizálás"],"ctaText":"Kezdjük el"},{"id":"2","name":"Google + Meta","description":"Kombinált megoldás","originalPrice":305820,"discountedPrice":271660,"currency":"HUF","billingPeriod":"monthly","features":["Minden Meta funkció","Google Ads kezelés","Shopping kampányok","YouTube hirdetések","Cross-platform remarketing"],"isPopular":true,"ctaText":"Legkedveltebb"},{"id":"3","name":"Full Marketing","description":"Teljes körű megoldás","discountedPrice":450000,"currency":"HUF","billingPeriod":"monthly","features":["Minden előző funkció","TikTok hirdetések","E-mail marketing","Landing oldal optimalizálás","Dedikált account manager"],"ctaText":"Egyeztetés"}]}',
  NOW(),
  NOW()
);

-- BOOM - Services Grid
INSERT INTO "ProposalBlock" (id, "proposalId", "blockType", "displayOrder", "isEnabled", content, "createdAt", "updatedAt")
VALUES (
  'boom-block-004',
  'proposal-boom-001',
  'SERVICES_GRID',
  3,
  true,
  '{"heading":"További szolgáltatásaink","columns":3,"services":[{"id":"1","title":"E-mail Marketing","description":"Komplex e-mail kampányok automatizálása és optimalizálása","icon":"📧","price":"450.000 Ft + ÁFA"},{"id":"2","title":"Landing Oldal","description":"Konverzióra optimalizált landing oldalak készítése","icon":"🎨","price":"350.000 Ft + ÁFA"},{"id":"3","title":"Tartalomgyártás","description":"SEO optimalizált blogcikkek és social media tartalmak","icon":"✍️","price":"35.000 Ft/cikk + ÁFA"}]}',
  NOW(),
  NOW()
);

-- BOOM - Guarantees
INSERT INTO "ProposalBlock" (id, "proposalId", "blockType", "displayOrder", "isEnabled", content, "createdAt", "updatedAt")
VALUES (
  'boom-block-005',
  'proposal-boom-001',
  'GUARANTEES',
  4,
  true,
  '{"heading":"Garanciáink","leftColumn":["2 munkanapon belüli e-mail válaszidő","3 munkanapon belüli reakció módosításokra","4 munkanapon belül kampány változtatások"],"rightColumn":["Fix árazás, nincs rejtett költség","Minimum 3 hónapos együttműködés","Havi részletes riportolás"]}',
  NOW(),
  NOW()
);

-- BOOM - CTA Block
INSERT INTO "ProposalBlock" (id, "proposalId", "blockType", "displayOrder", "isEnabled", content, "createdAt", "updatedAt")
VALUES (
  'boom-block-006',
  'proposal-boom-001',
  'CTA',
  5,
  true,
  '{"heading":"Készen állsz a növekedésre?","description":"Foglalj ingyenes konzultációt vagy kérj egyedi ajánlatot!","primaryCta":{"text":"Ingyenes Konzultáció","url":"https://boommarketing.hu/kapcsolat"},"secondaryCta":{"text":"Ajánlat Kérés","url":"mailto:hello@boommarketing.hu"}}',
  NOW(),
  NOW()
);

-- 3. AIBOOST minta árajánlat
INSERT INTO "Proposal" (id, slug, "clientName", brand, status, "createdById", "viewCount", "createdAt", "updatedAt", "publishedAt")
VALUES (
  'proposal-aiboost-001',
  'aiboost-ai-marketing-csomag-2025',
  'Tech Startup Zrt.',
  'AIBOOST',
  'PUBLISHED',
  'admin-boom-001',
  0,
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- AIBOOST - Hero Block
INSERT INTO "ProposalBlock" (id, "proposalId", "blockType", "displayOrder", "isEnabled", content, "createdAt", "updatedAt")
VALUES (
  'aiboost-block-001',
  'proposal-aiboost-001',
  'HERO',
  0,
  true,
  '{"heading":"AI-Powered Marketing 2025","subheading":"Mesterséges intelligencia alapú marketing automatizálás a jövő vállalatai számára","ctaText":"Fedezd fel","ctaUrl":"#features","alignment":"center"}',
  NOW(),
  NOW()
);

-- AIBOOST - Platform Features
INSERT INTO "ProposalBlock" (id, "proposalId", "blockType", "displayOrder", "isEnabled", content, "createdAt", "updatedAt")
VALUES (
  'aiboost-block-002',
  'proposal-aiboost-001',
  'PLATFORM_FEATURES',
  1,
  true,
  '{"heading":"AI Marketing Platform Funkciók","description":"Automatizált marketing megoldások gépi tanulással és prediktív analitikával","features":[{"id":"1","icon":"🤖","title":"AI Content Generation","description":"Automatikus tartalomgyártás GPT-4 alapú AI-val. Készíts blogcikkeket, social media posztokat és e-mail kampányokat másodpercek alatt.","benefits":["10x gyorsabb tartalomkészítés","Többnyelvű támogatás","SEO optimalizált szövegek"]},{"id":"2","icon":"📊","title":"Prediktív Analitika","description":"Gépi tanulás alapú előrejelzések a kampány teljesítményről és ROI-ról.","benefits":["Kampány optimalizálás AI-val","Automatikus A/B tesztelés","Real-time teljesítmény előrejelzés"]},{"id":"3","icon":"⚡","title":"Marketing Automation","description":"Komplex marketing folyamatok automatizálása intelligens triggerekkel és személyre szabással.","benefits":["Lead nurturing automatizálás","Személyre szabott customer journey","Multi-channel kampányok"]}]}',
  NOW(),
  NOW()
);

-- AIBOOST - Stats Block
INSERT INTO "ProposalBlock" (id, "proposalId", "blockType", "displayOrder", "isEnabled", content, "createdAt", "updatedAt")
VALUES (
  'aiboost-block-003',
  'proposal-aiboost-001',
  'STATS',
  2,
  true,
  '{"heading":"AiBoost Platform Eredmények","description":"Ügyfeleink átlagos teljesítménye 6 hónap alatt","stats":[{"id":"1","value":"350","label":"Aktív Ügyfél","icon":"👥","suffix":"+"},{"id":"2","value":"5x","label":"ROI Növekedés","icon":"📈"},{"id":"3","value":"89","label":"Ügyfél Elégedettség","icon":"⭐","suffix":"%"},{"id":"4","value":"24","label":"Support Válaszidő","icon":"⚡","suffix":"h"}],"columns":4,"backgroundColor":"gradient"}',
  NOW(),
  NOW()
);

-- AIBOOST - Pricing Table
INSERT INTO "ProposalBlock" (id, "proposalId", "blockType", "displayOrder", "isEnabled", content, "createdAt", "updatedAt")
VALUES (
  'aiboost-block-004',
  'proposal-aiboost-001',
  'PRICING_TABLE',
  3,
  true,
  '{"heading":"AI Marketing Csomagok","description":"Válaszd ki a vállalatod igényeinek megfelelő AI marketing csomagot","plans":[{"id":"1","name":"Starter AI","description":"Kisvállalkozásoknak","discountedPrice":89990,"currency":"HUF","billingPeriod":"monthly","features":["AI content generation (50/hó)","Prediktív analitika","Email automatizálás","Chat support"],"ctaText":"Kezdés"},{"id":"2","name":"Professional AI","description":"Növekvő cégeknek","originalPrice":199980,"discountedPrice":169990,"currency":"HUF","billingPeriod":"monthly","features":["Minden Starter funkció","AI content (200/hó)","Multi-channel automation","Advanced analytics","Dedikált AI specialist"],"isPopular":true,"ctaText":"Népszerű"},{"id":"3","name":"Enterprise AI","description":"Nagyvállalatok számára","discountedPrice":399990,"currency":"HUF","billingPeriod":"monthly","features":["Korlátlan AI content","Custom AI modellek","White-label platform","24/7 premium support","Egyedi integr ációk"],"ctaText":"Kapcsolat"}]}',
  NOW(),
  NOW()
);

-- AIBOOST - Process Timeline
INSERT INTO "ProposalBlock" (id, "proposalId", "blockType", "displayOrder", "isEnabled", content, "createdAt", "updatedAt")
VALUES (
  'aiboost-block-005',
  'proposal-aiboost-001',
  'PROCESS_TIMELINE',
  4,
  true,
  '{"heading":"Hogyan működik az AI Marketing?","description":"4 egyszerű lépésben indítsd el AI-alapú marketing automatizálásodat","steps":[{"id":"1","number":1,"title":"Platform Setup","description":"AI modellek betanítása a vállalatod adataival és márka hangvételével. Integráció meglévő marketing eszközökkel.","icon":"⚙️"},{"id":"2","number":2,"title":"Stratégia Fejlesztés","description":"AI-vezérelt marketing stratégia kidolgozása prediktív analitika alapján. Célközönség szegmentálás és persona építés.","icon":"🎯"},{"id":"3","number":3,"title":"Automatizálás","description":"Marketing folyamatok automatizálása intelligens triggerekkel. AI content generation aktiválása és kampányok indítása.","icon":"🚀"},{"id":"4","number":4,"title":"Optimalizálás","description":"Folyamatos AI-alapú optimalizálás. Real-time teljesítmény monitoring és automatikus kampány finomhangolás.","icon":"📊"}]}',
  NOW(),
  NOW()
);

-- AIBOOST - CTA Block
INSERT INTO "ProposalBlock" (id, "proposalId", "blockType", "displayOrder", "isEnabled", content, "createdAt", "updatedAt")
VALUES (
  'aiboost-block-006',
  'proposal-aiboost-001',
  'CTA',
  5,
  true,
  '{"heading":"Készen állsz az AI forradalomra?","description":"Próbáld ki az AiBoost platformot 14 napig ingyen!","primaryCta":{"text":"Ingyenes Próba","url":"https://aiboost.hu/trial"},"secondaryCta":{"text":"Demo Kérés","url":"mailto:info@aiboost.hu"}}',
  NOW(),
  NOW()
);

-- Sikeres seed jelzés
SELECT 'SEED COMPLETE! ✅' as message;
SELECT 'Admin user: admin@boommarketing.hu / admin123' as login;
SELECT 'Boom proposal: http://localhost:3000/boom-marketing-teljes-csomag-2025' as boom_url;
SELECT 'AiBoost proposal: http://localhost:3000/aiboost-ai-marketing-csomag-2025' as aiboost_url;
