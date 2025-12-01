/*
  Warnings:

  - You are about to drop the `CoutryPostSample` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CoutryPostSample` DROP FOREIGN KEY `CoutryPostSample_countryId_fkey`;

-- DropForeignKey
ALTER TABLE `CoutryPostSample` DROP FOREIGN KEY `CoutryPostSample_postSampleId_fkey`;

-- DropTable
DROP TABLE `CoutryPostSample`;

-- CreateTable
CREATE TABLE `CountryPostSample` (
    `postSampleId` INTEGER NOT NULL,
    `countryId` INTEGER NOT NULL,

    PRIMARY KEY (`countryId`, `postSampleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CountryPostSample` ADD CONSTRAINT `CountryPostSample_postSampleId_fkey` FOREIGN KEY (`postSampleId`) REFERENCES `PostSample`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryPostSample` ADD CONSTRAINT `CountryPostSample_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
