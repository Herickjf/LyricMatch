-- CreateTable
CREATE TABLE "Localization" (
    "ip" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "Localization_pkey" PRIMARY KEY ("ip")
);

-- CreateIndex
CREATE UNIQUE INDEX "Localization_playerId_key" ON "Localization"("playerId");

-- AddForeignKey
ALTER TABLE "Localization" ADD CONSTRAINT "Localization_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
