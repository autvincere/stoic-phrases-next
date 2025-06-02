/*
  Warnings:

  - You are about to drop the `Phrase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Phrase";

-- CreateTable
CREATE TABLE "Phrases" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "phrase" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Phrases_pkey" PRIMARY KEY ("id")
);
