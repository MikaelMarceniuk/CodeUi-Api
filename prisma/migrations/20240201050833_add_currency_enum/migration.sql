-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('BRL', 'USD', 'EUR');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "preferred_currency",
ADD COLUMN     "preferred_currency" "Currency" NOT NULL DEFAULT 'BRL';
