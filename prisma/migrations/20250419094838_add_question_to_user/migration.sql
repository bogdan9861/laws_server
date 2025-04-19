-- AlterTable
ALTER TABLE "users" ADD COLUMN "questionId" INTEGER;

-- CreateTable
CREATE TABLE "chats_to_users" (
    "questionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("questionId", "userId"),
    CONSTRAINT "chats_to_users_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "chats_to_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
