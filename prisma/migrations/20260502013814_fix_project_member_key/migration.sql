/*
  Warnings:

  - The primary key for the `ProjectMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProjectMember` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ProjectMember_userId_projectId_key";

-- AlterTable
ALTER TABLE "ProjectMember" DROP CONSTRAINT "ProjectMember_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("userId", "projectId");
