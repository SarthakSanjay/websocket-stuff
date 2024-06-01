/*
  Warnings:

  - A unique constraint covering the columns `[userId,friendId]` on the table `Friendship` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Friendship_friendId_key";

-- DropIndex
DROP INDEX "Friendship_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_userId_friendId_key" ON "Friendship"("userId", "friendId");
