// Direct SQL seed using node-postgres
import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgres://postgres:postgres@localhost:51214/postgres'
});

async function seed() {
  try {
    await client.connect();
    console.log('✅ Csatlakozva az adatbázishoz');

    // 1. Admin user
    await client.query(`
      INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at)
      VALUES (
        'admin-boom-001',
        'admin@boommarketing.hu',
        '$2b$10$drOua6VaRUnGziMY3qtQBe/QPahAf41Po45OLMjfV0Qp4TYn2.jHK',
        'Boom Admin',
        'SUPER_ADMIN',
        NOW(),
        NOW()
      )
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('✅ Admin user létrehozva');

    // 2. Boom Marketing proposal
    await client.query(`
      INSERT INTO proposals (id, slug, client_name, brand, status, created_by_id, view_count, created_at, updated_at, published_at)
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
      ON CONFLICT (slug) DO NOTHING
    `);
    console.log('✅ Boom proposal létrehozva');

    // Boom blocks
    const boomBlocks = [
      ['boom-block-001', 0, 'HERO', '{"heading":"Marketing Árajánlat 2025","subheading":"Komplex digitális marketing megoldások a sikeres online jelenléthez","ctaText":"Kezdjük el","ctaUrl":"#pricing","alignment":"center"}'],
      ['boom-block-002', 1, 'VALUE_PROP', '{"heading":"Miért érdemes velünk dolgozni?","leftColumn":{"title":"A mi különlegességünk","items":["Transzparens kommunikáció minden lépésnél","Folyamatos optimalizálás és A/B tesztelés","Fix árazás, jutalékmentes együttműködés","Havi részletes riport találkozó","Proaktív stratégiai tanácsadás"]},"rightColumn":{"title":"BOOM Marketing hitvallása","content":"Hiszünk abban, hogy a sikeres marketing őszinte partneri kapcsolaton alapul. Nem ígérünk csodaszereket, helyette adatvezérelt döntésekkel és folyamatos optimalizálással érjük el a kimagasló eredményeket."}}'],
      ['boom-block-003', 2, 'PRICING_TABLE', '{"heading":"Válaszd ki a számodra ideális csomagot","description":"Minden csomag tartalmazza a teljes körű kampánykezelést, kreatív gyártást és havi riportolást.","plans":[{"id":"1","name":"Meta PPC","description":"Facebook és Instagram","discountedPrice":169990,"currency":"HUF","billingPeriod":"monthly","features":["Facebook hirdetések","Instagram kampányok","Kreatív gyártás","Havi riport találkozó","Folyamatos optimalizálás"],"ctaText":"Kezdjük el"},{"id":"2","name":"Google + Meta","description":"Kombinált megoldás","originalPrice":305820,"discountedPrice":271660,"currency":"HUF","billingPeriod":"monthly","features":["Minden Meta funkció","Google Ads kezelés","Shopping kampányok","YouTube hirdetések","Cross-platform remarketing"],"isPopular":true,"ctaText":"Legkedveltebb"},{"id":"3","name":"Full Marketing","description":"Teljes körű megoldás","discountedPrice":450000,"currency":"HUF","billingPeriod":"monthly","features":["Minden előző funkció","TikTok hirdetések","E-mail marketing","Landing oldal optimalizálás","Dedikált account manager"],"ctaText":"Egyeztetés"}]}'],
      ['boom-block-004', 3, 'SERVICES_GRID', '{"heading":"További szolgáltatásaink","columns":3,"services":[{"id":"1","title":"E-mail Marketing","description":"Komplex e-mail kampányok automatizálása és optimalizálása","icon":"📧","price":"450.000 Ft + ÁFA"},{"id":"2","title":"Landing Oldal","description":"Konverzióra optimalizált landing oldalak készítése","icon":"🎨","price":"350.000 Ft + ÁFA"},{"id":"3","title":"Tartalomgyártás","description":"SEO optimalizált blogcikkek és social media tartalmak","icon":"✍️","price":"35.000 Ft/cikk + ÁFA"}]}'],
      ['boom-block-005', 4, 'GUARANTEES', '{"heading":"Garanciáink","leftColumn":["2 munkanapon belüli e-mail válaszidő","3 munkanapon belüli reakció módosításokra","4 munkanapon belül kampány változtatások"],"rightColumn":["Fix árazás, nincs rejtett költség","Minimum 3 hónapos együttműködés","Havi részletes riportolás"]}'],
      ['boom-block-006', 5, 'CTA', '{"heading":"Készen állsz a növekedésre?","description":"Foglalj ingyenes konzultációt vagy kérj egyedi ajánlatot!","primaryCta":{"text":"Ingyenes Konzultáció","url":"https://boommarketing.hu/kapcsolat"},"secondaryCta":{"text":"Ajánlat Kérés","url":"mailto:hello@boommarketing.hu"}}'],
    ];

    for (const [id, order, type, content] of boomBlocks) {
      await client.query(`
        INSERT INTO proposal_blocks (id, proposal_id, block_type, display_order, is_enabled, content, created_at, updated_at)
        VALUES ($1, 'proposal-boom-001', $2, $3, true, $4, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `, [id, type, order, content]);
    }
    console.log('✅ Boom blocks létrehozva (6 blokk)');

    // 3. AiBoost proposal
    await client.query(`
      INSERT INTO proposals (id, slug, client_name, brand, status, created_by_id, view_count, created_at, updated_at, published_at)
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
      ON CONFLICT (slug) DO NOTHING
    `);
    console.log('✅ AiBoost proposal létrehozva');

    // AiBoost blocks
    const aiBoostBlocks = [
      ['aiboost-block-001', 0, 'HERO', '{"heading":"AI-Powered Marketing 2025","subheading":"Mesterséges intelligencia alapú marketing automatizálás a jövő vállalatai számára","ctaText":"Fedezd fel","ctaUrl":"#features","alignment":"center"}'],
      ['aiboost-block-002', 1, 'PLATFORM_FEATURES', '{"heading":"AI Marketing Platform Funkciók","description":"Automatizált marketing megoldások gépi tanulással és prediktív analitikával","features":[{"id":"1","icon":"🤖","title":"AI Content Generation","description":"Automatikus tartalomgyártás GPT-4 alapú AI-val. Készíts blogcikkeket, social media posztokat és e-mail kampányokat másodpercek alatt.","benefits":["10x gyorsabb tartalomkészítés","Többnyelvű támogatás","SEO optimalizált szövegek"]},{"id":"2","icon":"📊","title":"Prediktív Analitika","description":"Gépi tanulás alapú előrejelzések a kampány teljesítményről és ROI-ról.","benefits":["Kampány optimalizálás AI-val","Automatikus A/B tesztelés","Real-time teljesítmény előrejelzés"]},{"id":"3","icon":"⚡","title":"Marketing Automation","description":"Komplex marketing folyamatok automatizálása intelligens triggerekkel és személyre szabással.","benefits":["Lead nurturing automatizálás","Személyre szabott customer journey","Multi-channel kampányok"]}]}'],
      ['aiboost-block-003', 2, 'STATS', '{"heading":"AiBoost Platform Eredmények","description":"Ügyfeleink átlagos teljesítménye 6 hónap alatt","stats":[{"id":"1","value":"350","label":"Aktív Ügyfél","icon":"👥","suffix":"+"},{"id":"2","value":"5x","label":"ROI Növekedés","icon":"📈"},{"id":"3","value":"89","label":"Ügyfél Elégedettség","icon":"⭐","suffix":"%"},{"id":"4","value":"24","label":"Support Válaszidő","icon":"⚡","suffix":"h"}],"columns":4,"backgroundColor":"gradient"}'],
      ['aiboost-block-004', 3, 'PRICING_TABLE', '{"heading":"AI Marketing Csomagok","description":"Válaszd ki a vállalatod igényeinek megfelelő AI marketing csomagot","plans":[{"id":"1","name":"Starter AI","description":"Kisvállalkozásoknak","discountedPrice":89990,"currency":"HUF","billingPeriod":"monthly","features":["AI content generation (50/hó)","Prediktív analitika","Email automatizálás","Chat support"],"ctaText":"Kezdés"},{"id":"2","name":"Professional AI","description":"Növekvő cégeknek","originalPrice":199980,"discountedPrice":169990,"currency":"HUF","billingPeriod":"monthly","features":["Minden Starter funkció","AI content (200/hó)","Multi-channel automation","Advanced analytics","Dedikált AI specialist"],"isPopular":true,"ctaText":"Népszerű"},{"id":"3","name":"Enterprise AI","description":"Nagyvállalatok számára","discountedPrice":399990,"currency":"HUF","billingPeriod":"monthly","features":["Korlátlan AI content","Custom AI modellek","White-label platform","24/7 premium support","Egyedi integrációk"],"ctaText":"Kapcsolat"}]}'],
      ['aiboost-block-005', 4, 'PROCESS_TIMELINE', '{"heading":"Hogyan működik az AI Marketing?","description":"4 egyszerű lépésben indítsd el AI-alapú marketing automatizálásodat","steps":[{"id":"1","number":1,"title":"Platform Setup","description":"AI modellek betanítása a vállalatod adataival és márka hangvételével. Integráció meglévő marketing eszközökkel.","icon":"⚙️"},{"id":"2","number":2,"title":"Stratégia Fejlesztés","description":"AI-vezérelt marketing stratégia kidolgozása prediktív analitika alapján. Célközönség szegmentálás és persona építés.","icon":"🎯"},{"id":"3","number":3,"title":"Automatizálás","description":"Marketing folyamatok automatizálása intelligens triggerekkel. AI content generation aktiválása és kampányok indítása.","icon":"🚀"},{"id":"4","number":4,"title":"Optimalizálás","description":"Folyamatos AI-alapú optimalizálás. Real-time teljesítmény monitoring és automatikus kampány finomhangolás.","icon":"📊"}]}'],
      ['aiboost-block-006', 5, 'CTA', '{"heading":"Készen állsz az AI forradalomra?","description":"Próbáld ki az AiBoost platformot 14 napig ingyen!","primaryCta":{"text":"Ingyenes Próba","url":"https://aiboost.hu/trial"},"secondaryCta":{"text":"Demo Kérés","url":"mailto:info@aiboost.hu"}}'],
    ];

    for (const [id, order, type, content] of aiBoostBlocks) {
      await client.query(`
        INSERT INTO proposal_blocks (id, proposal_id, block_type, display_order, is_enabled, content, created_at, updated_at)
        VALUES ($1, 'proposal-aiboost-001', $2, $3, true, $4, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `, [id, type, order, content]);
    }
    console.log('✅ AiBoost blocks létrehozva (6 blokk)');

    console.log('\n🎉 SEED SIKERES!');
    console.log('\n📋 Belépési adatok:');
    console.log('   Email: admin@boommarketing.hu');
    console.log('   Jelszó: admin123');
    console.log('\n🔗 Minta árajánlatok:');
    console.log('   Boom: http://localhost:3000/boom-marketing-teljes-csomag-2025');
    console.log('   AiBoost: http://localhost:3000/aiboost-ai-marketing-csomag-2025');
    console.log('\n✅ Indítsd el: npm run dev\n');

  } catch (error) {
    console.error('❌ Hiba:', error);
  } finally {
    await client.end();
  }
}

seed();
