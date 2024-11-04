/*
  Warnings:

  - Added the required column `status` to the `saques` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `transferencias` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SaqueStatus" AS ENUM ('PENDENTE', 'CONCLUIDO');

-- CreateEnum
CREATE TYPE "TransferenciaStatus" AS ENUM ('PENDENTE', 'CONCLUIDO');

-- AlterTable
ALTER TABLE "saques" ADD COLUMN     "status" "SaqueStatus" NOT NULL;

-- AlterTable
ALTER TABLE "transferencias" ADD COLUMN     "status" "TransferenciaStatus" NOT NULL;
