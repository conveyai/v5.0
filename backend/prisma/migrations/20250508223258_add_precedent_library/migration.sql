-- CreateTable
CREATE TABLE "PrecedentFolder" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parent_folder_id" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrecedentFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Precedent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "folder_id" TEXT,
    "uploaded_by" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT,
    "file_extension" TEXT,
    "file_size" INTEGER,
    "content" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Precedent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PrecedentFolder_tenantId_idx" ON "PrecedentFolder"("tenantId");

-- CreateIndex
CREATE INDEX "PrecedentFolder_parent_folder_id_idx" ON "PrecedentFolder"("parent_folder_id");

-- CreateIndex
CREATE INDEX "Precedent_tenantId_idx" ON "Precedent"("tenantId");

-- CreateIndex
CREATE INDEX "Precedent_folder_id_idx" ON "Precedent"("folder_id");

-- AddForeignKey
ALTER TABLE "PrecedentFolder" ADD CONSTRAINT "PrecedentFolder_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrecedentFolder" ADD CONSTRAINT "PrecedentFolder_parent_folder_id_fkey" FOREIGN KEY ("parent_folder_id") REFERENCES "PrecedentFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrecedentFolder" ADD CONSTRAINT "PrecedentFolder_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Conveyancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Precedent" ADD CONSTRAINT "Precedent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Precedent" ADD CONSTRAINT "Precedent_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "PrecedentFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Precedent" ADD CONSTRAINT "Precedent_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "Conveyancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
