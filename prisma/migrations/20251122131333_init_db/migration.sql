-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `descript` LONGTEXT NULL,
    `sex` INTEGER NOT NULL DEFAULT 1,
    `mail` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `ava` VARCHAR(191) NULL,
    `pass` VARCHAR(191) NULL,
    `role` INTEGER NOT NULL,
    `date01` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date02` DATETIME(3) NULL,
    `accountType` INTEGER NULL,
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `verifyToken` VARCHAR(255) NULL,
    `profile_v` JSON NULL,

    UNIQUE INDEX `User_mail_key`(`mail`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostSample` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `img` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `descript` VARCHAR(191) NULL,
    `date01` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date02` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Country` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NULL,
    `data01` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date02` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Genre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NULL,
    `data01` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date02` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoutryPostSample` (
    `postSampleId` INTEGER NOT NULL,
    `countryId` INTEGER NOT NULL,

    INDEX `CountryPost_postsampleId_fkey`(`postSampleId`),
    PRIMARY KEY (`countryId`, `postSampleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GenrePostSample` (
    `postSampleId` INTEGER NOT NULL,
    `genreId` INTEGER NOT NULL,

    INDEX `CountryPost_postsampleId_fkey`(`postSampleId`),
    PRIMARY KEY (`genreId`, `postSampleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `iduser` INTEGER NULL,
    `idPostSample` INTEGER NULL,
    `stars` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `date01` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date02` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CoutryPostSample` ADD CONSTRAINT `CoutryPostSample_postSampleId_fkey` FOREIGN KEY (`postSampleId`) REFERENCES `PostSample`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoutryPostSample` ADD CONSTRAINT `CoutryPostSample_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenrePostSample` ADD CONSTRAINT `GenrePostSample_postSampleId_fkey` FOREIGN KEY (`postSampleId`) REFERENCES `PostSample`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenrePostSample` ADD CONSTRAINT `GenrePostSample_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_iduser_fkey` FOREIGN KEY (`iduser`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_idPostSample_fkey` FOREIGN KEY (`idPostSample`) REFERENCES `PostSample`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
