/*
  Warnings:

  - The `status` column on the `NFDetail` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "NFStatus" AS ENUM ('PENDENTE', 'ENTREGUE', 'DIVERGENTE');

-- AlterTable
ALTER TABLE "NFDetail" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "issueDetails" TEXT,
ADD COLUMN     "issueType" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "NFStatus" NOT NULL DEFAULT 'PENDENTE';
