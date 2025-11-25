-- AlterEnum
-- Add new values to the existing BlockType enum
ALTER TYPE "BlockType" ADD VALUE IF NOT EXISTS 'BONUS_FEATURES';
ALTER TYPE "BlockType" ADD VALUE IF NOT EXISTS 'PARTNER_GRID';
