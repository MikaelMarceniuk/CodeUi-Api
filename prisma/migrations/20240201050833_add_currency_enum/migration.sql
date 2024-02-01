/*
  Warnings:

  - The `preferred_currency` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('BRL', 'USD', 'EUR');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "preferred_currency",
ADD COLUMN     "preferred_currency" "Currency" NOT NULL DEFAULT 'BRL';
