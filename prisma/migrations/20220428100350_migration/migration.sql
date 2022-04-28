/*
  Warnings:

  - You are about to alter the column `price` on the `InventoryItems` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InventoryItems" (
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "sellerID" TEXT NOT NULL,
    "authorID" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);
INSERT INTO "new_InventoryItems" ("authorID", "id", "name", "price", "sellerID") SELECT "authorID", "id", "name", "price", "sellerID" FROM "InventoryItems";
DROP TABLE "InventoryItems";
ALTER TABLE "new_InventoryItems" RENAME TO "InventoryItems";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_inventoryItems_1" ON "InventoryItems"("name");
Pragma writable_schema=0;
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
