-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "logo_path" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#4F46E5',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conveyancer" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CONVEYANCER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conveyancer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" TEXT NOT NULL,
    "conveyancerId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "client_type" TEXT NOT NULL DEFAULT 'INDIVIDUAL',
    "identity_verified" BOOLEAN NOT NULL DEFAULT false,
    "identification_type" TEXT,
    "identification_number" TEXT,
    "verified_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matter" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "conveyancerId" TEXT NOT NULL,
    "matter_type" TEXT NOT NULL,
    "property_address" TEXT NOT NULL,
    "property_suburb" TEXT,
    "property_state" TEXT NOT NULL DEFAULT 'NSW',
    "property_postcode" TEXT,
    "folio_identifier" TEXT,
    "property_status" TEXT,
    "property_value" DOUBLE PRECISION,
    "date" TIMESTAMP(3) NOT NULL,
    "settlement_date" TIMESTAMP(3),
    "buyerId" TEXT,
    "sellerId" TEXT,
    "amount" DOUBLE PRECISION,
    "deposit_amount" DOUBLE PRECISION,
    "deposit_paid" DOUBLE PRECISION,
    "cooling_off_period" TEXT,
    "status" TEXT NOT NULL,
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Matter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "matterId" TEXT,
    "parent_folder_id" TEXT,
    "uploaded_by" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT,
    "file_extension" TEXT,
    "file_size" INTEGER,
    "uploaded_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentFolder" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "matterId" TEXT NOT NULL,
    "parent_folder_id" TEXT,
    "name" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TitleSearch" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "matterId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "folio_identifier" TEXT NOT NULL,
    "property_address" TEXT,
    "property_suburb" TEXT,
    "property_state" TEXT NOT NULL DEFAULT 'NSW',
    "property_postcode" TEXT,
    "search_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "results" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "TitleSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "matterId" TEXT,
    "assignedToId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "completedById" TEXT,
    "dueDate" TIMESTAMP(3),
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatterAuditLog" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "matterId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatterAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_domain_key" ON "Tenant"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "Conveyancer_email_tenantId_key" ON "Conveyancer"("email", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_token_key" ON "PasswordReset"("token");

-- CreateIndex
CREATE INDEX "Client_tenantId_idx" ON "Client"("tenantId");

-- CreateIndex
CREATE INDEX "Client_email_idx" ON "Client"("email");

-- CreateIndex
CREATE INDEX "Matter_tenantId_idx" ON "Matter"("tenantId");

-- CreateIndex
CREATE INDEX "Matter_conveyancerId_idx" ON "Matter"("conveyancerId");

-- CreateIndex
CREATE INDEX "Matter_buyerId_idx" ON "Matter"("buyerId");

-- CreateIndex
CREATE INDEX "Matter_sellerId_idx" ON "Matter"("sellerId");

-- CreateIndex
CREATE INDEX "Document_tenantId_idx" ON "Document"("tenantId");

-- CreateIndex
CREATE INDEX "Document_matterId_idx" ON "Document"("matterId");

-- CreateIndex
CREATE INDEX "Document_parent_folder_id_idx" ON "Document"("parent_folder_id");

-- CreateIndex
CREATE INDEX "DocumentFolder_tenantId_idx" ON "DocumentFolder"("tenantId");

-- CreateIndex
CREATE INDEX "DocumentFolder_matterId_idx" ON "DocumentFolder"("matterId");

-- CreateIndex
CREATE INDEX "DocumentFolder_parent_folder_id_idx" ON "DocumentFolder"("parent_folder_id");

-- CreateIndex
CREATE INDEX "TitleSearch_tenantId_idx" ON "TitleSearch"("tenantId");

-- CreateIndex
CREATE INDEX "TitleSearch_matterId_idx" ON "TitleSearch"("matterId");

-- CreateIndex
CREATE INDEX "Todo_tenantId_idx" ON "Todo"("tenantId");

-- CreateIndex
CREATE INDEX "Todo_matterId_idx" ON "Todo"("matterId");

-- CreateIndex
CREATE INDEX "Todo_assignedToId_idx" ON "Todo"("assignedToId");

-- CreateIndex
CREATE INDEX "Todo_createdById_idx" ON "Todo"("createdById");

-- CreateIndex
CREATE INDEX "MatterAuditLog_tenantId_idx" ON "MatterAuditLog"("tenantId");

-- CreateIndex
CREATE INDEX "MatterAuditLog_matterId_idx" ON "MatterAuditLog"("matterId");

-- CreateIndex
CREATE INDEX "MatterAuditLog_userId_idx" ON "MatterAuditLog"("userId");

-- AddForeignKey
ALTER TABLE "Conveyancer" ADD CONSTRAINT "Conveyancer_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_conveyancerId_fkey" FOREIGN KEY ("conveyancerId") REFERENCES "Conveyancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matter" ADD CONSTRAINT "Matter_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matter" ADD CONSTRAINT "Matter_conveyancerId_fkey" FOREIGN KEY ("conveyancerId") REFERENCES "Conveyancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matter" ADD CONSTRAINT "Matter_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matter" ADD CONSTRAINT "Matter_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_parent_folder_id_fkey" FOREIGN KEY ("parent_folder_id") REFERENCES "DocumentFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "Conveyancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentFolder" ADD CONSTRAINT "DocumentFolder_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentFolder" ADD CONSTRAINT "DocumentFolder_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentFolder" ADD CONSTRAINT "DocumentFolder_parent_folder_id_fkey" FOREIGN KEY ("parent_folder_id") REFERENCES "DocumentFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitleSearch" ADD CONSTRAINT "TitleSearch_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitleSearch" ADD CONSTRAINT "TitleSearch_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Conveyancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Conveyancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "Conveyancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatterAuditLog" ADD CONSTRAINT "MatterAuditLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatterAuditLog" ADD CONSTRAINT "MatterAuditLog_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatterAuditLog" ADD CONSTRAINT "MatterAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Conveyancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
