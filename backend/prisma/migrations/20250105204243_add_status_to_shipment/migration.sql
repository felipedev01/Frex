/*
  Warnings:

  - The `status` column on the `Shipment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Shipment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
-- AlterTable
ALTER TABLE "Shipment" 
ADD COLUMN "finishedAt" TIMESTAMP(3),
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(), -- Adiciona valor padrão
ALTER COLUMN "description" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'PENDENTE';
