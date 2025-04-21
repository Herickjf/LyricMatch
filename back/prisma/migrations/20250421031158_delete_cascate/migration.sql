-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_roomId_fkey";

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
