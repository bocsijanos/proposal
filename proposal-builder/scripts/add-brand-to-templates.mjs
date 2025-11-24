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

async function addBrandColumn() {
  console.log('🔄 Brand mező hozzáadása a block_templates táblához...\n');

  try {
    // Add brand column with default BOOM
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "block_templates"
      ADD COLUMN IF NOT EXISTS "brand" TEXT NOT NULL DEFAULT 'BOOM'
    `);
    console.log('✅ Brand oszlop hozzáadva');

    // Drop old unique constraint
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "block_templates"
      DROP CONSTRAINT IF EXISTS "block_templates_block_type_name_key"
    `);
    console.log('✅ Régi unique constraint törölve');

    // Add new unique constraint with brand
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "block_templates"
      ADD CONSTRAINT "block_templates_block_type_name_brand_key"
      UNIQUE ("block_type", "name", "brand")
    `);
    console.log('✅ Új unique constraint hozzáadva (block_type, name, brand)');

    // Add index on brand
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "block_templates_brand_is_active_idx"
      ON "block_templates"("brand", "is_active")
    `);
    console.log('✅ Index hozzáadva (brand, is_active)');

    // Check current templates
    const templates = await prisma.blockTemplate.findMany({
      select: { id: true, blockType: true, name: true, brand: true },
      orderBy: { displayOrder: 'asc' },
    });

    console.log(`\n📊 Jelenlegi sablonok (${templates.length} db):`);
    templates.forEach((t, index) => {
      console.log(`  ${index + 1}. ${t.blockType.padEnd(20)} - ${t.name.padEnd(20)} [${t.brand}]`);
    });

    console.log('\n✅ Migráció sikeresen befejezve!');

  } catch (error) {
    console.error('❌ Hiba történt:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

addBrandColumn();
