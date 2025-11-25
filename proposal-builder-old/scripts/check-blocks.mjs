import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkBlocks() {
  try {
    console.time('⏱️  Query time');
    const proposal = await prisma.proposal.findUnique({
      where: { slug: 'boom-marketing-teljes-csomag-2025' },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
        blocks: {
          where: { isEnabled: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
    console.timeEnd('⏱️  Query time');

    if (!proposal) {
      console.log('❌ Proposal nem található!');
      return;
    }

    console.log(`\n📋 Proposal: ${proposal.clientName}`);
    console.log(`📦 Blokkok száma: ${proposal.blocks.length}\n`);

    proposal.blocks.forEach((block, index) => {
      console.log(`${index + 1}. ${block.blockType} (order: ${block.displayOrder}, enabled: ${block.isEnabled})`);

      // Heading kinyerése
      if (block.content && typeof block.content === 'object') {
        const content = block.content;
        if (content.heading) {
          console.log(`   📌 Heading: "${content.heading}"`);
        }
        if (block.blockType === 'SERVICES' && content.services) {
          console.log(`   🔧 Szolgáltatások száma: ${content.services.length}`);
        }
      }
      console.log('');
    });

  } catch (error) {
    console.error('❌ Hiba:', error);
  } finally {
    await pool.end();
    await prisma.$disconnect();
  }
}

checkBlocks();
