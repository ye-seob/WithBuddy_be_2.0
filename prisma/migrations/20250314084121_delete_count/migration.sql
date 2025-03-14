/*
  Warnings:

  - You are about to drop the column `dislike_count` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `like_count` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `dislike_count`,
    DROP COLUMN `like_count`;
