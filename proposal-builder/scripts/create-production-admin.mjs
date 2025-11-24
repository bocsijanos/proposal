import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  console.log('🔄 Creating production admin user...');

  // Admin credentials from login page
  const email = 'admin@boom.hu';
  const password = 'admin123'; // The password shown on login page
  const name = 'Bócsi János';

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('⚠️  User already exists with email:', email);
      console.log('✅ You can login with the existing credentials');
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Name:', name);
    console.log('Role:', user.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🚀 You can now login at: https://proposal-bocsijanos-projects.vercel.app/login');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
