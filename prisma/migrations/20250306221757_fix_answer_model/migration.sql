/*
  Warnings:

  - You are about to drop the column `userId` on the `Answer` table. All the data in the column will be lost.
  - Added the required column `chatId` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_userId_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "userId",
ADD COLUMN     "chatId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "User"("chatId") ON DELETE RESTRICT ON UPDATE CASCADE;
