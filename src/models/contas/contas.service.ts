import { ConflictException, Injectable } from '@nestjs/common';
import { NovaContaDto } from '@/models/contas/dtos/nova-conta.dto';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { ContaCriadaRetorno } from './presenters/conta-criada.retorno';

@Injectable()
export class ContasService {
  constructor(private readonly prismaService: PrismaService) {}

  async criaConta(novaContaDto: NovaContaDto): Promise<ContaCriadaRetorno> {
    const existeConta = await this.prismaService.conta.findUnique({
      where: {
        name: novaContaDto.name,
      },
    });

    if (existeConta) {
      throw new ConflictException('Account already exists');
    }

    const conta = await this.prismaService.conta.create({
      data: {
        name: novaContaDto.name,
      },
    });

    return new ContaCriadaRetorno(conta);
  }
}
