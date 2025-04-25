-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar_url" TEXT,
    "role" TEXT NOT NULL DEFAULT 'SELLER',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL COLLATE NOCASE,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city_code" TEXT,
    "name" TEXT NOT NULL COLLATE NOCASE,
    "trade_name" TEXT NOT NULL COLLATE NOCASE,
    "neighborhood" TEXT,
    "zip_code" TEXT,
    "city" TEXT NOT NULL COLLATE NOCASE,
    "area_code" TEXT,
    "phone" TEXT,
    "type" TEXT NOT NULL COLLATE NOCASE,
    "email" TEXT COLLATE NOCASE,
    "country" TEXT,
    "tax_id" TEXT COLLATE NOCASE,
    "opening_date" DATETIME,
    "homepage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "registration_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "store_id" INTEGER,
    CONSTRAINT "clients_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "stores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_code_key" ON "clients"("code");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_tax_id_key" ON "clients"("tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "stores_code_key" ON "stores"("code");
