-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PREMIUM', 'MAX');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('ACTIVE', 'GRACE', 'EXPIRED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "planExpiresAt" TIMESTAMP(3),
ADD COLUMN     "planStatus" "PlanStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "storageLimit" SET DEFAULT 20971520;
