/*
  Warnings:

  - A unique constraint covering the columns `[userId,friendId]` on the table `FriendRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_userId_friendId_key" ON "FriendRequest"("userId", "friendId");
