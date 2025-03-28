-- CreateEnum
CREATE TYPE "ResponseType" AS ENUM ('RECIPE', 'INGREDIENT_SUBSTITUTION', 'NUTRITION_FACTS', 'EXPLANATION', 'SHOPPING_LIST');

-- CreateTable
CREATE TABLE "RecipeTrace" (
    "id" SERIAL NOT NULL,
    "traceId" CHAR(36) NOT NULL,
    "sessionId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "model" VARCHAR(50) NOT NULL,
    "response" TEXT NOT NULL,
    "postprocessed" TEXT,
    "temperature" DOUBLE PRECISION NOT NULL,
    "topP" DOUBLE PRECISION,
    "frequencyPenalty" DOUBLE PRECISION,
    "presencePenalty" DOUBLE PRECISION,
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "totalTokens" INTEGER,
    "responseTimeMs" INTEGER NOT NULL,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION,
    "responseType" "ResponseType",
    "userFeedback" TEXT,
    "errorTags" TEXT[],
    "autoEval" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipeTrace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeTrace_traceId_key" ON "RecipeTrace"("traceId");
