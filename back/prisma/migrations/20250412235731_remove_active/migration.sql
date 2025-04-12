/*
  Warnings:

  - You are about to drop the column `active` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "active";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "active";
