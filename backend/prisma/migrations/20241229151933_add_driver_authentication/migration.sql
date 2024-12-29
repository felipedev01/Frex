-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "email" TEXT NOT NULL DEFAULT 'temp@example.com',
ADD COLUMN     "password" TEXT NOT NULL DEFAULT 'changeme';
