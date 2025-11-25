import { prisma } from '../lib/prisma';

async function main() {
  console.log('\n🔍 Block Templates Adatbázis Ellenőrzés\n');
  console.log('='.repeat(60));

  // Count by brand
  const boomCount = await prisma.blockTemplate.count({
    where: { brand: 'BOOM' }
  });

  const aiboostCount = await prisma.blockTemplate.count({
    where: { brand: 'AIBOOST' }
  });

  console.log(`\n📊 Template-ek brand szerint:`);
  console.log(`   BOOM: ${boomCount} db`);
  console.log(`   AIBOOST: ${aiboostCount} db`);
  console.log(`   Összesen: ${boomCount + aiboostCount} db`);

  // Count by block type
  const byType = await prisma.blockTemplate.groupBy({
    by: ['blockType'],
    _count: true,
    orderBy: {
      blockType: 'asc'
    }
  });

  console.log(`\n📦 Template-ek block típus szerint:`);
  byType.forEach(({ blockType, _count }) => {
    console.log(`   ${blockType}: ${_count} db`);
  });

  // Recently created migration templates
  const migrationTemplates = await prisma.blockTemplate.findMany({
    where: {
      OR: [
        { name: { endsWith: '- BOOM' } },
        { name: { endsWith: '- AIBOOST' } },
      ]
    },
    select: {
      name: true,
      blockType: true,
      brand: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  });

  console.log(`\n🆕 Migration által létrehozott template-ek (utolsó 10):`);
  migrationTemplates.forEach((t, idx) => {
    const date = new Date(t.createdAt).toLocaleString('hu-HU');
    console.log(`   ${idx + 1}. ${t.name} (${t.blockType}) - ${date}`);
  });

  // Check if all 14 block types exist for both brands
  const blockTypes = [
    'HERO', 'VALUE_PROP', 'PRICING_TABLE', 'SERVICES_GRID',
    'GUARANTEES', 'CTA', 'PROCESS_TIMELINE', 'CLIENT_LOGOS',
    'TEXT_BLOCK', 'TWO_COLUMN', 'PLATFORM_FEATURES', 'STATS',
    'BONUS_FEATURES', 'PARTNER_GRID'
  ];

  console.log(`\n✅ Migráció teljesség ellenőrzés:`);

  for (const brand of ['BOOM', 'AIBOOST']) {
    const missingTypes = [];
    for (const blockType of blockTypes) {
      const exists = await prisma.blockTemplate.findFirst({
        where: {
          blockType: blockType as any,
          brand: brand as any,
          name: { endsWith: `- ${brand}` }
        }
      });

      if (!exists) {
        missingTypes.push(blockType);
      }
    }

    if (missingTypes.length === 0) {
      console.log(`   ${brand}: ✅ Mind a 14 block type létezik`);
    } else {
      console.log(`   ${brand}: ⚠️  Hiányzik: ${missingTypes.join(', ')}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Ellenőrzés kész!\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
