-- AlterTable
ALTER TABLE "User" ALTER COLUMN "allergies" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "preferences" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "countryCode" SET DEFAULT 'US',
ALTER COLUMN "region" DROP NOT NULL;
