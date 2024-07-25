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
    "language" TEXT,
    "description" TEXT,
    "license" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Revision_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Revision" ("authorId", "createdAt", "description", "downloads", "downloadsLastMonth", "id", "language", "license", "name", "repository", "size", "updatedAt", "version") SELECT "authorId", "createdAt", "description", "downloads", "downloadsLastMonth", "id", "language", "license", "name", "repository", "size", "updatedAt", "version" FROM "Revision";
DROP TABLE "Revision";
ALTER TABLE "new_Revision" RENAME TO "Revision";
CREATE INDEX "RevisionVersion" ON "Revision"("version");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
