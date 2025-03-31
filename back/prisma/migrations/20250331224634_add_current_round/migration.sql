/*
  Warnings:

  - You are about to drop the column `gameStateId` on the `PlayerAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `gameStateId` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the `GameState` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roomId` to the `PlayerAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GameState" DROP CONSTRAINT "GameState_roomId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerAnswer" DROP CONSTRAINT "PlayerAnswer_gameStateId_fkey";

-- AlterTable
ALTER TABLE "PlayerAnswer" DROP COLUMN "gameStateId",
ADD COLUMN     "roomId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "gameStateId",
ADD COLUMN     "currentRound" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "currentWord" TEXT,
ADD COLUMN     "roundTimer" INTEGER NOT NULL DEFAULT 30;

-- DropTable
DROP TABLE "GameState";

-- AddForeignKey
ALTER TABLE "PlayerAnswer" ADD CONSTRAINT "PlayerAnswer_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
