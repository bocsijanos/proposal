import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProposal() {
  const proposalId = 'cmifonba40001jr04mxvj7abv';

  console.log(`🔍 Checking proposal: ${proposalId}\n`);

  // Check proposal exists
  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    select: {
      id: true,
      slug: true,
      clientName: true,
      brand: true,
      createdAt: true,
    },
  });

  if (!proposal) {
    console.log('❌ Proposal not found!');
    return;
  }

  console.log('✅ Proposal found:');
  console.log(`   Client: ${proposal.clientName}`);
  console.log(`   Brand: ${proposal.brand}`);
  console.log(`   Slug: ${proposal.slug}`);
  console.log(`   Created: ${proposal.createdAt}\n`);

  // Check blocks
  const blocks = await prisma.proposalBlock.findMany({
    where: { proposalId },
    orderBy: { displayOrder: 'asc' },
    select: {
      id: true,
      blockType: true,
      displayOrder: true,
      isEnabled: true,
      customComponentId: true,
    },
  });

  console.log(`📦 Blocks: ${blocks.length}`);
  if (blocks.length > 0) {
    blocks.forEach(b => {
      console.log(`   ${b.displayOrder}. ${b.blockType} (${b.isEnabled ? 'enabled' : 'disabled'}) - customComponentId: ${b.customComponentId || 'NULL'}`);
    });
  } else {
    console.log('   ⚠️  No blocks found!\n');
  }

  // Check ProposalComponentCode entries
  const componentCodes = await prisma.proposalComponentCode.findMany({
    where: { proposalId },
    select: {
      id: true,
      blockType: true,
      sourceVersion: true,
      isCustomized: true,
    },
  });

  console.log(`\n🔧 ProposalComponentCode entries: ${componentCodes.length}`);
  if (componentCodes.length > 0) {
    componentCodes.forEach(c => {
      console.log(`   ${c.blockType} (v${c.sourceVersion}) - ${c.isCustomized ? 'customized' : 'default'}`);
    });
  } else {
    console.log('   ⚠️  No component code entries found!\n');
  }

  // Check BlockTemplates for the brand
  const templates = await prisma.blockTemplate.findMany({
    where: {
      brand: proposal.brand,
      isActive: true,
    },
    select: {
      id: true,
      blockType: true,
      name: true,
    },
  });

  console.log(`\n📋 BlockTemplates (${proposal.brand}): ${templates.length}`);
  if (templates.length > 0) {
    templates.forEach(t => {
      console.log(`   ${t.blockType} - ${t.name}`);
    });
  }

  await prisma.$disconnect();
}

checkProposal();
