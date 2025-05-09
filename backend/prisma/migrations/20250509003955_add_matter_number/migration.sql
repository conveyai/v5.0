/*
  Warnings:

  - Added the required column `matter_number` to the `Matter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Matter" ADD COLUMN     "matter_number" TEXT NOT NULL;
