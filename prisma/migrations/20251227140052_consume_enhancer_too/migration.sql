-- CreateTable
CREATE TABLE "PromptUsage" (
    "userId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PromptUsage_pkey" PRIMARY KEY ("userId")
);
