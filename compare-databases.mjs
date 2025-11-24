import pkg from 'pg';
const { Pool } = pkg;

async function compareDatabase(dbName, connectionString) {
  const pool = new Pool({ connectionString });

  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 Database: ${dbName}`);
    console.log('='.repeat(60));

    // Check if proposals table exists and get schema
    const schemaQuery = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'proposals'
      ORDER BY ordinal_position;
    `);

    if (schemaQuery.rows.length === 0) {
      console.log('⚠️  Proposals table does not exist!');
      return { dbName, exists: false };
    }

    console.log(`\n📋 Schema (${schemaQuery.rows.length} columns):`);
    const importantColumns = ['client_name', 'client_contact_name', 'client_phone', 'client_email'];
    schemaQuery.rows.forEach(col => {
      const highlight = importantColumns.includes(col.column_name) ? '👉 ' : '   ';
      console.log(`${highlight}${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(required)' : '(optional)'}`);
    });

    // Count proposals
    const countQuery = await pool.query('SELECT COUNT(*) as count FROM proposals');
    const count = parseInt(countQuery.rows[0].count);
    console.log(`\n📦 Total proposals: ${count}`);

    if (count > 0) {
      // Get sample proposals with all client fields
      const proposalsQuery = await pool.query(`
        SELECT
          id,
          slug,
          client_name,
          client_contact_name,
          client_phone,
          client_email,
          brand,
          status,
          created_at
        FROM proposals
        ORDER BY created_at DESC
        LIMIT 5
      `);

      console.log(`\n🔍 Sample proposals (latest ${proposalsQuery.rows.length}):`);
      proposalsQuery.rows.forEach((p, idx) => {
        console.log(`\n  ${idx + 1}. ${p.client_name} (${p.brand}) - ${p.status}`);
        console.log(`     Slug: ${p.slug}`);
        console.log(`     Contact Name: ${p.client_contact_name || 'N/A'}`);
        console.log(`     Phone: ${p.client_phone || 'N/A'}`);
        console.log(`     Email: ${p.client_email || 'N/A'}`);
        console.log(`     Created: ${p.created_at.toISOString().split('T')[0]}`);
      });
    }

    return {
      dbName,
      exists: true,
      schemaColumns: schemaQuery.rows.map(r => r.column_name),
      proposalCount: count,
      hasClientContactName: schemaQuery.rows.some(r => r.column_name === 'client_contact_name'),
      hasClientPhone: schemaQuery.rows.some(r => r.column_name === 'client_phone'),
      hasClientEmail: schemaQuery.rows.some(r => r.column_name === 'client_email')
    };
  } catch (error) {
    console.error(`❌ Error in ${dbName}:`, error.message);
    return { dbName, error: error.message };
  } finally {
    await pool.end();
  }
}

async function main() {
  console.log('\n🔍 Comparing template1 and postgres databases...\n');

  const template1Result = await compareDatabase(
    'template1',
    'postgres://postgres:postgres@127.0.0.1:51214/template1?sslmode=disable'
  );

  const postgresResult = await compareDatabase(
    'postgres',
    'postgres://postgres:postgres@127.0.0.1:51214/postgres?sslmode=disable'
  );

  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 COMPARISON SUMMARY');
  console.log('='.repeat(60));

  if (!template1Result.error && !postgresResult.error) {
    console.log(`\nProposal counts:`);
    console.log(`  - template1: ${template1Result.proposalCount || 0} proposals`);
    console.log(`  - postgres: ${postgresResult.proposalCount || 0} proposals`);

    console.log(`\nNew client fields:`);
    console.log(`  template1:`);
    console.log(`    - client_contact_name: ${template1Result.hasClientContactName ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`    - client_phone: ${template1Result.hasClientPhone ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`    - client_email: ${template1Result.hasClientEmail ? '✅ EXISTS' : '❌ MISSING'}`);

    console.log(`  postgres:`);
    console.log(`    - client_contact_name: ${postgresResult.hasClientContactName ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`    - client_phone: ${postgresResult.hasClientPhone ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`    - client_email: ${postgresResult.hasClientEmail ? '✅ EXISTS' : '❌ MISSING'}`);

    console.log(`\n💡 Recommendation:`);
    if (template1Result.proposalCount > postgresResult.proposalCount) {
      console.log(`   ✅ Use template1 database (has ${template1Result.proposalCount} proposals vs ${postgresResult.proposalCount})`);
      if (!template1Result.hasClientEmail || !template1Result.hasClientPhone || !template1Result.hasClientContactName) {
        console.log(`   ⚠️  BUT: New client fields are missing! Need to run migration on template1`);
      }
    } else if (postgresResult.proposalCount > template1Result.proposalCount) {
      console.log(`   ✅ Use postgres database (has ${postgresResult.proposalCount} proposals vs ${template1Result.proposalCount})`);
      if (!postgresResult.hasClientEmail || !postgresResult.hasClientPhone || !postgresResult.hasClientContactName) {
        console.log(`   ⚠️  BUT: New client fields are missing! Need to run migration on postgres`);
      }
    } else if (template1Result.proposalCount === postgresResult.proposalCount && template1Result.proposalCount > 0) {
      console.log(`   Both databases have same number of proposals (${template1Result.proposalCount})`);
      console.log(`   Check which one has the correct/latest data`);
    } else {
      console.log(`   Both databases are empty or have no proposals`);
    }
  }

  console.log('\n');
}

main();
