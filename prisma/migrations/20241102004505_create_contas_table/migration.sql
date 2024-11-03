-- CreateTable
CREATE TABLE "contas" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "saldo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contas_numero_key" ON "contas"("numero");
