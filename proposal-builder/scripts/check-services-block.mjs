import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkServicesBlock() {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { slug: 'boom-marketing-teljes-pelda-2025' },
      include: {
        blocks: {
          where: { blockType: 'SERVICES_GRID' },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!proposal || proposal.blocks.length === 0) {
      console.log('❌ SERVICES_GRID blokk nem található!');
      return;
    }

    console.log(`\n📦 Talált ${proposal.blocks.length} SERVICES_GRID blokkot:\n`);

    proposal.blocks.forEach((block, index) => {
      console.log(`\n${index + 1}. SERVICES_GRID (display_order: ${block.displayOrder})`);
      console.log(JSON.stringify(block.content, null, 2));
    });

  } catch (error) {
    console.error('❌ Hiba:', error);
  } finally {
    await pool.end();
    await prisma.$disconnect();
  }
}

checkServicesBlock();
