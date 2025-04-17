/*
  Warnings:

  - The primary key for the `Localization` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Localization" DROP CONSTRAINT "Localization_pkey";
