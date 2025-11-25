import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Migration SQL from prisma/migrations/0_init/migration.sql
const INIT_MIGRATION = `
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "Brand" AS ENUM ('BOOM', 'AIBOOST');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('HERO', 'VALUE_PROP', 'PLATFORM_FEATURES', 'PRICING_TABLE', 'GUARANTEES', 'PROCESS_TIMELINE', 'CLIENT_LOGOS', 'SERVICES_GRID', 'TEXT_BLOCK', 'TWO_COLUMN', 'CTA', 'STATS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_contact_name" TEXT,
    "client_phone" TEXT,
    "client_email" TEXT,
    "brand" "Brand" NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "last_viewed_at" TIMESTAMP(3),
    "is_template" BOOLEAN NOT NULL DEFAULT false,
    "cloned_from_id" TEXT,
    "created_by_id" TEXT NOT NULL,
    "created_by_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),
    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_blocks" (
    "id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "block_type" "BlockType" NOT NULL,
    "display_order" INTEGER NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "content" JSONB NOT NULL,
    "template_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "proposal_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "block_templates" (
    "id" TEXT NOT NULL,
    "block_type" "BlockType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "brand" "Brand" NOT NULL DEFAULT 'BOOM',
    "default_content" JSONB NOT NULL,
    "thumbnail_url" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "block_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_versions" (
    "id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "version_number" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "change_description" TEXT,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "proposal_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_views" (
    "id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "referrer" TEXT,
    "country" TEXT,
    "city" TEXT,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "proposal_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");
CREATE UNIQUE INDEX "proposals_slug_key" ON "proposals"("slug");
CREATE INDEX "proposals_slug_idx" ON "proposals"("slug");
CREATE INDEX "proposals_created_by_id_idx" ON "proposals"("created_by_id");
CREATE INDEX "proposals_brand_idx" ON "proposals"("brand");
CREATE INDEX "proposals_status_idx" ON "proposals"("status");
CREATE INDEX "proposals_created_at_idx" ON "proposals"("created_at" DESC);
CREATE INDEX "proposals_client_name_idx" ON "proposals"("client_name");
CREATE INDEX "proposals_is_template_idx" ON "proposals"("is_template");
CREATE INDEX "proposal_blocks_proposal_id_display_order_idx" ON "proposal_blocks"("proposal_id", "display_order");
CREATE INDEX "proposal_blocks_proposal_id_is_enabled_idx" ON "proposal_blocks"("proposal_id", "is_enabled");
CREATE INDEX "proposal_blocks_block_type_idx" ON "proposal_blocks"("block_type");
CREATE UNIQUE INDEX "proposal_blocks_proposal_id_display_order_key" ON "proposal_blocks"("proposal_id", "display_order");
CREATE INDEX "block_templates_block_type_is_active_idx" ON "block_templates"("block_type", "is_active");
CREATE INDEX "block_templates_brand_is_active_idx" ON "block_templates"("brand", "is_active");
CREATE INDEX "block_templates_display_order_idx" ON "block_templates"("display_order");
CREATE UNIQUE INDEX "block_templates_block_type_name_brand_key" ON "block_templates"("block_type", "name", "brand");
CREATE INDEX "proposal_versions_proposal_id_created_at_idx" ON "proposal_versions"("proposal_id", "created_at" DESC);
CREATE UNIQUE INDEX "proposal_versions_proposal_id_version_number_key" ON "proposal_versions"("proposal_id", "version_number");
CREATE INDEX "proposal_views_proposal_id_viewed_at_idx" ON "proposal_views"("proposal_id", "viewed_at" DESC);
CREATE INDEX "proposal_views_viewed_at_idx" ON "proposal_views"("viewed_at" DESC);

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_cloned_from_id_fkey" FOREIGN KEY ("cloned_from_id") REFERENCES "proposals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "proposal_blocks" ADD CONSTRAINT "proposal_blocks_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "proposal_blocks" ADD CONSTRAINT "proposal_blocks_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "block_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "proposal_versions" ADD CONSTRAINT "proposal_versions_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
`;

const BONUS_BLOCK_TYPES_MIGRATION = `
-- AlterEnum - Add new values to the existing BlockType enum
ALTER TYPE "BlockType" ADD VALUE IF NOT EXISTS 'BONUS_FEATURES';
ALTER TYPE "BlockType" ADD VALUE IF NOT EXISTS 'PARTNER_GRID';
`;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting database schema creation...');

    // Check if tables already exist
    const tableCheck = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'block_templates'
      );
    `;

    if (tableCheck[0]?.exists) {
      console.log('Tables already exist, adding bonus block types if needed...');

      // Try to add bonus block types (will silently fail if they exist)
      try {
        await prisma.$executeRaw`ALTER TYPE "BlockType" ADD VALUE IF NOT EXISTS 'BONUS_FEATURES'`;
      } catch (e) {
        console.log('BONUS_FEATURES already exists or error:', e);
      }

      try {
        await prisma.$executeRaw`ALTER TYPE "BlockType" ADD VALUE IF NOT EXISTS 'PARTNER_GRID'`;
      } catch (e) {
        console.log('PARTNER_GRID already exists or error:', e);
      }

      return NextResponse.json({
        message: 'Database schema already exists',
        success: true,
        alreadyExisted: true
      });
    }

    // Split migration into individual statements and execute them
    console.log('Creating initial schema...');

    // Split by semicolon and filter out comments and empty lines
    const allStatements = INIT_MIGRATION
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 && !trimmed.startsWith('--');
      })
      .join('\n')
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`Executing ${allStatements.length} SQL statements...`);

    // Execute each statement individually (not in transaction to avoid timeout)
    for (let i = 0; i < allStatements.length; i++) {
      const statement = allStatements[i];
      try {
        console.log(`Executing statement ${i + 1}/${allStatements.length}`);
        await prisma.$executeRawUnsafe(statement);
      } catch (error) {
        console.error(`Failed on statement ${i + 1}:`, statement.substring(0, 100));
        throw error;
      }
    }

    // Add bonus block types
    console.log('Adding bonus block types...');
    await prisma.$executeRaw`ALTER TYPE "BlockType" ADD VALUE IF NOT EXISTS 'BONUS_FEATURES'`;
    await prisma.$executeRaw`ALTER TYPE "BlockType" ADD VALUE IF NOT EXISTS 'PARTNER_GRID'`;

    return NextResponse.json({
      message: 'Database migrations applied successfully',
      success: true,
      schemasCreated: ['initial schema', 'bonus block types']
    });

  } catch (error) {
    console.error('Error running migrations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Failed to run migrations',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
