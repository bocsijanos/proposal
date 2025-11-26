import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testProposalCreation() {
  console.log('🧪 Testing proposal creation logic...\n');

  try {
    // Simulate proposal creation
    const brand = 'BOOM';

    // Step 1: Load ComponentSources
    console.log('Step 1: Loading ComponentSources...');
    const componentSources = await prisma.componentSource.findMany({
      where: { isActive: true },
    });
    console.log(`✅ Found ${componentSources.length} ComponentSources\n`);

    // Step 2: Create test proposal
    console.log('Step 2: Creating test proposal...');
    const testProposal = await prisma.proposal.create({
      data: {
        slug: `test-${Date.now()}`,
        clientName: 'Test Company',
        brand,
        status: 'DRAFT',
        createdById: 'test-user',
        createdByName: 'Test User',
      },
    });
    console.log(`✅ Proposal created: ${testProposal.id}\n`);

    // Step 3: Try creating ProposalComponentCode
    console.log('Step 3: Creating ProposalComponentCode entries...');
    const componentCodeMap = new Map<string, string>();

    for (const source of componentSources) {
      try {
        console.log(`   Creating entry for: ${source.blockType}`);
        const proposalComponentCode = await prisma.proposalComponentCode.create({
          data: {
            proposalId: testProposal.id,
            blockType: source.blockType,
            sourceCode: source.sourceCode,
            compiledCode: source.compiledCode,
            schema: source.schema as any,
            sourceVersion: source.version,
            isCustomized: false,
          },
        });
        componentCodeMap.set(source.blockType, proposalComponentCode.id);
        console.log(`   ✅ Created: ${proposalComponentCode.id}`);
      } catch (err: any) {
        console.error(`   ❌ Failed for ${source.blockType}:`, err.message);
        throw err;
      }
    }

    console.log(`\n✅ All ProposalComponentCode entries created (${componentCodeMap.size})\n`);

    // Step 4: Load templates
    console.log('Step 4: Loading BlockTemplates...');
    const templates = await prisma.blockTemplate.findMany({
      where: {
        isActive: true,
        brand: brand,
      },
      orderBy: { displayOrder: 'asc' },
    });
    console.log(`✅ Found ${templates.length} templates\n`);

    // Step 5: Build defaultBlocks
    console.log('Step 5: Building defaultBlocks array...');
    const defaultBlocks = templates.map((template: any, index: number) => ({
      blockType: template.blockType,
      displayOrder: index,
      isEnabled: template.isActive,
      content: template.defaultContent,
      customComponentId: componentCodeMap.get(template.blockType) || null,
    }));
    console.log(`✅ Built ${defaultBlocks.length} blocks\n`);

    // Step 6: Create blocks
    console.log('Step 6: Creating ProposalBlocks...');
    await prisma.proposalBlock.createMany({
      data: defaultBlocks.map(block => ({
        ...block,
        proposalId: testProposal.id,
      })),
    });
    console.log(`✅ Created ${defaultBlocks.length} blocks\n`);

    // Cleanup
    console.log('Cleaning up test data...');
    await prisma.proposalBlock.deleteMany({ where: { proposalId: testProposal.id } });
    await prisma.proposalComponentCode.deleteMany({ where: { proposalId: testProposal.id } });
    await prisma.proposal.delete({ where: { id: testProposal.id } });
    console.log('✅ Cleanup complete\n');

    console.log('🎉 Test passed! Proposal creation logic works correctly.');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testProposalCreation();
