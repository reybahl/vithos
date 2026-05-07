-- CreateTable
CREATE TABLE "click_counter" (
    "id" INTEGER NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "click_counter_pkey" PRIMARY KEY ("id")
);
