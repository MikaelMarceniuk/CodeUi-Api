-- CreateEnum
CREATE TYPE "Plans" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "plan" "Plans" NOT NULL DEFAULT 'FREE';
