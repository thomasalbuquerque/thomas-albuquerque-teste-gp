import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { Queues } from '@/common/queues/queues.enum';
import { Jobs } from '@/common/queues/jobs.enum';
import { DepositoStatus } from '@prisma/client';

export type DadosDeDeposito = {
  depositoId: number;
};

@Processor(Queues.DEPOSITO)
export class DepositoConsumidor {
  constructor(private readonly prismaService: PrismaService) {}

  @Process(Jobs.DEPOSITO)
  async processaDeposito({ data }: Job<DadosDeDeposito>): Promise<void> {
    const deposito = await this.prismaService.deposito.findUnique({
      where: {
        id: data.depositoId,
      },
      select: {
        valor: true,
        conta: {
          select: {
            numero: true,
          },
        },
      },
    });

    await this.prismaService.$transaction([
      this.prismaService.conta.update({
        where: {
          numero: deposito.conta.numero,
        },
        data: {
          saldo: {
            increment: deposito.valor,
          },
        },
      }),
      this.prismaService.deposito.update({
        where: {
          id: data.depositoId,
        },
        data: {
          status: DepositoStatus.CONCLUIDO,
        },
      }),
    ]);
  }
}
