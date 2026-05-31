/*
  Warnings:

  - You are about to drop the column `tags` on the `BlogPost` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BlogPost" DROP CONSTRAINT "BlogPost_categoryId_fkey";

-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "tags";

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BlogCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
