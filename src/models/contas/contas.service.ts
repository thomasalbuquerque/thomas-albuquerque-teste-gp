import { ConflictException, Injectable } from '@nestjs/common';
import { NovaContaDto } from '@/models/contas/dtos/nova-conta.dto';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { ContaCriadaRetorno } from './retornos/conta-criada.retorno';
import { DepositoDto } from './dtos/deposito.dto';
import { MensagemPresenter } from '@/common/retornos/mensagem.retorno';
import { SaqueDto } from './dtos/saque.dto';
import { TransferenciaDto } from './dtos/transferencia.dto';
import { DepositoProdutor } from './produtores/deposito.produtor';
import {
  DepositoStatus,
  SaqueStatus,
  TransferenciaStatus,
} from '@prisma/client';
import { DepositoRetorno } from './retornos/deposito.retorno';
import { SaqueProdutor } from './produtores/saque.produtor';
import { SaqueRetorno } from './retornos/saque.retorno';

@Injectable()
export class ContasService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly depositoProdutor: DepositoProdutor,
    private readonly saqueProdutor: SaqueProdutor,
  ) {}

  async criaConta(novaContaDto: NovaContaDto): Promise<ContaCriadaRetorno> {
    const existeConta = await this.prismaService.conta.findUnique({
      where: {
        numero: novaContaDto.numero,
      },
    });

    if (existeConta) {
      throw new ConflictException('Já existe uma conta com esse número');
    }

    const conta = await this.prismaService.conta.create({
      data: {
        numero: novaContaDto.numero,
        saldo: novaContaDto.saldo,
      },
    });

    return new ContaCriadaRetorno(conta);
  }

  async criaDeposito(dto: DepositoDto) {
    const deposito = await this.prismaService.deposito.create({
      data: {
        conta: {
          connect: {
            numero: dto.numero,
          },
        },
        valor: dto.valor,
        status: DepositoStatus.PENDENTE,
      },
    });

    await this.depositoProdutor.add({
      depositoId: deposito.id,
    });

    return new DepositoRetorno(deposito);
  }

  async encontraDeposito(id: number) {
    const deposito = await this.prismaService.deposito.findUnique({
      where: {
        id: id,
      },
    });

    if (!deposito) {
      throw new ConflictException('Depósito não encontrado');
    }

    return new DepositoRetorno(deposito);
  }

  async criaSaque(dto: SaqueDto) {
    const saque = await this.prismaService.saque.create({
      data: {
        conta: {
          connect: {
            numero: dto.numero,
          },
        },
        valor: dto.valor,
        status: SaqueStatus.PENDENTE,
      },
    });

    await this.saqueProdutor.add({
      saqueId: saque.id,
    });

    return new SaqueRetorno(saque);
  }

  async encontraSaque(id: number) {
    const saque = await this.prismaService.saque.findUnique({
      where: {
        id: id,
      },
    });

    if (!saque) {
      throw new ConflictException('Saque não encontrado');
    }

    return new SaqueRetorno(saque);
  }

  async transferencia(dto: TransferenciaDto) {
    await this.prismaService.$transaction([
      this.prismaService.conta.update({
        where: {
          numero: dto.origem,
        },
        data: {
          saldo: {
            decrement: dto.valor,
          },
        },
      }),
      this.prismaService.conta.update({
        where: {
          numero: dto.destino,
        },
        data: {
          saldo: {
            increment: dto.valor,
          },
        },
      }),
      this.prismaService.transferencia.create({
        data: {
          valor: dto.valor,
          contaOrigem: {
            connect: {
              numero: dto.origem,
            },
          },
          contaDestino: {
            connect: {
              numero: dto.destino,
            },
          },
          status: TransferenciaStatus.PENDENTE,
        },
      }),
    ]);

    return new MensagemPresenter('Transferência realizada com sucesso');
  }

  async encontraContaPeloNumero(numero: number) {
    return this.prismaService.conta.findUnique({
      where: {
        numero: numero,
      },
    });
  }

  async saidas(numero: number) {
    return this.prismaService.conta.findUnique({
      where: {
        numero: numero,
      },
      include: {
        transferenciasDeSaida: true,
      },
    });
  }

  async entradas(numero: number) {
    return this.prismaService.conta.findUnique({
      where: {
        numero: numero,
      },
      include: {
        transferenciasDeEntrada: true,
      },
    });
  }
}
