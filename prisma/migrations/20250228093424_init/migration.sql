/*
  Warnings:

  - You are about to drop the `department` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `department` DROP FOREIGN KEY `department_user_id_fkey`;

-- AlterTable
ALTER TABLE `user` MODIFY `student_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `department`;

-- CreateTable
CREATE TABLE `matching` (
    `match_id` INTEGER NOT NULL AUTO_INCREMENT,
    `match_type` ENUM('INDIVIDUAL', 'GROUP') NOT NULL,
    `personal_num` INTEGER NULL,
    `group_num` INTEGER NULL,

    PRIMARY KEY (`match_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `match_participant` (
    `user_id` INTEGER NOT NULL,
    `match_id` INTEGER NOT NULL,

    PRIMARY KEY (`user_id`, `match_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `match_participant` ADD CONSTRAINT `match_participant_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_participant` ADD CONSTRAINT `match_participant_match_id_fkey` FOREIGN KEY (`match_id`) REFERENCES `matching`(`match_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
