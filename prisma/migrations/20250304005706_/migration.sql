/*
  Warnings:

  - The primary key for the `comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `commentId` on the `comment` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId` on the `comment` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `postId` on the `comment` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `match_participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `match_participant` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `match_id` on the `match_participant` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `matching` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `match_id` on the `matching` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `postId` on the `post` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId` on the `post` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `posttag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `postId` on the `posttag` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `tag_id` on the `posttag` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `tag_id` on the `tag` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_postId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `match_participant` DROP FOREIGN KEY `match_participant_match_id_fkey`;

-- DropForeignKey
ALTER TABLE `match_participant` DROP FOREIGN KEY `match_participant_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_userId_fkey`;

-- DropForeignKey
ALTER TABLE `posttag` DROP FOREIGN KEY `PostTag_postId_fkey`;

-- DropForeignKey
ALTER TABLE `posttag` DROP FOREIGN KEY `PostTag_tag_id_fkey`;

-- DropIndex
DROP INDEX `Comment_postId_fkey` ON `comment`;

-- DropIndex
DROP INDEX `Comment_userId_fkey` ON `comment`;

-- DropIndex
DROP INDEX `match_participant_match_id_fkey` ON `match_participant`;

-- DropIndex
DROP INDEX `Post_userId_fkey` ON `post`;

-- DropIndex
DROP INDEX `PostTag_tag_id_fkey` ON `posttag`;

-- AlterTable
ALTER TABLE `comment` DROP PRIMARY KEY,
    ADD COLUMN `parentCommentId` INTEGER NULL,
    MODIFY `commentId` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `userId` INTEGER NOT NULL,
    MODIFY `postId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`commentId`);

-- AlterTable
ALTER TABLE `match_participant` DROP PRIMARY KEY,
    MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `match_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`user_id`, `match_id`);

-- AlterTable
ALTER TABLE `matching` DROP PRIMARY KEY,
    MODIFY `match_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`match_id`);

-- AlterTable
ALTER TABLE `post` DROP PRIMARY KEY,
    MODIFY `postId` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`postId`);

-- AlterTable
ALTER TABLE `posttag` DROP PRIMARY KEY,
    MODIFY `postId` INTEGER NOT NULL,
    MODIFY `tag_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`postId`, `tag_id`);

-- AlterTable
ALTER TABLE `tag` DROP PRIMARY KEY,
    MODIFY `tag_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`tag_id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`user_id`);

-- AddForeignKey
ALTER TABLE `match_participant` ADD CONSTRAINT `match_participant_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_participant` ADD CONSTRAINT `match_participant_match_id_fkey` FOREIGN KEY (`match_id`) REFERENCES `matching`(`match_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`postId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_parentCommentId_fkey` FOREIGN KEY (`parentCommentId`) REFERENCES `Comment`(`commentId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostTag` ADD CONSTRAINT `PostTag_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`postId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostTag` ADD CONSTRAINT `PostTag_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `Tag`(`tag_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
