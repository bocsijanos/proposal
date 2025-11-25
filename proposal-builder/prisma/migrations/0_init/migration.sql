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

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "proposals_slug_key" ON "proposals"("slug");

-- CreateIndex
CREATE INDEX "proposals_slug_idx" ON "proposals"("slug");

-- CreateIndex
CREATE INDEX "proposals_created_by_id_idx" ON "proposals"("created_by_id");

-- CreateIndex
CREATE INDEX "proposals_brand_idx" ON "proposals"("brand");

-- CreateIndex
CREATE INDEX "proposals_status_idx" ON "proposals"("status");

-- CreateIndex
CREATE INDEX "proposals_created_at_idx" ON "proposals"("created_at" DESC);

-- CreateIndex
CREATE INDEX "proposals_client_name_idx" ON "proposals"("client_name");

-- CreateIndex
CREATE INDEX "proposals_is_template_idx" ON "proposals"("is_template");

-- CreateIndex
CREATE INDEX "proposal_blocks_proposal_id_display_order_idx" ON "proposal_blocks"("proposal_id", "display_order");

-- CreateIndex
CREATE INDEX "proposal_blocks_proposal_id_is_enabled_idx" ON "proposal_blocks"("proposal_id", "is_enabled");

-- CreateIndex
CREATE INDEX "proposal_blocks_block_type_idx" ON "proposal_blocks"("block_type");

-- CreateIndex
CREATE UNIQUE INDEX "proposal_blocks_proposal_id_display_order_key" ON "proposal_blocks"("proposal_id", "display_order");

-- CreateIndex
CREATE INDEX "block_templates_block_type_is_active_idx" ON "block_templates"("block_type", "is_active");

-- CreateIndex
CREATE INDEX "block_templates_brand_is_active_idx" ON "block_templates"("brand", "is_active");

-- CreateIndex
CREATE INDEX "block_templates_display_order_idx" ON "block_templates"("display_order");

-- CreateIndex
CREATE UNIQUE INDEX "block_templates_block_type_name_brand_key" ON "block_templates"("block_type", "name", "brand");

-- CreateIndex
CREATE INDEX "proposal_versions_proposal_id_created_at_idx" ON "proposal_versions"("proposal_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "proposal_versions_proposal_id_version_number_key" ON "proposal_versions"("proposal_id", "version_number");

-- CreateIndex
CREATE INDEX "proposal_views_proposal_id_viewed_at_idx" ON "proposal_views"("proposal_id", "viewed_at" DESC);

-- CreateIndex
CREATE INDEX "proposal_views_viewed_at_idx" ON "proposal_views"("viewed_at" DESC);

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_cloned_from_id_fkey" FOREIGN KEY ("cloned_from_id") REFERENCES "proposals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_blocks" ADD CONSTRAINT "proposal_blocks_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_blocks" ADD CONSTRAINT "proposal_blocks_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "block_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_versions" ADD CONSTRAINT "proposal_versions_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

