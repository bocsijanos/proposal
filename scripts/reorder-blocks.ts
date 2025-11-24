import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function reorderBlocks() {
  try {
    // Find the proposal
    const proposal = await prisma.proposal.findFirst({
      where: {
        slug: 'boom-marketing-teljes-csomag-2025'
      },
      include: {
        blocks: {
          orderBy: {
            displayOrder: 'asc'
          }
        }
      }
    });

    if (!proposal) {
      console.log('Proposal not found');
      return;
    }

    console.log('\nCurrent block order:');
    proposal.blocks.forEach(block => {
      const content = block.content as any;
      const heading = content.heading || content.title || block.blockType;
      console.log(`${block.displayOrder}: ${heading} (${block.blockType})`);
    });

    // Find the "Hirdetési Platformok" block
    const platformBlock = proposal.blocks.find(block => {
      const content = block.content as any;
      return content.heading === 'Hirdetési Platformok';
    });

    if (!platformBlock) {
      console.log('\n"Hirdetési Platformok" block not found');
      return;
    }

    const currentOrder = platformBlock.displayOrder;
    const newOrder = currentOrder - 1;

    console.log(`\nMoving "Hirdetési Platformok" from position ${currentOrder} to ${newOrder}`);

    // Get the block that's currently at newOrder position
    const blockToSwap = proposal.blocks.find(b => b.displayOrder === newOrder);

    if (!blockToSwap) {
      console.log('No block to swap with');
      return;
    }

    // Swap the display orders using raw SQL since Prisma model names are case-sensitive
    await prisma.$executeRaw`UPDATE "Block" SET "displayOrder" = ${newOrder} WHERE id = ${platformBlock.id}`;
    await prisma.$executeRaw`UPDATE "Block" SET "displayOrder" = ${currentOrder} WHERE id = ${blockToSwap.id}`;

    console.log('\n✓ Blocks reordered successfully!');

    // Show new order
    const updatedProposal = await prisma.proposal.findFirst({
      where: { id: proposal.id },
      include: {
        blocks: {
          orderBy: {
            displayOrder: 'asc'
          }
        }
      }
    });

    if (updatedProposal) {
      console.log('\nNew block order:');
      updatedProposal.blocks.forEach(block => {
        const content = block.content as any;
        const heading = content.heading || content.title || block.blockType;
        console.log(`${block.displayOrder}: ${heading} (${block.blockType})`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

reorderBlocks();
