/*
  Warnings:

  - You are about to drop the `RecipeTrace` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "RecipeTrace";

-- CreateTable
CREATE TABLE "recipe_traces" (
    "id" SERIAL NOT NULL,
    "traceId" CHAR(36) NOT NULL,
    "sessionId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "promptUrl" TEXT,
    "model" VARCHAR(50) NOT NULL,
    "response" TEXT NOT NULL,
    "responseUrl" TEXT,
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

    CONSTRAINT "recipe_traces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recipe_traces_traceId_key" ON "recipe_traces"("traceId");
