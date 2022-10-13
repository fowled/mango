/*
  Warnings:

  - You are about to alter the column `birthdayTimestamp` on the `Birthdays` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ranks" (
    "idOfUser" TEXT NOT NULL,
    "xp" INTEGER NOT NULL,
    "idOfGuild" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);
INSERT INTO "new_Ranks" ("id", "idOfGuild", "idOfUser", "xp") SELECT "id", "idOfGuild", "idOfUser", "xp" FROM "Ranks";
DROP TABLE "Ranks";
ALTER TABLE "new_Ranks" RENAME TO "Ranks";
CREATE UNIQUE INDEX "Ranks_id_key" ON "Ranks"("id");
CREATE TABLE "new_Birthdays" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idOfUser" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "birthdayTimestamp" BIGINT NOT NULL,
    "idOfGuild" TEXT NOT NULL
);
INSERT INTO "new_Birthdays" ("birthday", "birthdayTimestamp", "id", "idOfGuild", "idOfUser") SELECT "birthday", "birthdayTimestamp", "id", "idOfGuild", "idOfUser" FROM "Birthdays";
DROP TABLE "Birthdays";
ALTER TABLE "new_Birthdays" RENAME TO "Birthdays";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
