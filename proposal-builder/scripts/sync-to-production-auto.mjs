import { PrismaClient } from '@prisma/client';

const PRODUCTION_URL = 'https://proposal-builder.vercel.app';
const prisma = new PrismaClient();

async function syncToProduction() {
  console.log('🚀 Starting production sync...\n');

  try {
    // Step 1: Run migration
    console.log('📊 Step 1: Running database migration on production...');
    const migrateResponse = await fetch(`${PRODUCTION_URL}/api/migrate-db`, {
      method: 'POST',
    });

    if (!migrateResponse.ok) {
      const error = await migrateResponse.text();
      throw new Error(`Migration failed: ${error}`);
    }

    const migrateResult = await migrateResponse.json();
    console.log('✅ Migration completed:', migrateResult.message);
    console.log(`   Executed ${migrateResult.statementsExecuted} SQL statements\n`);

    // Step 2: Export local data directly from database
    console.log('📤 Step 2: Exporting data from local database...');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        passwordHash: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    const proposals = await prisma.proposal.findMany({
      include: {
        blocks: {
          orderBy: { displayOrder: 'asc' }
        }
      }
    });

    const blockTemplates = await prisma.blockTemplate.findMany({
      orderBy: { displayOrder: 'asc' }
    });

    const exportData = {
      users,
      proposals,
      blockTemplates,
    };

    console.log('✅ Export completed:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Templates: ${blockTemplates.length}`);
    console.log(`   Proposals: ${proposals.length}\n`);

    // Step 3: Import to production
    console.log('📥 Step 3: Importing data to production...');
    const importResponse = await fetch(`${PRODUCTION_URL}/api/import-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exportData),
    });

    if (!importResponse.ok) {
      const error = await importResponse.text();
      throw new Error(`Import failed: ${error}`);
    }

    const importResult = await importResponse.json();
    console.log('✅ Import completed:');
    console.log(`   Users imported: ${importResult.users.filter(u => u.status === 'success').length}`);
    console.log(`   Templates imported: ${importResult.blockTemplates.filter(t => t.status === 'success').length}`);
    console.log(`   Proposals imported: ${importResult.proposals.filter(p => p.status === 'success').length}\n`);

    console.log('🎉 Production sync completed successfully!');
    console.log(`\n🌐 Visit: ${PRODUCTION_URL}/dashboard`);

  } catch (error) {
    console.error('❌ Error during sync:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

syncToProduction();
