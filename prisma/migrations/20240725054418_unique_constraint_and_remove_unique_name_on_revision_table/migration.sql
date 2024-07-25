/*
  Warnings:

  - A unique constraint covering the columns `[version,name]` on the table `Revision` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Revision_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Revision_version_name_key" ON "Revision"("version", "name");
