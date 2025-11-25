#!/usr/bin/env node

import pg from 'pg';

const { Pool } = pg;

async function checkLocalDb() {
  const pool = new Pool({
    connectionString: 'postgres://postgres:postgres@127.0.0.1:51214/template1?sslmode=disable',
  });

  try {
    console.log('🔍 Ellenőrzöm a lokális adatbázist (port 51214)...\n');

    // Check tables
    const tables = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    console.log('📋 Táblák:');
    tables.rows.forEach(t => console.log(`   - ${t.tablename}`));

    // Check if old schema or new schema
    const hasUser = tables.rows.find(t => t.tablename === 'User');
    const hasUsers = tables.rows.find(t => t.tablename === 'users');

    if (hasUser) {
      console.log('\n🏷️ Régi séma (User, Proposal, ProposalBlock)\n');

      // Users
      const users = await pool.query('SELECT COUNT(*) as count FROM "User"');
      console.log(`👤 User táblában: ${users.rows[0].count} rekord`);

      const userList = await pool.query('SELECT email, name, role FROM "User" LIMIT 5');
      userList.rows.forEach(u => console.log(`   - ${u.email} (${u.name}) [${u.role}]`));

      // Proposals
      const proposals = await pool.query('SELECT COUNT(*) as count FROM "Proposal"');
      console.log(`\n📄 Proposal táblában: ${proposals.rows[0].count} rekord`);

      const propList = await pool.query('SELECT slug, "clientName", brand, status FROM "Proposal" WHERE status != \'TEMPLATE\' LIMIT 5');
      console.log('\nÁrajánlatok:');
      propList.rows.forEach(p => console.log(`   - ${p.slug} - ${p.clientName} [${p.brand}] ${p.status}`));

      // Templates
      const templates = await pool.query('SELECT COUNT(*) as count FROM "Proposal" WHERE status = \'TEMPLATE\'');
      console.log(`\n🎨 Sablonok: ${templates.rows[0].count} db`);

      if (templates.rows[0].count > 0) {
        const templateList = await pool.query('SELECT slug, "clientName", brand FROM "Proposal" WHERE status = \'TEMPLATE\' LIMIT 10');
        templateList.rows.forEach(t => console.log(`   - ${t.slug} [${t.brand}]`));
      }

      // Blocks
      const blocks = await pool.query('SELECT COUNT(*) as count FROM "ProposalBlock"');
      console.log(`\n📦 ProposalBlock táblában: ${blocks.rows[0].count} rekord`);

    } else if (hasUsers) {
      console.log('\n🏷️ Új séma (users, proposals, proposal_blocks)\n');

      const users = await pool.query('SELECT COUNT(*) as count FROM users');
      console.log(`👤 users táblában: ${users.rows[0].count} rekord`);

      const proposals = await pool.query('SELECT COUNT(*) as count FROM proposals');
      console.log(`📄 proposals táblában: ${proposals.rows[0].count} rekord`);

      const blocks = await pool.query('SELECT COUNT(*) as count FROM proposal_blocks');
      console.log(`📦 proposal_blocks táblában: ${blocks.rows[0].count} rekord`);
    } else {
      console.log('\n❌ Nincs User vagy users tábla!');
    }

  } catch (error) {
    console.error('❌ Hiba:', error.message);
  } finally {
  }
}

checkLocalDb();