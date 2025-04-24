/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `stores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "stores_code_key" ON "stores"("code");
