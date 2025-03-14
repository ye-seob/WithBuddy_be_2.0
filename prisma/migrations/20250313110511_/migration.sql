/*
  Warnings:

  - The primary key for the `post_tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `postId` on the `post_tag` table. All the data in the column will be lost.
  - Added the required column `post_id` to the `post_tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `post_tag` DROP FOREIGN KEY `post_tag_postId_fkey`;

-- AlterTable
ALTER TABLE `post_tag` DROP PRIMARY KEY,
    DROP COLUMN `postId`,
    ADD COLUMN `post_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`post_id`, `tag_id`);

-- CreateTable
CREATE TABLE `post_like` (
    `user_id` INTEGER NOT NULL,
    `post_id` INTEGER NOT NULL,

    PRIMARY KEY (`user_id`, `post_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `post_like` ADD CONSTRAINT `post_like_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_like` ADD CONSTRAINT `post_like_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`postId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_tag` ADD CONSTRAINT `post_tag_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`postId`) ON DELETE RESTRICT ON UPDATE CASCADE;
