import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkComponentSources() {
  console.log('🔍 Checking ComponentSource records...\n');

  const sources = await prisma.componentSource.findMany({
    select: {
      blockType: true,
      name: true,
      isActive: true,
      version: true,
    },
    orderBy: {
      blockType: 'asc',
    },
  });

  console.log('ComponentSource records:');
  sources.forEach(s => {
    console.log(`  ${s.blockType.padEnd(25)} - ${s.name} (v${s.version}) ${s.isActive ? '✓' : '✗'}`);
  });

  console.log(`\nTotal: ${sources.length} records`);

  await prisma.$disconnect();
}

checkComponentSources();
