-- Create ProposalComponentCode table
CREATE TABLE IF NOT EXISTS "proposal_component_code" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "proposal_id" TEXT NOT NULL,
  "block_type" "BlockType" NOT NULL,
  "source_code" TEXT NOT NULL,
  "compiled_code" TEXT,
  "schema" JSONB NOT NULL,
  "source_version" INTEGER NOT NULL DEFAULT 1,
  "is_customized" BOOLEAN NOT NULL DEFAULT false,
  "last_edited_by" TEXT,
  "last_edited_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add customComponentId to ProposalBlock
ALTER TABLE "proposal_blocks"
ADD COLUMN IF NOT EXISTS "custom_component_id" TEXT;

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS "proposal_component_code_proposal_id_block_type_key"
ON "proposal_component_code"("proposal_id", "block_type");

CREATE INDEX IF NOT EXISTS "proposal_component_code_proposal_id_idx"
ON "proposal_component_code"("proposal_id");

CREATE INDEX IF NOT EXISTS "proposal_component_code_block_type_idx"
ON "proposal_component_code"("block_type");

CREATE INDEX IF NOT EXISTS "proposal_component_code_is_customized_idx"
ON "proposal_component_code"("is_customized");

CREATE INDEX IF NOT EXISTS "proposal_blocks_custom_component_id_idx"
ON "proposal_blocks"("custom_component_id");

-- Add foreign key constraint
ALTER TABLE "proposal_blocks"
ADD CONSTRAINT IF NOT EXISTS "proposal_blocks_custom_component_id_fkey"
FOREIGN KEY ("custom_component_id")
REFERENCES "proposal_component_code"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
