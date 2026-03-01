-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "original" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_shortCode_key" ON "Link"("shortCode");
