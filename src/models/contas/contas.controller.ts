import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ContasService } from '@/models/contas/contas.service';
import { NovaContaDto } from '@/models/contas/dtos/nova-conta.dto';
import { ContaRetorno } from '@/models/contas/retornos/conta.retorno';
import { DepositoDto } from './dtos/deposito.dto';
import { SaqueDto } from './dtos/saque.dto';
import { TransferenciaDto } from './dtos/transferencia.dto';
import { NumeroParamDto } from './dtos/numero-param.dto';
import { IdParamDto } from './dtos/id-param.dto';

@Controller('contas')
export class ContasController {
  constructor(private readonly contasService: ContasService) {}

  @Post()
  criaConta(@Body() novaContaDto: NovaContaDto): Promise<ContaRetorno> {
    return this.contasService.criaConta(novaContaDto);
  }

  @Post('deposito')
  criaDeposito(@Body() depositoDto: DepositoDto): Promise<any> {
    return this.contasService.criaDeposito(depositoDto);
  }

  @Get('deposito/:id')
  encontraDeposito(@Param() params: IdParamDto): Promise<any> {
    return this.contasService.encontraDeposito(+params.id);
  }

  @Post('saque')
  criaSaque(@Body() saqueDto: SaqueDto): Promise<any> {
    return this.contasService.criaSaque(saqueDto);
  }

  @Get('saque/:id')
  encontraSaque(@Param() params: IdParamDto): Promise<any> {
    return this.contasService.encontraSaque(+params.id);
  }

  @Post('transferencia')
  criaTransferencia(@Body() transferenciaDto: TransferenciaDto): Promise<any> {
    return this.contasService.criaTransferencia(transferenciaDto);
  }

  @Get('transferencia/:id')
  encontraTransferencia(@Param() params: IdParamDto): Promise<any> {
    return this.contasService.encontraTransferencia(+params.id);
  }

  @Get(':numero')
  encontraContaPeloNumero(@Param() params: NumeroParamDto): Promise<any> {
    return this.contasService.encontraContaPeloNumero(+params.numero);
  }

  @Get(':numero/saidas')
  saidas(@Param() params: NumeroParamDto): Promise<any> {
    return this.contasService.saidas(+params.numero);
  }

  @Get(':numero/entradas')
  entradas(@Param() params: NumeroParamDto): Promise<any> {
    return this.contasService.entradas(+params.numero);
  }
}
