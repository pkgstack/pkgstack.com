/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Revision` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Revision_name_key" ON "Revision"("name");
