/*
  Warnings:

  - The primary key for the `Player` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `is_admin` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `room_id` on the `Player` table. All the data in the column will be lost.
  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `current_round` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `current_word_id` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `language_id` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `max_players` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `max_rounds` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the `Guess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Word` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WordSorted` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `score` on table `Player` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_player_id_fkey";

-- DropForeignKey
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_room_id_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_room_id_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_current_word_id_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_language_id_fkey";

-- DropForeignKey
ALTER TABLE "Word" DROP CONSTRAINT "Word_language_id_fkey";

-- DropForeignKey
ALTER TABLE "WordSorted" DROP CONSTRAINT "WordSorted_room_id_fkey";

-- DropForeignKey
ALTER TABLE "WordSorted" DROP CONSTRAINT "WordSorted_word_id_fkey";

-- AlterTable
ALTER TABLE "Player" DROP CONSTRAINT "Player_pkey",
DROP COLUMN "is_admin",
DROP COLUMN "photo",
DROP COLUMN "room_id",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "isHost" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "roomId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "score" SET NOT NULL,
ALTER COLUMN "score" SET DEFAULT 0,
ADD CONSTRAINT "Player_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Player_id_seq";

-- AlterTable
ALTER TABLE "Room" DROP CONSTRAINT "Room_pkey",
DROP COLUMN "current_round",
DROP COLUMN "current_word_id",
DROP COLUMN "language_id",
DROP COLUMN "max_players",
DROP COLUMN "max_rounds",
DROP COLUMN "state",
ADD COLUMN     "maxPlayers" INTEGER NOT NULL DEFAULT 4,
ADD COLUMN     "maxRounds" INTEGER NOT NULL DEFAULT 10,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Room_id_seq";

-- DropTable
DROP TABLE "Guess";

-- DropTable
DROP TABLE "Language";

-- DropTable
DROP TABLE "Word";

-- DropTable
DROP TABLE "WordSorted";

-- DropEnum
DROP TYPE "MusicApi";

-- DropEnum
DROP TYPE "RoomState";

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
