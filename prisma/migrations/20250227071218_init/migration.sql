/*
  Warnings:

  - You are about to drop the column `major` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `personal_match` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `major`;

-- DropTable
DROP TABLE `personal_match`;
