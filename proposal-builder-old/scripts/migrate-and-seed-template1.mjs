#!/usr/bin/env node

import { Client } from 'pg';
import bcrypt from 'bcryptjs';

const client = new Client({
  connectionString: 'postgres://postgres:postgres@127.0.0.1:51214/template1?sslmode=disable',
});

async function migrate() {
  try {
    await client.connect();
    console.log('✅ Kapcsolódva a template1 adatbázishoz');

    // 1. Drop existing tables
    console.log('\n📦 Táblák törlése...');
    await client.query(`
      DROP TABLE IF EXISTS proposal_blocks CASCADE;
      DROP TABLE IF EXISTS proposal_versions CASCADE;
      DROP TABLE IF EXISTS proposals CASCADE;
      DROP TABLE IF EXISTS sessions CASCADE;
      DROP TABLE IF EXISTS accounts CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS block_templates CASCADE;
    `);

    // 2. Create tables with NEW schema
    console.log('\n📋 Új táblák létrehozása...');

    // Users table
    await client.query(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'ADMIN',
        is_active BOOLEAN DEFAULT true,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Proposals table with NEW fields
    await client.query(`
      CREATE TABLE proposals (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        slug TEXT UNIQUE NOT NULL,
        title TEXT,
        client_name TEXT NOT NULL,
        client_contact_name TEXT,
        client_phone TEXT,
        client_email TEXT,
        company_name TEXT,
        brand TEXT NOT NULL DEFAULT 'BOOM',
        status TEXT DEFAULT 'DRAFT',
        total_amount FLOAT,
        currency TEXT DEFAULT 'HUF',
        template_name TEXT,
        view_count INT DEFAULT 0,
        last_viewed_at TIMESTAMP,
        is_template BOOLEAN DEFAULT false,
        cloned_from_id TEXT,
        created_by_id TEXT NOT NULL,
        created_by_name TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        published_at TIMESTAMP,
        FOREIGN KEY (created_by_id) REFERENCES users(id)
      );
    `);

    // Proposal blocks
    await client.query(`
      CREATE TABLE proposal_blocks (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        proposal_id TEXT NOT NULL,
        block_type TEXT NOT NULL,
        display_order INT DEFAULT 0,
        is_enabled BOOLEAN DEFAULT true,
        content JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE
      );
    `);

    // Block templates
    await client.query(`
      CREATE TABLE block_templates (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        block_type TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        default_content JSONB,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        brand TEXT DEFAULT 'BOOM',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 3. Insert sample data
    console.log('\n📝 Minta adatok beszúrása...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await client.query(`
      INSERT INTO users (email, password_hash, name, role, is_active)
      VALUES ($1, $2, $3, $4, $5)
    `, ['admin@boommarketing.hu', adminPassword, 'Admin User', 'ADMIN', true]);

    // Get admin user ID
    const adminResult = await client.query('SELECT id FROM users WHERE email = $1', ['admin@boommarketing.hu']);
    const adminId = adminResult.rows[0].id;

    // Create sample proposals with new fields
    const proposals = [
      {
        slug: 'boom-marketing-teljes-csomag-2025',
        title: 'BOOM Marketing - Teljes körű marketing megoldás 2025',
        client_name: 'Példa Ügyfél Kft.',
        company_name: 'Példa Ügyfél Kft.',
        client_email: 'pelda@example.com',
        brand: 'BOOM',
        status: 'DRAFT',
        total_amount: 500000,
        currency: 'HUF'
      },
      {
        slug: 'aiboost-ai-csomag-2025',
        title: 'AIBoost - AI megoldások csomag 2025',
        client_name: 'Tech Startup Zrt.',
        company_name: 'Tech Startup Zrt.',
        client_email: 'tech@example.com',
        brand: 'AIBOOST',
        status: 'PUBLISHED',
        total_amount: 750000,
        currency: 'HUF'
      },
      {
        slug: 'template-boom-alap',
        title: 'BOOM Alapcsomag sablon',
        client_name: 'Sablon',
        company_name: 'Sablon',
        brand: 'BOOM',
        status: 'DRAFT',
        is_template: true,
        template_name: 'BOOM Alapcsomag'
      }
    ];

    for (const proposal of proposals) {
      await client.query(`
        INSERT INTO proposals (
          slug, title, client_name, company_name, client_email,
          brand, status, total_amount, currency, is_template,
          template_name, created_by_id, created_by_name
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [
        proposal.slug,
        proposal.title,
        proposal.client_name,
        proposal.company_name,
        proposal.client_email || null,
        proposal.brand,
        proposal.status,
        proposal.total_amount || null,
        proposal.currency || 'HUF',
        proposal.is_template || false,
        proposal.template_name || null,
        adminId,
        'Admin User'
      ]);
    }

    // Add some blocks to the first proposal
    const proposalResult = await client.query('SELECT id FROM proposals WHERE slug = $1', ['boom-marketing-teljes-csomag-2025']);
    const proposalId = proposalResult.rows[0].id;

    await client.query(`
      INSERT INTO proposal_blocks (proposal_id, block_type, display_order, content)
      VALUES
        ($1, 'HERO', 0, '{"heading": "Növeld vállalkozásod online jelenlétét", "subheading": "Professzionális marketing megoldások"}'),
        ($1, 'SERVICES_GRID', 1, '{"heading": "Szolgáltatásaink", "services": []}'),
        ($1, 'PRICING_TABLE', 2, '{"heading": "Csomagjaink", "plans": []}')
    `, [proposalId]);

    console.log('\n✅ Migráció és seed sikeres!');

    // Show summary
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    const proposalCount = await client.query('SELECT COUNT(*) FROM proposals');
    const blockCount = await client.query('SELECT COUNT(*) FROM proposal_blocks');

    console.log('\n📊 Összegzés:');
    console.log(`  - Users: ${userCount.rows[0].count}`);
    console.log(`  - Proposals: ${proposalCount.rows[0].count}`);
    console.log(`  - Blocks: ${blockCount.rows[0].count}`);

  } catch (error) {
    console.error('❌ Hiba:', error);
  } finally {
    await client.end();
  }
}

migrate();