/*
  Warnings:

  - You are about to drop the column `client_type` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `identity_verified` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "client_type",
DROP COLUMN "identity_verified",
ADD COLUMN     "contact_type" TEXT NOT NULL DEFAULT 'INDIVIDUAL';
