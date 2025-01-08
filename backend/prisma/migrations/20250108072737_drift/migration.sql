/*
  Warnings:

  - You are about to alter the column `region` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Char(32)` to `Char(2)`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "region" SET DEFAULT 'CA',
ALTER COLUMN "region" SET DATA TYPE CHAR(2);
