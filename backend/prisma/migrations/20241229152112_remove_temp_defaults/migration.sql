/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Driver" ALTER COLUMN "email" DROP DEFAULT,
ALTER COLUMN "password" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");
