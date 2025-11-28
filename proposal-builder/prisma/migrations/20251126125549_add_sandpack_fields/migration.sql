-- AlterTable
ALTER TABLE "component_sources" ADD COLUMN     "dependencies" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "proposal_blocks" ADD COLUMN     "custom_component_id" TEXT,
ADD COLUMN     "last_rendered_at" TIMESTAMP(3),
ADD COLUMN     "rendered_html" TEXT;

-- CreateTable
CREATE TABLE "proposal_component_code" (
    "id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "block_type" "BlockType" NOT NULL,
    "sourceCode" TEXT NOT NULL,
    "compiledCode" TEXT,
    "schema" JSONB NOT NULL,
    "source_version" INTEGER NOT NULL DEFAULT 1,
    "is_customized" BOOLEAN NOT NULL DEFAULT false,
    "last_edited_by" TEXT,
    "last_edited_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proposal_component_code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "proposal_component_code_proposal_id_idx" ON "proposal_component_code"("proposal_id");

-- CreateIndex
CREATE INDEX "proposal_component_code_block_type_idx" ON "proposal_component_code"("block_type");

-- CreateIndex
CREATE INDEX "proposal_component_code_is_customized_idx" ON "proposal_component_code"("is_customized");

-- CreateIndex
CREATE UNIQUE INDEX "proposal_component_code_proposal_id_block_type_key" ON "proposal_component_code"("proposal_id", "block_type");

-- CreateIndex
CREATE INDEX "proposal_blocks_custom_component_id_idx" ON "proposal_blocks"("custom_component_id");

-- AddForeignKey
ALTER TABLE "proposal_blocks" ADD CONSTRAINT "proposal_blocks_custom_component_id_fkey" FOREIGN KEY ("custom_component_id") REFERENCES "proposal_component_code"("id") ON DELETE SET NULL ON UPDATE CASCADE;
