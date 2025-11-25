import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    await prisma.$disconnect();
  }
}

checkServicesBlock();
