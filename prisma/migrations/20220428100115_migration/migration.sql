/*
  Warnings:

  - You are about to alter the column `price` on the `MarketItems` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MarketItems" (
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "sellerID" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);
INSERT INTO "new_MarketItems" ("id", "name", "price", "sellerID") SELECT "id", "name", "price", "sellerID" FROM "MarketItems";
DROP TABLE "MarketItems";
ALTER TABLE "new_MarketItems" RENAME TO "MarketItems";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_marketItems_1" ON "MarketItems"("name");
Pragma writable_schema=0;
CREATE UNIQUE INDEX "MarketItems_id_key" ON "MarketItems"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
