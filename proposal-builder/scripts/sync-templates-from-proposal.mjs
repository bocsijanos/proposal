import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;

// Set DATABASE_URL if not already set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgres://postgres:postgres@127.0.0.1:51214/postgres?sslmode=disable';
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log('🔍 Fetching boom-marketing-teljes-csomag-2025 proposal...');

    const proposal = await prisma.proposal.findUnique({
      where: { slug: 'boom-marketing-teljes-csomag-2025' },
      include: {
        blocks: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!proposal) {
      console.error('❌ Proposal not found!');
      process.exit(1);
    }

    console.log(`✅ Found proposal with ${proposal.blocks.length} blocks`);
    console.log('\n📝 Creating/updating templates from proposal blocks...\n');

    for (const block of proposal.blocks) {
      console.log(`  Processing ${block.blockType}...`);

      await prisma.blockTemplate.upsert({
        where: {
          blockType_name: {
            blockType: block.blockType,
            name: 'Default',
          },
        },
        update: {
          defaultContent: block.content,
          description: `Default ${block.blockType.replace(/_/g, ' ')} template`,
          displayOrder: block.displayOrder,
          isActive: block.isEnabled,
          updatedAt: new Date(),
        },
        create: {
          blockType: block.blockType,
          name: 'Default',
          description: `Default ${block.blockType.replace(/_/g, ' ')} template`,
          defaultContent: block.content,
          displayOrder: block.displayOrder,
          isActive: block.isEnabled,
        },
      });

      console.log(`    ✓ Template saved`);
    }

    console.log('\n✅ All templates synchronized!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Total blocks: ${proposal.blocks.length}`);
    console.log(`   - Enabled: ${proposal.blocks.filter(b => b.isEnabled).length}`);
    console.log(`   - Disabled: ${proposal.blocks.filter(b => !b.isEnabled).length}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
