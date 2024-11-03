import { ConflictException, Injectable } from '@nestjs/common';
import { NovaContaDto } from '@/models/contas/dtos/nova-conta.dto';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { ContaCriadaRetorno } from './retornos/conta-criada.retorno';
import { DepositoDto } from './dtos/deposito.dto';
import { MensagemPresenter } from '@/common/retornos/mensagem.retorno';

@Injectable()
export class ContasService {
  constructor(private readonly prismaService: PrismaService) {}

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

  async deposito(dto: DepositoDto) {
    await this.prismaService.conta.update({
      where: {
        numero: dto.numero,
      },
      data: {
        saldo: {
          increment: dto.valor,
        },
      },
    });

    return new MensagemPresenter('Depósito realizado com sucesso');
  }
}
