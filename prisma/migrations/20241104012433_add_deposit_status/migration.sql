/*
  Warnings:

  - Added the required column `status` to the `depositos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DepositoStatus" AS ENUM ('PENDENTE', 'CONCLUIDO');

-- AlterTable
ALTER TABLE "depositos" ADD COLUMN     "status" "DepositoStatus" NOT NULL;
