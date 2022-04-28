/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `MarketItems` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MarketItems_id_key" ON "MarketItems"("id");
