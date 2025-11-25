import bcrypt from 'bcryptjs';

const PRODUCTION_URL = 'https://proposal-builder.vercel.app';

async function createAdminUsers() {
  console.log('🔐 Creating admin users in production...\n');

  try {
    const adminPassword = await bcrypt.hash('admin123', 10);

    const users = [
      {
        email: 'admin@boommarketing.hu',
        passwordHash: adminPassword,
        name: 'Boom Admin',
        role: 'SUPER_ADMIN',
      },
      {
        email: 'admin@aiboost.hu',
        passwordHash: adminPassword,
        name: 'AiBoost Admin',
        role: 'ADMIN',
      },
    ];

    console.log('📤 Sending admin users to production...');
    const response = await fetch(`${PRODUCTION_URL}/api/import-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        users,
        proposals: [],
        blockTemplates: [],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create admin users: ${error}`);
    }

    const result = await response.json();
    console.log('✅ Admin users created successfully:');
    console.log(`   BOOM Admin: admin@boommarketing.hu / admin123`);
    console.log(`   AiBoost Admin: admin@aiboost.hu / admin123\n`);

    console.log('🌐 Visit: ${PRODUCTION_URL}/dashboard');

  } catch (error) {
    console.error('❌ Error creating admin users:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

createAdminUsers();
