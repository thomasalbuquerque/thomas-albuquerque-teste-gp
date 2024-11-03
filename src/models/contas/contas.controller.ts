import { Body, Controller, Post } from '@nestjs/common';
import { ContasService } from '@/models/contas/contas.service';
import { NovaContaDto } from '@/models/contas/dtos/nova-conta.dto';
import { ContaCriadaRetorno } from '@/models/contas/retornos/conta-criada.retorno';
import { DepositoDto } from './dtos/deposito.dto';
import { SaqueDto } from './dtos/saque.dto';
import { TransferenciaDto } from './dtos/transferencia.dto';

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

  @Post('saque')
  saque(@Body() saqueDto: SaqueDto): Promise<any> {
    return this.contasService.saque(saqueDto);
  }

  @Post('transferencia')
  transferencia(@Body() transferenciaDto: TransferenciaDto): Promise<any> {
    return this.contasService.transferencia(transferenciaDto);
  }
}
