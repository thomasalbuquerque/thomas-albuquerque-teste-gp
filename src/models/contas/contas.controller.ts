import { Body, Controller, Post } from '@nestjs/common';
import { ContasService } from '@/models/contas/contas.service';
import { NovaContaDto } from '@/models/contas/dtos/nova-conta.dto';
import { ContaCriadaRetorno } from '@/models/contas/retornos/conta-criada.retorno';
import { DepositoDto } from './dtos/deposito.dto';

@Controller('contas')
export class ContasController {
  constructor(private readonly contasService: ContasService) {}

  @Post()
  criaConta(@Body() novaContaDto: NovaContaDto): Promise<ContaCriadaRetorno> {
    return this.contasService.criaConta(novaContaDto);
  }

  @Post('deposito')
  deposito(@Body() depositoDto: DepositoDto): Promise<any> {
    return this.contasService.deposito(depositoDto);
  }
}
