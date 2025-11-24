#!/usr/bin/env node

import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });
dotenv.config({ path: join(__dirname, '../.env') });

const { Pool } = pg;

async function checkDatabase(name, connectionString) {
  const pool = new Pool({ connectionString });

  try {
    console.log(`\n📊 Ellenőrzöm: ${name}`);
    console.log('=' + '='.repeat(50));

    // Users
    const users = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`👤 Users: ${users.rows[0].count}`);

    const userList = await pool.query('SELECT email, name, role FROM users LIMIT 5');
    userList.rows.forEach(u => console.log(`   - ${u.email} (${u.name}) [${u.role}]`));

    // Proposals
    const proposals = await pool.query('SELECT COUNT(*) as count FROM proposals');
    console.log(`\n📄 Proposals: ${proposals.rows[0].count}`);

    const propList = await pool.query('SELECT slug, title, status, is_template FROM proposals LIMIT 5');
    propList.rows.forEach(p => console.log(`   - ${p.slug} - ${p.title} [${p.status}] ${p.is_template ? '(TEMPLATE)' : ''}`));

    // Proposal Blocks
    const blocks = await pool.query('SELECT COUNT(*) as count FROM proposal_blocks');
    console.log(`\n📦 Proposal Blocks: ${blocks.rows[0].count}`);

    // Check for templates
    const templates = await pool.query('SELECT COUNT(*) as count FROM proposals WHERE is_template = true');
    console.log(`\n🎨 Templates: ${templates.rows[0].count}`);

    if (templates.rows[0].count > 0) {
      const templateList = await pool.query('SELECT slug, title FROM proposals WHERE is_template = true LIMIT 5');
      templateList.rows.forEach(t => console.log(`   - ${t.slug} - ${t.title}`));
    }

  } catch (error) {
    console.error(`❌ Hiba ${name} ellenőrzésekor:`, error.message);
  } finally {
    await pool.end();
  }
}

async function main() {
  console.log('🔍 Adatbázisok ellenőrzése...\n');

  // 1. Production (Prisma Cloud)
  const prodUrl = process.env.DATABASE_URL;
  if (prodUrl) {
    await checkDatabase('Production (Prisma Cloud)', prodUrl);
  }

  // 2. Local PostgreSQL
  const localUrl = 'postgresql://postgres:postgres@localhost:51214/postgres';
  await checkDatabase('Local PostgreSQL (port 51214)', localUrl);

  // 3. Template1 database
  const template1Url = 'postgresql://postgres:postgres@localhost:51214/template1';
  await checkDatabase('Local Template1 (port 51214)', template1Url);

  // 4. Check .env file for other possible databases
  const envUrl = 'postgresql://admin:password123@localhost:5432/proposals';
  await checkDatabase('Local Dev (port 5432)', envUrl);
}

main();