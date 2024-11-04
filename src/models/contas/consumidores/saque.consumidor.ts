import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { Queues } from '@/common/queues/queues.enum';
import { Jobs } from '@/common/queues/jobs.enum';
import { SaqueStatus } from '@prisma/client';

export type DadosDeSaque = {
  saqueId: number;
};

@Processor(Queues.SAQUE)
export class SaqueConsumidor {
  constructor(private readonly prismaService: PrismaService) {}

  @Process(Jobs.SAQUE)
  async processaSaque({ data }: Job<DadosDeSaque>): Promise<void> {
    const saque = await this.prismaService.saque.findUnique({
      where: {
        id: data.saqueId,
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
          numero: saque.conta.numero,
        },
        data: {
          saldo: {
            decrement: saque.valor,
          },
        },
      }),
      this.prismaService.saque.update({
        where: {
          id: data.saqueId,
        },
        data: {
          status: SaqueStatus.CONCLUIDO,
        },
      }),
    ]);
  }
}
