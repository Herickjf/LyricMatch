-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'PT', 'ES');

-- CreateEnum
CREATE TYPE "MusicApi" AS ENUM ('LETRAS', 'VAGALUME', 'MUSIXMATCH');

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gameStateId" TEXT,
ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'EN',
ADD COLUMN     "musicApi" "MusicApi" NOT NULL DEFAULT 'MUSIXMATCH';

-- CreateTable
CREATE TABLE "GameState" (
    "id" TEXT NOT NULL,
    "currentRound" INTEGER NOT NULL DEFAULT 1,
    "currentWord" TEXT,
    "timer" INTEGER NOT NULL DEFAULT 30,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "GameState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "language" "Language" NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameState_roomId_key" ON "GameState"("roomId");

-- AddForeignKey
ALTER TABLE "GameState" ADD CONSTRAINT "GameState_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
