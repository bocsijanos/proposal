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

async function fixBrandType() {
  console.log('🔄 Brand mező típusának javítása TEXT-ről Brand ENUM-ra...\n');

  try {
    // First, check if Brand enum exists, if not create it
    console.log('1️⃣ Brand ENUM létrehozása (ha még nem létezik)...');
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "Brand" AS ENUM ('BOOM', 'AIBOOST');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✅ Brand ENUM létezik');

    // Drop the default constraint first
    console.log('\n2️⃣ Default érték eltávolítása...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "block_templates"
      ALTER COLUMN "brand" DROP DEFAULT
    `);
    console.log('✅ Default érték eltávolítva');

    // Change column type from TEXT to Brand enum
    console.log('\n3️⃣ brand oszlop típusának megváltoztatása TEXT-ről Brand ENUM-ra...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "block_templates"
      ALTER COLUMN "brand" TYPE "Brand" USING brand::"Brand"
    `);
    console.log('✅ brand oszlop típusa megváltoztatva Brand ENUM-ra');

    // Re-add the default constraint with ENUM value
    console.log('\n4️⃣ Default érték visszaállítása ENUM típussal...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "block_templates"
      ALTER COLUMN "brand" SET DEFAULT 'BOOM'::"Brand"
    `);
    console.log('✅ Default érték visszaállítva ENUM típussal');

    // Verify the change
    const templates = await prisma.blockTemplate.findMany({
      select: { id: true, blockType: true, name: true, brand: true },
      take: 5,
    });

    console.log(`\n📊 Első 5 sablon ellenőrzése:`);
    templates.forEach((t, index) => {
      console.log(`  ${index + 1}. ${t.blockType.padEnd(20)} - ${t.name.padEnd(20)} [${t.brand}]`);
    });

    console.log('\n✅ Típus konverzió sikeres!');

  } catch (error) {
    console.error('❌ Hiba történt:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

fixBrandType();
