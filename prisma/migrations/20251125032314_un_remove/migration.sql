-- CreateTable
CREATE TABLE `CoutryPostSample` (
    `postSampleId` INTEGER NOT NULL,
    `countryId` INTEGER NOT NULL,

    PRIMARY KEY (`countryId`, `postSampleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GenrePostSample` (
    `postSampleId` INTEGER NOT NULL,
    `genreId` INTEGER NOT NULL,

    PRIMARY KEY (`genreId`, `postSampleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CoutryPostSample` ADD CONSTRAINT `CoutryPostSample_postSampleId_fkey` FOREIGN KEY (`postSampleId`) REFERENCES `PostSample`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoutryPostSample` ADD CONSTRAINT `CoutryPostSample_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenrePostSample` ADD CONSTRAINT `GenrePostSample_postSampleId_fkey` FOREIGN KEY (`postSampleId`) REFERENCES `PostSample`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenrePostSample` ADD CONSTRAINT `GenrePostSample_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
