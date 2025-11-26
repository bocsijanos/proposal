import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkComponentCode() {
  console.log('🔍 Checking ComponentSource code lengths...\n');

  const sources = await prisma.componentSource.findMany({
    select: {
      blockType: true,
      name: true,
      sourceCode: true,
      compiledCode: true,
    },
    orderBy: {
      blockType: 'asc',
    },
  });

  console.log('ComponentSource code status:');
  sources.forEach(s => {
    const sourceLen = s.sourceCode?.length || 0;
    const compiledLen = s.compiledCode?.length || 0;
    const status = sourceLen > 0 && compiledLen > 0 ? '✓' : '✗';
    console.log(`  ${s.blockType.padEnd(25)} - Source: ${sourceLen.toString().padStart(6)} bytes, Compiled: ${compiledLen.toString().padStart(6)} bytes ${status}`);
  });

  console.log(`\nTotal: ${sources.length} records`);

  // Sample one to verify it's real code
  if (sources.length > 0) {
    console.log(`\n📄 Sample from ${sources[0].blockType}:`);
    console.log('First 200 chars of compiled code:');
    console.log(sources[0].compiledCode?.substring(0, 200) || 'EMPTY');
  }

  await prisma.$disconnect();
}

checkComponentCode();
