-- AlterTable
ALTER TABLE "PrintQueueItem" ADD COLUMN     "assignedAdminId" TEXT;

-- AddForeignKey
ALTER TABLE "PrintQueueItem" ADD CONSTRAINT "PrintQueueItem_assignedAdminId_fkey" FOREIGN KEY ("assignedAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
