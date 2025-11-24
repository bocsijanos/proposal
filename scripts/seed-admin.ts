import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🔐 Admin user létrehozása...');

  const passwordHash = await bcrypt.hash('admin123', 10);

  // Boom admin
  const boomAdmin = await prisma.user.upsert({
    where: { email: 'admin@boommarketing.hu' },
    update: { passwordHash },
    create: {
      email: 'admin@boommarketing.hu',
      passwordHash,
      name: 'Boom Admin',
      role: 'SUPER_ADMIN',
    },
  });

  console.log('✅ Boom admin létrehozva:', boomAdmin.email);

  // AiBoost admin
  const aiboostAdmin = await prisma.user.upsert({
    where: { email: 'admin@aiboost.hu' },
    update: { passwordHash },
    create: {
      email: 'admin@aiboost.hu',
      passwordHash,
      name: 'AiBoost Admin',
      role: 'ADMIN',
    },
  });

  console.log('✅ AiBoost admin létrehozva:', aiboostAdmin.email);
  console.log('\n🎉 Admin userek sikeresen létrehozva!');
  console.log('📧 Email: admin@boommarketing.hu vagy admin@aiboost.hu');
  console.log('🔑 Jelszó: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Hiba:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
