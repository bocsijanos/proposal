import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgres://postgres:postgres@127.0.0.1:51214/postgres?sslmode=disable'
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  try {
    const count = await prisma.proposal.count();
    console.log(`📊 Proposals in database: ${count}`);

    if (count > 0) {
      const proposals = await prisma.proposal.findMany({
        select: {
          id: true,
          slug: true,
          clientName: true,
          clientEmail: true,
          brand: true,
          status: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      });
      console.log('\n📋 Latest proposals:');
      proposals.forEach(p => {
        console.log(`  - ${p.clientName} (${p.brand}) - ${p.status} - ${p.slug}`);
        console.log(`    Email: ${p.clientEmail || 'N/A'}`);
      });
    } else {
      console.log('⚠️  No proposals found in database!');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

check();
