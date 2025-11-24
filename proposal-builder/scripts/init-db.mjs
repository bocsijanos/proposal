#!/usr/bin/env node

import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });
dotenv.config({ path: join(__dirname, '../.env') });

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set');
  console.log('\nPlease set the DATABASE_URL in your Vercel project settings:');
  console.log('1. Go to https://vercel.com/bocsijanoss-projects/proposal-91m6/settings/environment-variables');
  console.log('2. Add DATABASE_URL with your Vercel Postgres connection string');
  console.log('3. You can get the connection string from: https://vercel.com/bocsijanoss-projects/proposal-91m6/stores');
  process.exit(1);
}

console.log('🔄 Initializing database schema...');

try {
  // Generate Prisma Client
  console.log('📦 Generating Prisma Client...');
  execSync('npx prisma generate', {
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  });

  // Push schema to database
  console.log('🚀 Pushing schema to database...');
  execSync('npx prisma db push --accept-data-loss', {
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  });

  console.log('✅ Database initialized successfully!');
  console.log('\nNext steps:');
  console.log('1. Create an admin user by running: npm run seed:sample');
  console.log('2. Or create a user manually with the create-admin script');

} catch (error) {
  console.error('❌ Failed to initialize database:', error.message);
  process.exit(1);
}