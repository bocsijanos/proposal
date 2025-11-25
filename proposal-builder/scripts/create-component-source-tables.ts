import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createComponentSourceTables() {
  console.log('🚀 Creating ComponentSource and ComponentVersion tables...\n');

  try {
    // Execute statements one by one
    const statements = [
      // 1. Create component_sources table
      `CREATE TABLE IF NOT EXISTS "component_sources" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "block_type" "BlockType" NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "source_code" TEXT NOT NULL,
        "compiled_code" TEXT NOT NULL,
        "schema" JSONB NOT NULL,
        "version" INTEGER NOT NULL DEFAULT 1,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "last_compiled_at" TIMESTAMP(3)
      )`,

      // 2. Create component_versions table
      `CREATE TABLE IF NOT EXISTS "component_versions" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "component_id" TEXT NOT NULL,
        "version_number" INTEGER NOT NULL,
        "change_description" TEXT,
        "source_code" TEXT NOT NULL,
        "compiled_code" TEXT NOT NULL,
        "schema" JSONB NOT NULL,
        "created_by_id" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,

      // 3-7. Create indexes for component_sources
      `CREATE UNIQUE INDEX IF NOT EXISTS "component_sources_block_type_key"
        ON "component_sources"("block_type")`,

      `CREATE INDEX IF NOT EXISTS "component_sources_block_type_idx"
        ON "component_sources"("block_type")`,

      `CREATE INDEX IF NOT EXISTS "component_sources_is_active_idx"
        ON "component_sources"("is_active")`,

      `CREATE INDEX IF NOT EXISTS "component_sources_updated_at_idx"
        ON "component_sources"("updated_at" DESC)`,

      // 8-10. Create indexes for component_versions
      `CREATE INDEX IF NOT EXISTS "component_versions_component_id_version_number_idx"
        ON "component_versions"("component_id", "version_number" DESC)`,

      `CREATE INDEX IF NOT EXISTS "component_versions_created_at_idx"
        ON "component_versions"("created_at" DESC)`,

      `CREATE UNIQUE INDEX IF NOT EXISTS "component_versions_component_id_version_number_key"
        ON "component_versions"("component_id", "version_number")`,
    ];

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      console.log(`[${i + 1}/${statements.length}] Executing: ${stmt.substring(0, 80).replace(/\s+/g, ' ')}...`);
      try {
        await prisma.$executeRawUnsafe(stmt);
        console.log('  ✅ Success\n');
      } catch (err: any) {
        // Ignore "already exists" errors
        if (err.message.includes('already exists') || err.code === '42P07') {
          console.log('  ⚠️  Already exists, skipping\n');
        } else {
          throw err;
        }
      }
    }

    // Add foreign key separately (might fail if already exists)
    console.log('Adding foreign key constraint...');
    try {
      await prisma.$executeRaw`
        ALTER TABLE "component_versions"
        ADD CONSTRAINT "component_versions_component_id_fkey"
        FOREIGN KEY ("component_id")
        REFERENCES "component_sources"("id")
        ON DELETE CASCADE ON UPDATE CASCADE
      `;
      console.log('✅ Foreign key added\n');
    } catch (err: any) {
      if (err.message.includes('already exists') || err.code === '42710') {
        console.log('⚠️  Foreign key already exists, skipping\n');
      } else {
        console.warn('⚠️  Foreign key creation failed (non-critical):', err.message);
      }
    }

    console.log('✨ ComponentSource tables created successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createComponentSourceTables();
