import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1:51214/postgres?sslmode=disable';

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function magyarositSablonok() {
  console.log('🔄 Sablonok magyarosítása...\n');

  // Fetch all templates
  const templates = await prisma.blockTemplate.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  console.log(`📋 ${templates.length} sablon található az adatbázisban\n`);

  let updatedCount = 0;

  for (const template of templates) {
    let newName = template.name;
    let newDescription = template.description;
    let needsUpdate = false;

    // Update name
    if (template.name === 'Default') {
      newName = 'Alapértelmezett';
      needsUpdate = true;
    } else if (template.name === 'Custom') {
      newName = 'Egyedi';
      needsUpdate = true;
    } else if (template.name.startsWith('Custom ')) {
      const number = template.name.replace('Custom ', '');
      newName = `Egyedi ${number}`;
      needsUpdate = true;
    }

    // Update description
    if (template.description) {
      if (template.description.includes('Default') || template.description.includes('template')) {
        newDescription = template.description
          .replace(/Default/g, 'Alapértelmezett')
          .replace(/Custom/g, 'Egyedi')
          .replace(/template/g, 'sablon');
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      console.log(`  🔧 Frissítés: "${template.name}" → "${newName}"`);

      await prisma.blockTemplate.update({
        where: { id: template.id },
        data: {
          name: newName,
          description: newDescription,
          updatedAt: new Date(),
        },
      });

      updatedCount++;
    } else {
      console.log(`  ✓ Már magyar: "${template.name}"`);
    }
  }

  console.log(`\n✅ Kész! ${updatedCount} sablon frissítve.`);

  // Display final state
  console.log('\n📊 Végleges állapot:');
  const finalTemplates = await prisma.blockTemplate.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  finalTemplates.forEach((t, index) => {
    const status = t.isActive ? '✓ Aktív' : '✗ Inaktív';
    console.log(`  ${index + 1}. ${t.blockType.padEnd(20)} - ${t.name.padEnd(20)} [${status}]`);
  });

  await prisma.$disconnect();
  await pool.end();
}

magyarositSablonok().catch(console.error);
