#!/usr/bin/env node

import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedProduction() {
  try {
    console.log('🌱 Feltöltöm a minta adatokat a production adatbázisba...');

    // 1. Admin user létrehozása (ha még nincs)
    console.log('👤 Admin user létrehozása...');
    const passwordHash = await bcrypt.hash('admin123', 10);

    const adminResult = await pool.query(`
      INSERT INTO users (id, email, password_hash, name, role, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `, ['admin-boom-001', 'admin@boommarketing.hu', passwordHash, 'Boom Admin', 'SUPER_ADMIN', true]);

    const adminId = adminResult.rows[0].id;
    console.log('✅ Admin user létrehozva vagy frissítve');

    // 2. BOOM Marketing minta árajánlat
    console.log('📄 BOOM Marketing árajánlat létrehozása...');

    // Először töröljük a meglévőt ha van
    await pool.query(`DELETE FROM proposals WHERE slug = $1`, ['boom-marketing-teljes-csomag-2025']);

    const proposalResult = await pool.query(`
      INSERT INTO proposals (
        id, title, slug, client_name, client_email, company_name,
        status, total_amount, currency, notes, is_template,
        created_at, updated_at, user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW(), $12)
      RETURNING id
    `, [
      'proposal-boom-001',
      'Marketing Árajánlat 2025',
      'boom-marketing-teljes-csomag-2025',
      'Példa Vállalkozás Kft.',
      'pelda@vallalkozas.hu',
      'Példa Vállalkozás Kft.',
      'SENT',
      891650,
      'HUF',
      'Komplex digitális marketing megoldások',
      false,
      adminId
    ]);

    const proposalId = proposalResult.rows[0].id;
    console.log('✅ Árajánlat létrehozva');

    // 3. ProposalBlock-ok létrehozása
    console.log('📦 Árajánlat blokkok létrehozása...');

    // Hero Block
    await pool.query(`
      INSERT INTO proposal_blocks (
        proposal_id, type, title, content, position, is_enabled, metadata,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    `, [
      proposalId,
      'HERO',
      'Marketing Árajánlat 2025',
      'Komplex digitális marketing megoldások a sikeres online jelenléthez',
      0,
      true,
      JSON.stringify({
        heading: 'Marketing Árajánlat 2025',
        subheading: 'Komplex digitális marketing megoldások a sikeres online jelenléthez',
        ctaText: 'Kezdjük el',
        ctaUrl: '#pricing',
        alignment: 'center'
      })
    ]);

    // Overview Block
    await pool.query(`
      INSERT INTO proposal_blocks (
        proposal_id, type, title, content, position, is_enabled, metadata,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    `, [
      proposalId,
      'OVERVIEW',
      'Miért érdemes velünk dolgozni?',
      'Hiszünk abban, hogy a sikeres marketing őszinte partneri kapcsolaton alapul.',
      1,
      true,
      JSON.stringify({
        heading: 'Miért érdemes velünk dolgozni?',
        leftColumn: {
          title: 'A mi különlegességünk',
          items: [
            'Transzparens kommunikáció minden lépésnél',
            'Folyamatos optimalizálás és A/B tesztelés',
            'Fix árazás, jutalékmentes együttműködés',
            'Havi részletes riport találkozó',
            'Proaktív stratégiai tanácsadás'
          ]
        },
        rightColumn: {
          title: 'BOOM Marketing hitvallása',
          content: 'Hiszünk abban, hogy a sikeres marketing őszinte partneri kapcsolaton alapul. Nem ígérünk csodaszereket, helyette adatvezérelt döntésekkel és folyamatos optimalizálással érjük el a kimagasló eredményeket.'
        }
      })
    ]);

    // Services Block
    await pool.query(`
      INSERT INTO proposal_blocks (
        proposal_id, type, title, content, position, is_enabled, metadata,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    `, [
      proposalId,
      'SERVICES',
      'További szolgáltatásaink',
      'Átfogó marketing megoldások egy helyről',
      2,
      true,
      JSON.stringify({
        heading: 'További szolgáltatásaink',
        columns: 3,
        services: [
          {
            id: '1',
            title: 'E-mail Marketing',
            description: 'Komplex e-mail kampányok automatizálása és optimalizálása',
            icon: '📧',
            price: '450.000 Ft + ÁFA'
          },
          {
            id: '2',
            title: 'Landing Oldal',
            description: 'Konverzióra optimalizált landing oldalak készítése',
            icon: '🎨',
            price: '350.000 Ft + ÁFA'
          },
          {
            id: '3',
            title: 'Tartalomgyártás',
            description: 'SEO optimalizált blogcikkek és social media tartalmak',
            icon: '✍️',
            price: '35.000 Ft/cikk + ÁFA'
          }
        ]
      })
    ]);

    // Pricing Block
    await pool.query(`
      INSERT INTO proposal_blocks (
        proposal_id, type, title, content, position, is_enabled, metadata,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    `, [
      proposalId,
      'PRICING',
      'Válaszd ki a számodra ideális csomagot',
      'Minden csomag tartalmazza a teljes körű kampánykezelést',
      3,
      true,
      JSON.stringify({
        heading: 'Válaszd ki a számodra ideális csomagot',
        description: 'Minden csomag tartalmazza a teljes körű kampánykezelést, kreatív gyártást és havi riportolást.',
        plans: [
          {
            id: '1',
            name: 'Meta PPC',
            description: 'Facebook és Instagram',
            discountedPrice: 169990,
            currency: 'HUF',
            billingPeriod: 'monthly',
            features: [
              'Facebook hirdetések',
              'Instagram kampányok',
              'Kreatív gyártás',
              'Havi riport találkozó',
              'Folyamatos optimalizálás'
            ],
            ctaText: 'Kezdjük el'
          },
          {
            id: '2',
            name: 'Google + Meta',
            description: 'Kombinált megoldás',
            originalPrice: 305820,
            discountedPrice: 271660,
            currency: 'HUF',
            billingPeriod: 'monthly',
            features: [
              'Minden Meta funkció',
              'Google Ads kezelés',
              'Shopping kampányok',
              'YouTube hirdetések',
              'Cross-platform remarketing'
            ],
            isPopular: true,
            ctaText: 'Legkedveltebb'
          },
          {
            id: '3',
            name: 'Full Marketing',
            description: 'Teljes körű megoldás',
            discountedPrice: 450000,
            currency: 'HUF',
            billingPeriod: 'monthly',
            features: [
              'Minden előző funkció',
              'TikTok hirdetések',
              'E-mail marketing',
              'Landing oldal optimalizálás',
              'Dedikált account manager'
            ],
            ctaText: 'Egyeztetés'
          }
        ]
      })
    ]);

    // CTA Block
    await pool.query(`
      INSERT INTO proposal_blocks (
        proposal_id, type, title, content, position, is_enabled, metadata,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    `, [
      proposalId,
      'CTA',
      'Készen állsz a növekedésre?',
      'Foglalj ingyenes konzultációt vagy kérj egyedi ajánlatot!',
      4,
      true,
      JSON.stringify({
        heading: 'Készen állsz a növekedésre?',
        description: 'Foglalj ingyenes konzultációt vagy kérj egyedi ajánlatot!',
        primaryCta: {
          text: 'Ingyenes Konzultáció',
          url: 'https://boommarketing.hu/kapcsolat'
        },
        secondaryCta: {
          text: 'Ajánlat Kérés',
          url: 'mailto:hello@boommarketing.hu'
        }
      })
    ]);

    console.log('✅ Minden blokk létrehozva');

    // 4. Második minta árajánlat (AiBoost)
    console.log('📄 AiBoost árajánlat létrehozása...');

    await pool.query(`DELETE FROM proposals WHERE slug = $1`, ['aiboost-seo-csomag-2025']);

    const aiboostProposalResult = await pool.query(`
      INSERT INTO proposals (
        id, title, slug, client_name, client_email, company_name,
        status, total_amount, currency, notes, is_template,
        created_at, updated_at, user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW(), $12)
      RETURNING id
    `, [
      'proposal-aiboost-001',
      'SEO és AI Marketing Csomag',
      'aiboost-seo-csomag-2025',
      'Tech Startup Kft.',
      'info@techstartup.hu',
      'Tech Startup Kft.',
      'DRAFT',
      750000,
      'HUF',
      'AI-vezérelt SEO és tartalommarketing megoldások',
      false,
      adminId
    ]);

    const aiboostProposalId = aiboostProposalResult.rows[0].id;

    // AiBoost Hero Block
    await pool.query(`
      INSERT INTO proposal_blocks (
        proposal_id, type, title, content, position, is_enabled, metadata,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    `, [
      aiboostProposalId,
      'HERO',
      'AI-Vezérelt SEO Megoldások',
      'Növeld organikus forgalmad 300%-kal mesterséges intelligencia segítségével',
      0,
      true,
      JSON.stringify({
        heading: 'AI-Vezérelt SEO Megoldások',
        subheading: 'Növeld organikus forgalmad 300%-kal mesterséges intelligencia segítségével',
        ctaText: 'Részletek',
        ctaUrl: '#services',
        alignment: 'left'
      })
    ]);

    console.log('✅ AiBoost árajánlat és blokkok létrehozva');

    console.log('\n🎉 Sikeres seed! A következő adatok lettek feltöltve:');
    console.log('📧 Admin user: admin@boommarketing.hu / admin123');
    console.log('📄 BOOM árajánlat: https://proposal-91m6.vercel.app/boom-marketing-teljes-csomag-2025');
    console.log('📄 AiBoost árajánlat: https://proposal-91m6.vercel.app/aiboost-seo-csomag-2025');

  } catch (error) {
    console.error('❌ Hiba történt:', error);
    process.exit(1);
  } finally {
  }
}

seedProduction();