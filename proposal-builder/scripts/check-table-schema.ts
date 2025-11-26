import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTableSchema() {
  console.log('🔍 Checking proposal_component_code table schema...\n');

  try {
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'proposal_component_code'
      ORDER BY ordinal_position
    ` as Array<{ column_name: string; data_type: string; is_nullable: string }>;

    console.log('Actual database columns:');
    console.log('------------------------');
    result.forEach(col => {
      console.log(`  ${col.column_name.padEnd(20)} ${col.data_type.padEnd(20)} ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    console.log('\nExpected by Prisma schema:');
    console.log('--------------------------');
    console.log('  id                   (cuid)');
    console.log('  proposal_id          (string)');
    console.log('  block_type           (enum)');
    console.log('  source_code          (text)          NOT NULL');
    console.log('  compiled_code        (text)          NULL');
    console.log('  schema               (jsonb)         NOT NULL');
    console.log('  source_version       (int)           NOT NULL');
    console.log('  is_customized        (boolean)       NOT NULL');
    console.log('  last_edited_by       (string)        NULL');
    console.log('  last_edited_at       (timestamp)     NULL');
    console.log('  created_at           (timestamp)     NOT NULL');
    console.log('  updated_at           (timestamp)     NOT NULL');

  } catch (error) {
    console.error('❌ Error querying database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTableSchema();
