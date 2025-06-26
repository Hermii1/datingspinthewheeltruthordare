-- CreateTable
CREATE TABLE "truth_questions" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "rating" VARCHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "truth_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dare_questions" (
    "id" SERIAL NOT NULL,
    "challenge" TEXT NOT NULL,
    "rating" VARCHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dare_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_submitted_questions" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "content" TEXT NOT NULL,
    "rating" VARCHAR(10),
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_submitted_questions_pkey" PRIMARY KEY ("id")
);
