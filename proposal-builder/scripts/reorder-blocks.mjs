import { prisma } from '../lib/prisma.js';

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
      const content = JSON.parse(block.content);
      const heading = content.heading || content.title || block.blockType;
      console.log(`${block.displayOrder}: ${heading} (${block.blockType})`);
    });

    // Find the "Hirdetési Platformok" block
    const platformBlock = proposal.blocks.find(block => {
      const content = JSON.parse(block.content);
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

    // Swap the display orders
    await prisma.block.update({
      where: { id: platformBlock.id },
      data: { displayOrder: newOrder }
    });

    await prisma.block.update({
      where: { id: blockToSwap.id },
      data: { displayOrder: currentOrder }
    });

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

    console.log('\nNew block order:');
    updatedProposal.blocks.forEach(block => {
      const content = JSON.parse(block.content);
      const heading = content.heading || content.title || block.blockType;
      console.log(`${block.displayOrder}: ${heading} (${block.blockType})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

reorderBlocks();
