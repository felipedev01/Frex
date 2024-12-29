/*
  Warnings:

  - The `status` column on the `Shipment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[licensePlate]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDENTE', 'EM_TRANSITO', 'CONCLUIDO');

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "status",
ADD COLUMN     "status" "ShipmentStatus" NOT NULL DEFAULT 'PENDENTE';

-- CreateIndex
CREATE UNIQUE INDEX "Driver_licensePlate_key" ON "Driver"("licensePlate");
