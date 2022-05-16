-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ranks" (
    "idOfUser" TEXT NOT NULL,
    "xp" INTEGER NOT NULL,
    "idOfGuild" INTEGER NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);
INSERT INTO "new_Ranks" ("idOfGuild", "idOfUser", "xp") SELECT "idOfGuild", "idOfUser", "xp" FROM "Ranks";
DROP TABLE "Ranks";
ALTER TABLE "new_Ranks" RENAME TO "Ranks";
CREATE UNIQUE INDEX "Ranks_id_key" ON "Ranks"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
