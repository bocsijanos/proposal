import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    console.log('Creating admin users...');

    const adminPassword = await bcrypt.hash('admin123', 10);

    // Create BOOM admin
    const boomAdmin = await prisma.user.upsert({
      where: { email: 'admin@boommarketing.hu' },
      update: {},
      create: {
        email: 'admin@boommarketing.hu',
        passwordHash: adminPassword,
        name: 'Boom Admin',
        role: 'SUPER_ADMIN',
      },
    });

    // Create AiBoost admin
    const aiboostAdmin = await prisma.user.upsert({
      where: { email: 'admin@aiboost.hu' },
      update: {},
      create: {
        email: 'admin@aiboost.hu',
        passwordHash: adminPassword,
        name: 'AiBoost Admin',
        role: 'ADMIN',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin users created successfully',
      users: [
        { email: boomAdmin.email, role: boomAdmin.role },
        { email: aiboostAdmin.email, role: aiboostAdmin.role },
      ],
    });

  } catch (error) {
    console.error('Error creating admin users:', error);
    return NextResponse.json(
      {
        error: 'Failed to create admin users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
