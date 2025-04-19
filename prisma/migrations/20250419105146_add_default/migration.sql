-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "description" TEXT,
    "document_number" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "passedPercent" INTEGER NOT NULL DEFAULT 0,
    "failedPercent" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Question" ("date", "description", "document_number", "failedPercent", "id", "passedPercent", "text", "title") SELECT "date", "description", "document_number", coalesce("failedPercent", 0) AS "failedPercent", "id", coalesce("passedPercent", 0) AS "passedPercent", "text", "title" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
