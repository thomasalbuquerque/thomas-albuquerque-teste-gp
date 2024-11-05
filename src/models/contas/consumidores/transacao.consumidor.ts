import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { Queues } from '@/common/queues/queues.enum';
import { Jobs } from '@/common/queues/jobs.enum';
import { StatusTransacao } from '@prisma/client';

export type DadosDeDeposito = {
  depositoId: number;
};

export type DadosDeSaque = {
  saqueId: number;
};

export type DadosDeTransferencia = {
  transferenciaId: number;
};

@Processor(Queues.TRANSACAO)
export class TransacaoConsumidor {
  constructor(private readonly prismaService: PrismaService) {}

  @Process(Jobs.DEPOSITO)
  async processaDeposito({ data }: Job<DadosDeDeposito>): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const deposito = await this.prismaService.transacao.findUnique({
      where: {
        id: data.depositoId,
      },
      select: {
        valor: true,
        contaOrigem: {
          select: {
            numero: true,
          },
        },
      },
    });

    await this.prismaService.$transaction([
      this.prismaService.conta.update({
        where: {
          numero: deposito.contaOrigem.numero,
        },
        data: {
          saldo: {
            increment: deposito.valor,
          },
        },
      }),
      this.prismaService.transacao.update({
        where: {
          id: data.depositoId,
        },
        data: {
          status: StatusTransacao.CONCLUIDO,
        },
      }),
    ]);
  }

  @Process(Jobs.SAQUE)
  async processaSaque({ data }: Job<DadosDeSaque>): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const saque = await this.prismaService.transacao.findUnique({
      where: {
        id: data.saqueId,
      },
      select: {
        valor: true,
        contaOrigem: {
          select: {
            numero: true,
          },
        },
      },
    });

    await this.prismaService.$transaction([
      this.prismaService.conta.update({
        where: {
          numero: saque.contaOrigem.numero,
        },
        data: {
          saldo: {
            decrement: saque.valor,
          },
        },
      }),
      this.prismaService.transacao.update({
        where: {
          id: data.saqueId,
        },
        data: {
          status: StatusTransacao.CONCLUIDO,
        },
      }),
    ]);
  }

  @Process(Jobs.TRANSFERENCIA)
  async processaTransferencia({
    data,
  }: Job<DadosDeTransferencia>): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const transferencia = await this.prismaService.transacao.findUnique({
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
      this.prismaService.transacao.update({
        where: {
          id: data.transferenciaId,
        },
        data: {
          status: StatusTransacao.CONCLUIDO,
        },
      }),
    ]);
  }
}
