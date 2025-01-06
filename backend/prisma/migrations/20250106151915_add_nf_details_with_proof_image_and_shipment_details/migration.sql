/*
  Warnings:

  - You are about to drop the column `nfNumbers` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Shipment` table. All the data in the column will be lost.
  - Added the required column `destination` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "nfNumbers",
DROP COLUMN "updatedAt",
ADD COLUMN     "destination" TEXT NOT NULL,
ADD COLUMN     "origin" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "NFDetail" (
    "id" SERIAL NOT NULL,
    "shipmentId" INTEGER NOT NULL,
    "nfNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "proofImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NFDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NFDetail" ADD CONSTRAINT "NFDetail_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
