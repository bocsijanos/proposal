#!/usr/bin/env node

import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createTables() {
  try {
    console.log('🔄 Creating database tables...');

    // Create enums
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPER_ADMIN');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'DECLINED', 'EXPIRED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE "BlockType" AS ENUM ('HERO', 'OVERVIEW', 'SERVICES', 'PRICING', 'TIMELINE', 'TEAM', 'TESTIMONIALS', 'FAQ', 'CTA', 'CUSTOM');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        role "UserRole" DEFAULT 'ADMIN',
        is_active BOOLEAN DEFAULT true,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    // Create accounts table (NextAuth)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        provider_account_id TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        token_type TEXT,
        expires_at INTEGER,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        UNIQUE(provider, provider_account_id)
      );
    `);

    // Create sessions table (NextAuth)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        session_token TEXT UNIQUE NOT NULL,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMP NOT NULL
      );
    `);

    // Create verification_tokens table (NextAuth)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires TIMESTAMP NOT NULL,
        UNIQUE(identifier, token)
      );
    `);

    // Create proposals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS proposals (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        client_name TEXT,
        client_email TEXT,
        company_name TEXT,
        status "ProposalStatus" DEFAULT 'DRAFT',
        valid_until TIMESTAMP,
        total_amount DOUBLE PRECISION DEFAULT 0,
        currency TEXT DEFAULT 'HUF',
        notes TEXT,
        internal_notes TEXT,
        is_template BOOLEAN DEFAULT false,
        template_name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        accepted_at TIMESTAMP,
        declined_at TIMESTAMP,
        sent_at TIMESTAMP,
        viewed_at TIMESTAMP,
        user_id TEXT NOT NULL REFERENCES users(id)
      );
      CREATE INDEX IF NOT EXISTS idx_proposals_slug ON proposals(slug);
      CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
      CREATE INDEX IF NOT EXISTS idx_proposals_user_id ON proposals(user_id);
    `);

    // Create proposal_blocks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS proposal_blocks (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        proposal_id TEXT NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
        type "BlockType" NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        position INTEGER NOT NULL,
        is_enabled BOOLEAN DEFAULT true,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_proposal_blocks_proposal_id ON proposal_blocks(proposal_id);
    `);

    // Create proposal_signatures table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS proposal_signatures (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        proposal_id TEXT UNIQUE NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        title TEXT,
        company TEXT,
        signed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address TEXT,
        user_agent TEXT
      );
    `);

    console.log('✅ All tables created successfully!');

    // Create a sample admin user
    console.log('👤 Creating sample admin user...');

    const bcrypt = await import('bcryptjs');
    const passwordHash = await bcrypt.hash('admin123', 10);

    await pool.query(`
      INSERT INTO users (email, password_hash, name, role, is_active)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, ['admin@example.com', passwordHash, 'Admin User', 'ADMIN', true]);

    console.log('✅ Sample admin user created!');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createTables();