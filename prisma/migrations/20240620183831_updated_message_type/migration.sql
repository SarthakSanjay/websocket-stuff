/*
  Warnings:

  - The values [VOICE] on the enum `MessageType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MessageType_new" AS ENUM ('TEXT', 'IMAGE', 'AUDIO', 'VIDEO');
ALTER TABLE "Message" ALTER COLUMN "messageType" DROP DEFAULT;
ALTER TABLE "Message" ALTER COLUMN "messageType" TYPE "MessageType_new" USING ("messageType"::text::"MessageType_new");
ALTER TYPE "MessageType" RENAME TO "MessageType_old";
ALTER TYPE "MessageType_new" RENAME TO "MessageType";
DROP TYPE "MessageType_old";
ALTER TABLE "Message" ALTER COLUMN "messageType" SET DEFAULT 'TEXT';
COMMIT;
