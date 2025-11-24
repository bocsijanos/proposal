import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  // Update Boom Admin user
  const user = await prisma.user.update({
    where: { email: 'admin@boommarketing.hu' },
    data: {
      name: 'Bócsi János',
      avatarUrl: '/avatars/bocsi-janos.png'
    }
  });

  console.log('✅ User frissítve:', user.name, user.avatarUrl);

  // Update all proposals created by this user
  const proposals = await prisma.proposal.updateMany({
    where: { createdById: user.id },
    data: { createdByName: 'Bócsi János' }
  });

  console.log('✅ Proposals frissítve:', proposals.count, 'db');

} catch (error) {
  console.error('❌ Hiba:', error.message);
} finally {
  await prisma.$disconnect();
}
