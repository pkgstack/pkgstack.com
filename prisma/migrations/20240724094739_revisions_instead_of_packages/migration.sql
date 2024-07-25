/*
  Warnings:

  - You are about to drop the `Package` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `packageId` on the `Revision` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Revision` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Revision` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Revision` table without a default value. This is not possible if the table is not empty.
  - Added the required column `license` to the `Revision` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Revision` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Package_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Package";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_RevisionDependencies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RevisionDependencies_A_fkey" FOREIGN KEY ("A") REFERENCES "Revision" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RevisionDependencies_B_fkey" FOREIGN KEY ("B") REFERENCES "Revision" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_RevisionDevDependencies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RevisionDevDependencies_A_fkey" FOREIGN KEY ("A") REFERENCES "Revision" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RevisionDevDependencies_B_fkey" FOREIGN KEY ("B") REFERENCES "Revision" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Maintainer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Maintainer_A_fkey" FOREIGN KEY ("A") REFERENCES "Revision" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Maintainer_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Revision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "version" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "downloads" INTEGER NOT NULL,
    "downloadsLastMonth" INTEGER NOT NULL,
    "repository" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Revision_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Revision" ("createdAt", "downloads", "downloadsLastMonth", "id", "repository", "size", "updatedAt", "version") SELECT "createdAt", "downloads", "downloadsLastMonth", "id", "repository", "size", "updatedAt", "version" FROM "Revision";
DROP TABLE "Revision";
ALTER TABLE "new_Revision" RENAME TO "Revision";
CREATE INDEX "RevisionVersion" ON "Revision"("version");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_RevisionDependencies_AB_unique" ON "_RevisionDependencies"("A", "B");

-- CreateIndex
CREATE INDEX "_RevisionDependencies_B_index" ON "_RevisionDependencies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RevisionDevDependencies_AB_unique" ON "_RevisionDevDependencies"("A", "B");

-- CreateIndex
CREATE INDEX "_RevisionDevDependencies_B_index" ON "_RevisionDevDependencies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Maintainer_AB_unique" ON "_Maintainer"("A", "B");

-- CreateIndex
CREATE INDEX "_Maintainer_B_index" ON "_Maintainer"("B");
