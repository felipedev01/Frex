/*
  Warnings:

  - You are about to drop the column `transportCompany` on the `Driver` table. All the data in the column will be lost.
  - Added the required column `transportCompanyId` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportCompanyId` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "transportCompany",
ADD COLUMN     "documentId" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "transportCompanyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "estimatedArrival" TIMESTAMP(3),
ADD COLUMN     "transportCompanyId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TransportCompany" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "contactPerson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransportCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransportCompany_cnpj_key" ON "TransportCompany"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "TransportCompany_email_key" ON "TransportCompany"("email");

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_transportCompanyId_fkey" FOREIGN KEY ("transportCompanyId") REFERENCES "TransportCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_transportCompanyId_fkey" FOREIGN KEY ("transportCompanyId") REFERENCES "TransportCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
