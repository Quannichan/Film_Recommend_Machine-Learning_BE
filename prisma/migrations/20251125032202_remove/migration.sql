/*
  Warnings:

  - You are about to drop the `CoutryPostSample` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GenrePostSample` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CoutryPostSample` DROP FOREIGN KEY `CoutryPostSample_countryId_fkey`;

-- DropForeignKey
ALTER TABLE `CoutryPostSample` DROP FOREIGN KEY `CoutryPostSample_postSampleId_fkey`;

-- DropForeignKey
ALTER TABLE `GenrePostSample` DROP FOREIGN KEY `GenrePostSample_genreId_fkey`;

-- DropForeignKey
ALTER TABLE `GenrePostSample` DROP FOREIGN KEY `GenrePostSample_postSampleId_fkey`;

-- DropTable
DROP TABLE `CoutryPostSample`;

-- DropTable
DROP TABLE `GenrePostSample`;
