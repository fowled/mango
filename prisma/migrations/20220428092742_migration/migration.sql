-- CreateTable
CREATE TABLE "Birthdays" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idOfUser" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "birthdayTimestamp" INTEGER NOT NULL,
    "idOfGuild" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BirthdaysChannels" (
    "idOfGuild" TEXT NOT NULL,
    "idOfChannel" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "InventoryItems" (
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "sellerID" TEXT NOT NULL,
    "authorID" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "LogChannels" (
    "idOfGuild" TEXT NOT NULL,
    "idOfChannel" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "WelChannels" (
    "idOfGuild" TEXT NOT NULL,
    "idOfChannel" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MarketItems" (
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "sellerID" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "MoneyAccs" (
    "idOfUser" TEXT NOT NULL,
    "money" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Ranks" (
    "idOfUser" TEXT NOT NULL,
    "xp" INTEGER NOT NULL,
    "idOfGuild" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BirthdaysChannels_idOfGuild_key" ON "BirthdaysChannels"("idOfGuild");

-- CreateIndex
CREATE UNIQUE INDEX "BirthdaysChannels_idOfChannel_key" ON "BirthdaysChannels"("idOfChannel");

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_inventoryItems_1" ON "InventoryItems"("name");
Pragma writable_schema=0;

-- CreateIndex
CREATE UNIQUE INDEX "LogChannels_idOfGuild_key" ON "LogChannels"("idOfGuild");

-- CreateIndex
CREATE UNIQUE INDEX "LogChannels_idOfChannel_key" ON "LogChannels"("idOfChannel");

-- CreateIndex
CREATE UNIQUE INDEX "WelChannels_idOfGuild_key" ON "WelChannels"("idOfGuild");

-- CreateIndex
CREATE UNIQUE INDEX "WelChannels_idOfChannel_key" ON "WelChannels"("idOfChannel");

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_marketItems_1" ON "MarketItems"("name");
Pragma writable_schema=0;

-- CreateIndex
CREATE UNIQUE INDEX "MoneyAccs_idOfUser_key" ON "MoneyAccs"("idOfUser");

-- CreateIndex
CREATE UNIQUE INDEX "Ranks_idOfUser_key" ON "Ranks"("idOfUser");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");
