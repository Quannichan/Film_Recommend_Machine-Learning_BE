-- CreateTable
CREATE TABLE `PostSampleFavourites` (
    `userId` INTEGER NOT NULL,
    `postSampleId` INTEGER NOT NULL,

    INDEX `SamplePostFavourites_userId_fkey`(`userId`),
    INDEX `SamplePostFavourites_postSampleId_fkey`(`postSampleId`),
    PRIMARY KEY (`userId`, `postSampleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `CountryPost_countryId_fkey` ON `CoutryPostSample`(`countryId`);

-- CreateIndex
CREATE INDEX `CountryPost_genreId_fkey` ON `GenrePostSample`(`genreId`);

-- AddForeignKey
ALTER TABLE `PostSampleFavourites` ADD CONSTRAINT `PostSampleFavourites_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostSampleFavourites` ADD CONSTRAINT `PostSampleFavourites_postSampleId_fkey` FOREIGN KEY (`postSampleId`) REFERENCES `PostSample`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
