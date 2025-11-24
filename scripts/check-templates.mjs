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

async function checkTemplates() {
  console.log('📋 Sablonok ellenőrzése...\n');

  try {
    const templates = await prisma.blockTemplate.findMany({
      select: { id: true, blockType: true, name: true, brand: true, isActive: true, displayOrder: true },
      orderBy: { displayOrder: 'asc' },
    });

    console.log(`Összesen: ${templates.length} sablon\n`);

    const byBrand = templates.reduce((acc, t) => {
      acc[t.brand] = (acc[t.brand] || 0) + 1;
      return acc;
    }, {});

    console.log('Brand szerinti megoszlás:');
    Object.entries(byBrand).forEach(([brand, count]) => {
      console.log(`  ${brand}: ${count} sablon`);
    });

    console.log(`\n📊 Részletek:`);
    templates.forEach((t, index) => {
      const status = t.isActive ? '✓ Aktív' : '✗ Inaktív';
      console.log(`  ${(index + 1).toString().padStart(2)}. ${t.blockType.padEnd(20)} - ${t.name.padEnd(20)} [${t.brand}] [${status}]`);
    });

  } catch (error) {
    console.error('❌ Hiba:', error.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

checkTemplates();
