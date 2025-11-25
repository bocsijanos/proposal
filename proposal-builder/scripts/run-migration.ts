import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function runMigration() {
  console.log('🚀 Running ProposalComponentCode table migration...\n');

  try {
    // Execute statements one by one
    const statements = [
      // 1. Create table
      `CREATE TABLE IF NOT EXISTS "proposal_component_code" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "proposal_id" TEXT NOT NULL,
        "block_type" "BlockType" NOT NULL,
        "source_code" TEXT NOT NULL,
        "compiled_code" TEXT,
        "schema" JSONB NOT NULL,
        "source_version" INTEGER NOT NULL DEFAULT 1,
        "is_customized" BOOLEAN NOT NULL DEFAULT false,
        "last_edited_by" TEXT,
        "last_edited_at" TIMESTAMP(3),
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,

      // 2. Add column to proposal_blocks
      `ALTER TABLE "proposal_blocks" ADD COLUMN IF NOT EXISTS "custom_component_id" TEXT`,

      // 3-7. Create indexes
      `CREATE UNIQUE INDEX IF NOT EXISTS "proposal_component_code_proposal_id_block_type_key" ON "proposal_component_code"("proposal_id", "block_type")`,
      `CREATE INDEX IF NOT EXISTS "proposal_component_code_proposal_id_idx" ON "proposal_component_code"("proposal_id")`,
      `CREATE INDEX IF NOT EXISTS "proposal_component_code_block_type_idx" ON "proposal_component_code"("block_type")`,
      `CREATE INDEX IF NOT EXISTS "proposal_component_code_is_customized_idx" ON "proposal_component_code"("is_customized")`,
      `CREATE INDEX IF NOT EXISTS "proposal_blocks_custom_component_id_idx" ON "proposal_blocks"("custom_component_id")`,
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
        ALTER TABLE "proposal_blocks"
        ADD CONSTRAINT "proposal_blocks_custom_component_id_fkey"
        FOREIGN KEY ("custom_component_id")
        REFERENCES "proposal_component_code"("id")
        ON DELETE SET NULL ON UPDATE CASCADE
      `;
      console.log('✅ Foreign key added\n');
    } catch (err: any) {
      if (err.message.includes('already exists') || err.code === '42710') {
        console.log('⚠️  Foreign key already exists, skipping\n');
      } else {
        console.warn('⚠️  Foreign key creation failed (non-critical):', err.message);
      }
    }

    console.log('✨ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
