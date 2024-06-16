/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `voiceUrl` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "imageUrl",
DROP COLUMN "text",
DROP COLUMN "videoUrl",
DROP COLUMN "voiceUrl",
ADD COLUMN     "data" TEXT;
