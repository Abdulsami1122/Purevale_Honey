/*
  Warnings:

  - You are about to drop the column `userId` on the `Testimonial` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Testimonial" DROP CONSTRAINT "Testimonial_userId_fkey";

-- DropIndex
DROP INDEX "Testimonial_userId_key";

-- AlterTable
ALTER TABLE "Testimonial" DROP COLUMN "userId",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Testimonial_sortOrder_idx" ON "Testimonial"("sortOrder");
