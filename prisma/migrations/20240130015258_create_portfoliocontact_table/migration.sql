-- CreateTable
CREATE TABLE "PortfolioContact" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "hear_about_us" TEXT NOT NULL,
    "about_project" TEXT NOT NULL,
    "way_of_contact" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioContact_pkey" PRIMARY KEY ("id")
);
