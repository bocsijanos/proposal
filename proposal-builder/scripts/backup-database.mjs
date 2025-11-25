import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function backupDatabase() {
  try {
    console.log('Starting database backup...');

    // Export all data
    const proposals = await prisma.proposal.findMany({
      include: {
        blocks: true,
      },
    });

    const blockTemplates = await prisma.blockTemplate.findMany();
    const users = await prisma.user.findMany();

    const backup = {
      timestamp: new Date().toISOString(),
      proposals,
      blockTemplates,
      users,
    };

    const filename = `backup_${new Date().toISOString().replace(/:/g, '-').split('.')[0]}.json`;
    fs.writeFileSync(filename, JSON.stringify(backup, null, 2));

    console.log(`✅ Database backup created: ${filename}`);
    console.log(`   - Proposals: ${proposals.length}`);
    console.log(`   - Block Templates: ${blockTemplates.length}`);
    console.log(`   - Users: ${users.length}`);

  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

backupDatabase();
