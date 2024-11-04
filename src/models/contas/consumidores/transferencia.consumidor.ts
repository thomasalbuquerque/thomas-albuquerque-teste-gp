import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { Queues } from '@/common/queues/queues.enum';
import { Jobs } from '@/common/queues/jobs.enum';
import { SaqueStatus } from '@prisma/client';

export type DadosDeSaque = {
  transferenciaId: number;
};

@Processor(Queues.TRANSFERENCIA)
export class TransferenciaConsumidor {
  constructor(private readonly prismaService: PrismaService) {}

  @Process(Jobs.TRANSFERENCIA)
  async processaSaque({ data }: Job<DadosDeSaque>): Promise<void> {
    const transferencia = await this.prismaService.transferencia.findUnique({
      where: {
        id: data.transferenciaId,
      },
      select: {
        valor: true,
        contaOrigem: {
          select: {
            numero: true,
          },
        },
        contaDestino: {
          select: {
            numero: true,
          },
        },
      },
    });

    await this.prismaService.$transaction([
      this.prismaService.conta.update({
        where: {
          numero: transferencia.contaOrigem.numero,
        },
        data: {
          saldo: {
            decrement: transferencia.valor,
          },
        },
      }),
      this.prismaService.conta.update({
        where: {
          numero: transferencia.contaDestino.numero,
        },
        data: {
          saldo: {
            increment: transferencia.valor,
          },
        },
      }),
      this.prismaService.transferencia.update({
        where: {
          id: data.transferenciaId,
        },
        data: {
          status: SaqueStatus.CONCLUIDO,
        },
      }),
    ]);
  }
}
