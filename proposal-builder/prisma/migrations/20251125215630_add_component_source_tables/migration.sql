-- CreateTable
CREATE TABLE "component_sources" (
    "id" TEXT NOT NULL,
    "block_type" "BlockType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "source_code" TEXT NOT NULL,
    "compiled_code" TEXT NOT NULL,
    "schema" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_compiled_at" TIMESTAMP(3),

    CONSTRAINT "component_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "component_versions" (
    "id" TEXT NOT NULL,
    "component_id" TEXT NOT NULL,
    "version_number" INTEGER NOT NULL,
    "change_description" TEXT,
    "source_code" TEXT NOT NULL,
    "compiled_code" TEXT NOT NULL,
    "schema" JSONB NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "component_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "component_sources_block_type_key" ON "component_sources"("block_type");

-- CreateIndex
CREATE INDEX "component_sources_block_type_idx" ON "component_sources"("block_type");

-- CreateIndex
CREATE INDEX "component_sources_is_active_idx" ON "component_sources"("is_active");

-- CreateIndex
CREATE INDEX "component_sources_updated_at_idx" ON "component_sources"("updated_at" DESC);

-- CreateIndex
CREATE INDEX "component_versions_component_id_version_number_idx" ON "component_versions"("component_id", "version_number" DESC);

-- CreateIndex
CREATE INDEX "component_versions_created_at_idx" ON "component_versions"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "component_versions_component_id_version_number_key" ON "component_versions"("component_id", "version_number");

-- AddForeignKey
ALTER TABLE "component_versions" ADD CONSTRAINT "component_versions_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "component_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
