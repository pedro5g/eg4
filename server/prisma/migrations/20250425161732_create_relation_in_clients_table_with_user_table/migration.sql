/*
  Warnings:

  - Added the required column `author_id` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_clients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city_code" TEXT,
    "name" TEXT NOT NULL,
    "trade_name" TEXT NOT NULL,
    "neighborhood" TEXT,
    "zip_code" TEXT,
    "city" TEXT NOT NULL,
    "area_code" TEXT,
    "phone" TEXT,
    "type" TEXT NOT NULL,
    "email" TEXT,
    "country" TEXT,
    "tax_id" TEXT,
    "opening_date" TEXT,
    "homepage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "registration_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "store_id" INTEGER,
    "author_id" TEXT NOT NULL,
    CONSTRAINT "clients_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "clients_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_clients" ("address", "area_code", "city", "city_code", "code", "country", "email", "homepage", "id", "name", "neighborhood", "opening_date", "phone", "registration_date", "state", "status", "store_id", "tax_id", "trade_name", "type", "zip_code") SELECT "address", "area_code", "city", "city_code", "code", "country", "email", "homepage", "id", "name", "neighborhood", "opening_date", "phone", "registration_date", "state", "status", "store_id", "tax_id", "trade_name", "type", "zip_code" FROM "clients";
DROP TABLE "clients";
ALTER TABLE "new_clients" RENAME TO "clients";
CREATE UNIQUE INDEX "clients_code_key" ON "clients"("code");
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");
CREATE UNIQUE INDEX "clients_tax_id_key" ON "clients"("tax_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
