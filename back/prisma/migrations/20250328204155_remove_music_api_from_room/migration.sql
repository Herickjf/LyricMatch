/*
  Warnings:

  - You are about to drop the column `musicApi` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "musicApi";

-- DropEnum
DROP TYPE "MusicApi";
