-- CreateEnum
CREATE TYPE "voca_role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "voca_transaction_type" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'PURCHASE');

-- CreateEnum
CREATE TYPE "voca_transaction_status" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "voca_user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "voca_role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "voca_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voca_product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "voca_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voca_wallet" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "voca_wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voca_transaction" (
    "id" SERIAL NOT NULL,
    "walletId" INTEGER NOT NULL,
    "type" "voca_transaction_type" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "voca_transaction_status" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "voca_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voca_transaction_product" (
    "id" SERIAL NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "voca_transaction_product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "voca_user_email_key" ON "voca_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "voca_wallet_userId_key" ON "voca_wallet"("userId");

-- AddForeignKey
ALTER TABLE "voca_wallet" ADD CONSTRAINT "voca_wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "voca_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voca_transaction" ADD CONSTRAINT "voca_transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "voca_wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voca_transaction_product" ADD CONSTRAINT "voca_transaction_product_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "voca_transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voca_transaction_product" ADD CONSTRAINT "voca_transaction_product_productId_fkey" FOREIGN KEY ("productId") REFERENCES "voca_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
