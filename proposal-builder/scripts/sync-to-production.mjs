import { PrismaClient } from '@prisma/client';

const localPrisma = new PrismaClient();
const PRODUCTION_URL = 'https://proposal-91m6-bocsi-janos-projects.vercel.app';

async function syncToProduction() {
  try {
    console.log('🚀 Starting production sync...\n');

    // Step 1: Export data from local database
    console.log('📦 Step 1: Exporting data from local database...');

    const users = await localPrisma.user.findMany();

    const proposals = await localPrisma.proposal.findMany({
      include: {
        blocks: {
          orderBy: {
            display_order: 'asc'
          }
        }
      }
    });

    const blockTemplates = await localPrisma.blockTemplate.findMany({
      orderBy: {
        display_order: 'asc'
      }
    });

    const exportData = {
      timestamp: new Date().toISOString(),
      users,
      proposals,
      blockTemplates,
    };

    console.log(`✅ Exported:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Proposals: ${proposals.length}`);
    console.log(`   - Block Templates: ${blockTemplates.length}`);
    console.log(`   - Total Blocks: ${proposals.reduce((sum, p) => sum + p.blocks.length, 0)}\n`);

    // Step 2: Run migrations on production
    console.log('🔧 Step 2: Running migrations on production...');
    console.log('⚠️  Please run this command in your browser console at:');
    console.log(`   ${PRODUCTION_URL}/dashboard\n`);
    console.log('```javascript');
    console.log(`fetch('/api/migrate-db', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(data => console.log('✅ Migration result:', data))`);
    console.log('```\n');

    console.log('Press ENTER after you have run the migration command...');
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });

    // Step 3: Import data to production
    console.log('\n📤 Step 3: Importing data to production...');
    console.log('⚠️  Please run this command in your browser console:\n');
    console.log('```javascript');
    console.log(`const importData = ${JSON.stringify(exportData, null, 2)};

fetch('/api/import-data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: importData })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Import result:', data);
  console.log(\`Imported: \${data.summary.usersImported} users, \${data.summary.templatesImported} templates, \${data.summary.proposalsImported} proposals\`);
})`);
    console.log('```\n');

    // Save export data to a file for easy copy-paste
    const fs = await import('fs');
    const exportFile = `export_${new Date().toISOString().replace(/:/g, '-').split('.')[0]}.json`;
    fs.writeFileSync(exportFile, JSON.stringify(exportData, null, 2));

    console.log(`✅ Export data saved to: ${exportFile}`);
    console.log('\nAlternatively, you can copy the data from this file and paste it into the browser console.');

  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  } finally {
    await localPrisma.$disconnect();
  }
}

syncToProduction();
