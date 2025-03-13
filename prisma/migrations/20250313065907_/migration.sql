-- DropForeignKey
ALTER TABLE `chat_participant` DROP FOREIGN KEY `chat_participant_room_id_fkey`;

-- DropForeignKey
ALTER TABLE `chat_participant` DROP FOREIGN KEY `chat_participant_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_parentCommentId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_postId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `message_room_id_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `message_sender_id_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `post_userId_fkey`;

-- DropIndex
DROP INDEX `chat_participant_room_id_fkey` ON `chat_participant`;

-- DropIndex
DROP INDEX `comment_parentCommentId_fkey` ON `comment`;

-- DropIndex
DROP INDEX `comment_postId_fkey` ON `comment`;

-- DropIndex
DROP INDEX `comment_userId_fkey` ON `comment`;

-- DropIndex
DROP INDEX `message_room_id_fkey` ON `message`;

-- DropIndex
DROP INDEX `message_sender_id_fkey` ON `message`;

-- DropIndex
DROP INDEX `post_userId_fkey` ON `post`;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`postId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_parentCommentId_fkey` FOREIGN KEY (`parentCommentId`) REFERENCES `comment`(`commentId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `room`(`room_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_participant` ADD CONSTRAINT `chat_participant_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_participant` ADD CONSTRAINT `chat_participant_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `room`(`room_id`) ON DELETE CASCADE ON UPDATE CASCADE;
