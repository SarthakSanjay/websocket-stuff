/*
  Warnings:

  - You are about to drop the column `friendId` on the `FriendRequest` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `FriendRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[senderId,ReceiverId]` on the table `FriendRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ReceiverId` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_friendId_fkey";

-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_userId_fkey";

-- DropIndex
DROP INDEX "FriendRequest_userId_friendId_key";

-- AlterTable
ALTER TABLE "FriendRequest" DROP COLUMN "friendId",
DROP COLUMN "userId",
ADD COLUMN     "ReceiverId" INTEGER NOT NULL,
ADD COLUMN     "senderId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_senderId_ReceiverId_key" ON "FriendRequest"("senderId", "ReceiverId");

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_ReceiverId_fkey" FOREIGN KEY ("ReceiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
