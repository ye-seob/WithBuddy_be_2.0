-- CreateTable
CREATE TABLE `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `student_id` BIGINT NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `pin` VARCHAR(255) NOT NULL,
    `major` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personal_match` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `senior_id` BIGINT NOT NULL,
    `junior_id` BIGINT NOT NULL,
    `matchedAt` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
