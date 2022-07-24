/*
  Warnings:

  - Added the required column `lastEdited` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "lastEdited" DATETIME NOT NULL
);
INSERT INTO "new_Session" ("data", "expiresAt", "id", "sid") SELECT "data", "expiresAt", "id", "sid" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
