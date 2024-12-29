-- CreateTable
CREATE TABLE "Shipment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nfNumbers" TEXT[],
    "driverId" INTEGER NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "transportCompany" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
