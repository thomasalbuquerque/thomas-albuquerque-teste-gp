/*
  Warnings:

  - You are about to drop the `depositos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `saques` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transferencias` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusTransacao" AS ENUM ('PENDENTE', 'CONCLUIDO');

-- DropForeignKey
ALTER TABLE "depositos" DROP CONSTRAINT "depositos_contaId_fkey";

-- DropForeignKey
ALTER TABLE "saques" DROP CONSTRAINT "saques_contaId_fkey";

-- DropForeignKey
ALTER TABLE "transferencias" DROP CONSTRAINT "transferencias_contaDestinoId_fkey";

-- DropForeignKey
ALTER TABLE "transferencias" DROP CONSTRAINT "transferencias_contaOrigemId_fkey";

-- DropTable
DROP TABLE "depositos";

-- DropTable
DROP TABLE "saques";

-- DropTable
DROP TABLE "transferencias";

-- DropEnum
DROP TYPE "DepositoStatus";

-- DropEnum
DROP TYPE "SaqueStatus";

-- DropEnum
DROP TYPE "TransferenciaStatus";

-- CreateTable
CREATE TABLE "Transacao" (
    "id" SERIAL NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "tipo" "TipoTransacao" NOT NULL,
    "status" "StatusTransacao" NOT NULL,
    "contaOrigemId" INTEGER NOT NULL,
    "contaDestinoId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_contaOrigemId_fkey" FOREIGN KEY ("contaOrigemId") REFERENCES "contas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_contaDestinoId_fkey" FOREIGN KEY ("contaDestinoId") REFERENCES "contas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
