import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NovaContaDto } from '@/models/contas/dtos/nova-conta.dto';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { DepositoDto } from './dtos/deposito.dto';
import { SaqueDto } from './dtos/saque.dto';
import { TransferenciaDto } from './dtos/transferencia.dto';
import { TransacaoProdutor } from './produtores/transacao.produtor';
import { StatusTransacao, TipoTransacao } from '@prisma/client';
import { TransacaoRetorno } from './retornos/transacao.retorno';
import { ContaRetorno } from './retornos/conta.retorno';

@Injectable()
export class ContasService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly transacaoProdutor: TransacaoProdutor,
  ) {}

  async criaConta(novaContaDto: NovaContaDto): Promise<ContaRetorno> {
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

    return new ContaRetorno(conta);
  }

  async encontraContaPeloNumero(numero: number) {
    const conta = await this.prismaService.conta.findUnique({
      where: {
        numero: numero,
      },
    });

    if (!conta) {
      throw new NotFoundException('Conta não encontrada');
    }

    return new ContaRetorno(conta);
  }

  async criaDeposito(dto: DepositoDto) {
    const conta = await this.prismaService.conta.findUnique({
      where: {
        numero: dto.numero,
      },
    });

    if (!conta) {
      throw new NotFoundException('Conta não encontrada');
    }

    const deposito = await this.prismaService.transacao.create({
      data: {
        contaOrigem: {
          connect: {
            numero: dto.numero,
          },
        },
        valor: dto.valor,
        tipo: TipoTransacao.DEPOSITO,
        status: StatusTransacao.PENDENTE,
      },
      include: {
        contaOrigem: true,
      },
    });

    await this.transacaoProdutor.addDepositoJob({
      depositoId: deposito.id,
    });

    return new TransacaoRetorno(deposito);
  }

  async encontraDeposito(id: number) {
    const deposito = await this.prismaService.transacao.findUnique({
      where: {
        id,
        tipo: TipoTransacao.DEPOSITO,
      },
      include: {
        contaOrigem: true,
      },
    });

    if (!deposito) {
      throw new NotFoundException('Depósito não encontrado');
    }

    return new TransacaoRetorno(deposito);
  }

  async criaSaque(dto: SaqueDto) {
    const conta = await this.prismaService.conta.findUnique({
      where: {
        numero: dto.numero,
      },
    });

    if (!conta) {
      throw new NotFoundException('Conta não encontrada');
    }

    if (conta.saldo.lessThan(dto.valor)) {
      throw new BadRequestException('Saldo insuficiente');
    }

    const saque = await this.prismaService.transacao.create({
      data: {
        contaOrigem: {
          connect: {
            numero: dto.numero,
          },
        },
        valor: dto.valor,
        tipo: TipoTransacao.SAQUE,
        status: StatusTransacao.PENDENTE,
      },
    });

    await this.transacaoProdutor.addSaqueJob({
      saqueId: saque.id,
    });

    return new TransacaoRetorno(saque);
  }

  async encontraSaque(id: number) {
    const saque = await this.prismaService.transacao.findUnique({
      where: {
        id,
        tipo: TipoTransacao.SAQUE,
      },
    });

    if (!saque) {
      throw new NotFoundException('Saque não encontrado');
    }

    return new TransacaoRetorno(saque);
  }

  async criaTransferencia(dto: TransferenciaDto) {
    const contaOrigem = await this.prismaService.conta.findUnique({
      where: {
        numero: dto.origem,
      },
    });

    if (!contaOrigem) {
      throw new NotFoundException('Conta de origem não encontrada');
    }

    if (contaOrigem.saldo.lessThan(dto.valor)) {
      throw new BadRequestException('Saldo insuficiente');
    }

    const contaDestino = await this.prismaService.conta.findUnique({
      where: {
        numero: dto.destino,
      },
    });

    if (!contaDestino) {
      throw new NotFoundException('Conta de destino não encontrada');
    }

    const transferencia = await this.prismaService.transacao.create({
      data: {
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
        valor: dto.valor,
        tipo: TipoTransacao.TRANSFERENCIA,
        status: StatusTransacao.PENDENTE,
      },
      include: {
        contaOrigem: true,
        contaDestino: true,
      },
    });

    await this.transacaoProdutor.addTransferenciaJob({
      transferenciaId: transferencia.id,
    });

    return new TransacaoRetorno(transferencia);
  }

  async encontraTransferencia(id: number) {
    const transferencia = await this.prismaService.transacao.findUnique({
      where: {
        id,
        tipo: TipoTransacao.TRANSFERENCIA,
      },
      include: {
        contaOrigem: true,
        contaDestino: true,
      },
    });

    if (!transferencia) {
      throw new NotFoundException('Transferência não encontrada');
    }

    return new TransacaoRetorno(transferencia);
  }

  async saidas(numero: number) {
    const contaEsaidas = await this.prismaService.conta.findUnique({
      where: {
        numero: numero,
      },
      include: {
        transacosDeSaida: true,
      },
    });

    return new ContaRetorno(contaEsaidas);
  }

  async entradas(numero: number) {
    const contaEentradas = await this.prismaService.conta.findUnique({
      where: {
        numero: numero,
      },
      include: {
        transacoesDeEntrada: true,
      },
    });

    return new ContaRetorno(contaEentradas);
  }
}
