/*
  Warnings:

  - Added the required column `room_type` to the `room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `room` ADD COLUMN `room_type` ENUM('INDIVIDUAL', 'GROUP') NOT NULL;
