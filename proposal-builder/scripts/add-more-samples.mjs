#!/usr/bin/env node

import pg from 'pg';
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

async function addMoreSamples() {
  try {
    console.log('🌱 További sablonok és árajánlatok hozzáadása...\n');

    // Get admin user
    const adminResult = await pool.query(`
      SELECT id FROM users WHERE email = 'admin@boommarketing.hu' LIMIT 1
    `);

    if (adminResult.rows.length === 0) {
      console.error('❌ Admin user nem található');
      return;
    }

    const adminId = adminResult.rows[0].id;

    // 1. Sablon: Modern Marketing Csomag
    console.log('📄 Modern Marketing sablon létrehozása...');

    await pool.query(`DELETE FROM proposals WHERE slug = $1`, ['template-modern-marketing']);

    const template1 = await pool.query(`
      INSERT INTO proposals (
        id, title, slug, client_name, status, is_template, template_name,
        total_amount, currency, created_at, updated_at, user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), $10)
      RETURNING id
    `, [
      'template-001',
      'Modern Marketing Sablon',
      'template-modern-marketing',
      'Sablon Ügyfél',
      'DRAFT',
      true,
      'Modern Marketing Csomag',
      500000,
      'HUF',
      adminId
    ]);

    // Add blocks to template
    await pool.query(`
      INSERT INTO proposal_blocks (
        proposal_id, type, title, content, position, is_enabled, metadata
      )
      VALUES
      ($1, 'HERO', 'Modern Marketing Megoldások', 'Átfogó digitális marketing szolgáltatások', 0, true, '{}'),
      ($1, 'SERVICES', 'Szolgáltatásaink', 'Teljes körű marketing támogatás', 1, true, '{}'),
      ($1, 'PRICING', 'Áraink', 'Rugalmas árazási csomagok', 2, true, '{}')
    `, [template1.rows[0].id]);

    // 2. Sablon: Startup Csomag
    console.log('📄 Startup sablon létrehozása...');

    await pool.query(`DELETE FROM proposals WHERE slug = $1`, ['template-startup-package']);

    const template2 = await pool.query(`
      INSERT INTO proposals (
        id, title, slug, client_name, status, is_template, template_name,
        total_amount, currency, created_at, updated_at, user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), $10)
      RETURNING id
    `, [
      'template-002',
      'Startup Marketing Sablon',
      'template-startup-package',
      'Startup Kft.',
      'DRAFT',
      true,
      'Startup Növekedési Csomag',
      250000,
      'HUF',
      adminId
    ]);

    await pool.query(`
      INSERT INTO proposal_blocks (
        proposal_id, type, title, content, position, is_enabled, metadata
      )
      VALUES
      ($1, 'HERO', 'Startup Növekedés', 'Gyors növekedés startupoknak', 0, true, '{}'),
      ($1, 'OVERVIEW', 'Miért mi?', 'Startup specialisták vagyunk', 1, true, '{}'),
      ($1, 'PRICING', 'Startup Árazás', 'Kedvező árak kezdő vállalkozásoknak', 2, true, '{}')
    `, [template2.rows[0].id]);

    // 3. További árajánlat
    console.log('📄 Tech Solutions árajánlat létrehozása...');

    await pool.query(`DELETE FROM proposals WHERE slug = $1`, ['tech-solutions-2025']);

    const proposal1 = await pool.query(`
      INSERT INTO proposals (
        id, title, slug, client_name, client_email, company_name,
        status, total_amount, currency, created_at, updated_at, user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), $10)
      RETURNING id
    `, [
      'proposal-tech-001',
      'Tech Marketing Csomag 2025',
      'tech-solutions-2025',
      'Tech Solutions Zrt.',
      'info@techsolutions.hu',
      'Tech Solutions Zrt.',
      'VIEWED',
      1200000,
      'HUF',
      adminId
    ]);

    await pool.query(`
      INSERT INTO proposal_blocks (
        proposal_id, type, title, content, position, is_enabled, metadata
      )
      VALUES
      ($1, 'HERO', 'Tech Marketing Excellence', 'B2B marketing megoldások', 0, true, '{}'),
      ($1, 'SERVICES', 'Tech Szolgáltatások', 'Specializált tech marketing', 1, true, '{}'),
      ($1, 'TESTIMONIALS', 'Referenciáink', 'Sikeres tech projektek', 2, true, '{}'),
      ($1, 'PRICING', 'Enterprise Árazás', 'Nagyvállalati csomagok', 3, true, '{}')
    `, [proposal1.rows[0].id]);

    console.log('\n✅ Sikeres! Az alábbiak lettek hozzáadva:');
    console.log('🎨 Sablonok:');
    console.log('   - template-modern-marketing');
    console.log('   - template-startup-package');
    console.log('📄 Árajánlatok:');
    console.log('   - tech-solutions-2025');

    // Summary
    const summary = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM proposals) as proposals,
        (SELECT COUNT(*) FROM proposals WHERE is_template = true) as templates,
        (SELECT COUNT(*) FROM proposal_blocks) as blocks
    `);

    const s = summary.rows[0];
    console.log('\n📊 Összesítés:');
    console.log(`   👤 Users: ${s.users}`);
    console.log(`   📄 Proposals: ${s.proposals}`);
    console.log(`   🎨 Templates: ${s.templates}`);
    console.log(`   📦 Blocks: ${s.blocks}`);

  } catch (error) {
    console.error('❌ Hiba:', error);
  } finally {
  }
}

addMoreSamples();