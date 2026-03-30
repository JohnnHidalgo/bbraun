-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "azureId" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
